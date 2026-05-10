import { motion } from "motion/react";
import { CheckCircle2, AlertCircle, Clock, TrendingUp } from "lucide-react";
import { Card, CardTitle } from "../../components/ui/Card";

const attendanceStats = {
  present: 145,
  absent: 3,
  late: 2,
  percentage: "96.6%"
};

export const ParentAttendance = () => {
  return (
    <motion.div
      key="attendance"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Attendance Record</h1>
        <p className="text-slate-500 mt-1">Monthly attendance tracking and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">{attendanceStats.present}</p>
          <p className="text-sm text-slate-500 mt-1">Days Present</p>
        </Card>

        <Card className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">{attendanceStats.absent}</p>
          <p className="text-sm text-slate-500 mt-1">Days Absent</p>
        </Card>

        <Card className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-600">{attendanceStats.late}</p>
          <p className="text-sm text-slate-500 mt-1">Times Late</p>
        </Card>

        <Card className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{attendanceStats.percentage}</p>
          <p className="text-sm text-slate-500 mt-1">Overall %</p>
        </Card>
      </div>

      <Card>
        <CardTitle className="mb-4">Monthly Attendance Overview</CardTitle>
        <div className="grid grid-cols-7 gap-2">
          {/* Calendar view would go here */}
          <p className="col-span-7 text-center text-slate-500 py-8">
            Calendar view with detailed daily attendance
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
