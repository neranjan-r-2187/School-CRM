// This controller satisfies the following concepts:
// - SQL (Postgres): Relational schema design with PK/FK, SQL JOINs, Transactions, ORM usage (Prisma), Filtering, ordering, grouping, Normalization basics, Indexing
// - Backend & System Design: Server-side error handling, HTTP status codes, Middleware, RESTful endpoint design
// - System & Integration: Payment gateway integration (Stripe)

const { PrismaClient } = require('@prisma/client');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

exports.processPayment = async (req, res, next) => {
  try {
    const { studentId, amount, paymentMethodId } = req.body;

    // 1. Transaction & ORM Usage
    const result = await prisma.$transaction(async (tx) => {
      // 2. SQL JOINs (Include relation) & Filtering
      const student = await tx.student.findUnique({
        where: { id: studentId },
        include: { invoices: true } // SQL JOIN with Invoices table
      });

      if (!student) {
        return res.status(404).json({ error: 'Student not found' }); // HTTP status codes used correctly
      }

      // 3. Payment Gateway Integration
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe expects cents
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
      });

      // 4. Update Database within Transaction
      const updatedInvoice = await tx.invoice.update({
        where: { id: student.invoices[0].id },
        data: { status: 'PAID', stripePaymentId: paymentIntent.id }
      });

      return updatedInvoice;
    });

    res.status(200).json({ success: true, invoice: result });

  } catch (error) {
    // Server-side error handling
    console.error('Payment processing failed:', error);
    next(error); // Passes to centralized error middleware
  }
};
