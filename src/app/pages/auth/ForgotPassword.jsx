import { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Mail, ArrowLeft, CheckCircle } from "lucide-react";
export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };
  return <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="p-3 bg-primary/10 rounded-xl">
            <GraduationCap className="w-10 h-10 text-primary" />
          </div>
        </div>

        {!isSubmitted ? <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Forgot Password?</h2>
              <p className="text-muted-foreground">
                No worries, we'll send you reset instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
    id="email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="admin@school.com"
    className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
    required
  />
                </div>
              </div>

              <button
    type="submit"
    className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
  >
                Reset Password
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
    to="/login"
    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
  >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          </> : <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="p-4 bg-accent/10 rounded-full">
                <CheckCircle className="w-16 h-16 text-accent" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Check your email</h2>
            <p className="text-muted-foreground mb-8">
              We sent a password reset link to<br />
              <span className="font-medium text-foreground">{email}</span>
            </p>
            <Link
    to="/login"
    className="inline-flex items-center gap-2 text-primary hover:underline"
  >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>}
      </div>
    </div>;
}
