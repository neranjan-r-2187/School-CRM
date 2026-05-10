import { motion } from "motion/react";
import { Download } from "lucide-react";
import { Card, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

const feesData = [
  { id: 1, title: "Tuition Fee - Term 2", amount: "₹12,000", date: "Due Mar 15", status: "Pending" },
  { id: 2, title: "Bus Fee - Feb", amount: "₹1,500", date: "Paid Feb 10", status: "Paid" },
  { id: 3, title: "Lab Fee", amount: "₹3,000", date: "Paid Jan 20", status: "Paid" }
];

export const ParentFees = () => {
  return (
    <motion.div
      key="fees"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Fee Payments</h1>
        <p className="text-slate-500 mt-1">Manage and track fee payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-slate-500 font-medium mb-2">Total Fees (Annual)</p>
          <p className="text-3xl font-bold text-slate-900">₹60,000</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500 font-medium mb-2">Paid</p>
          <p className="text-3xl font-bold text-green-600">₹48,000</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500 font-medium mb-2">Pending</p>
          <p className="text-3xl font-bold text-orange-600">₹12,000</p>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <CardTitle>Payment History</CardTitle>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            Download Receipt
          </button>
        </div>
        <div className="space-y-3">
          {feesData.map((fee) => (
            <div key={fee.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{fee.title}</p>
                <p className="text-sm text-slate-500 mt-1">{fee.date}</p>
              </div>
              <div className="flex items-center gap-6">
                <p className="text-lg font-bold text-slate-900">{fee.amount}</p>
                <Badge variant={fee.status === "Paid" ? "success" : "warning"} className="min-w-[80px] justify-center px-4 py-2 text-sm">
                  {fee.status}
                </Badge>
                {fee.status === "Pending" && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};
