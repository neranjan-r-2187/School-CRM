import { Plus, GraduationCap, Clock, BookOpen } from "lucide-react";
import { Card } from "../../components/ui/Card";

const myClasses = [
  { id: "class1", name: "Class 10-A", subject: "Physics", students: 42, schedule: "Mon, Wed, Fri - 09:00 AM", room: "Room 301", avgAttendance: 94.5, avgGrade: 78.2 },
  { id: "class2", name: "Class 10-B", subject: "Physics", students: 38, schedule: "Tue, Thu - 10:00 AM", room: "Room 301", avgAttendance: 91.2, avgGrade: 75.8 },
  { id: "class3", name: "Class 11-A", subject: "Chemistry", students: 35, schedule: "Mon, Wed, Fri - 11:00 AM", room: "Lab 2", avgAttendance: 89.7, avgGrade: 72.5 },
  { id: "class4", name: "Class 11-B", subject: "Chemistry", students: 40, schedule: "Tue, Thu - 02:00 PM", room: "Lab 2", avgAttendance: 92.3, avgGrade: 76.1 }
];

export const TeacherClasses = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">My Classes</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myClasses.map((cls) => (
          <Card key={cls.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{cls.name}</h3>
                <p className="text-blue-600 font-medium">{cls.subject}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Total Students</span>
                <span className="font-semibold text-slate-900">{cls.students}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Avg Attendance</span>
                <span className="font-semibold text-green-600">{cls.avgAttendance}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Avg Grade</span>
                <span className="font-semibold text-purple-600">{cls.avgGrade}%</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                <Clock className="w-4 h-4" />
                {cls.schedule}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <BookOpen className="w-4 h-4" />
                {cls.room}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                View Details
              </button>
              <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                Mark Attendance
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
