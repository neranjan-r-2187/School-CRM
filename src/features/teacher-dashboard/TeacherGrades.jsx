import { Award, TrendingUp, AlertCircle } from "lucide-react";
import { Card } from "../../components/ui/Card";

const myClasses = [
  { id: "class1", name: "Class 10-A", subject: "Physics" },
  { id: "class2", name: "Class 10-B", subject: "Physics" },
  { id: "class3", name: "Class 11-A", subject: "Chemistry" },
  { id: "class4", name: "Class 11-B", subject: "Chemistry" }
];

export const TeacherGrades = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Submit Grades</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Select Class</option>
            {myClasses.map((cls) => (
              <option key={cls.id}>{cls.name} - {cls.subject}</option>
            ))}
          </select>
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Select Exam</option>
            <option>Unit Test 1</option>
            <option>Mid Term</option>
            <option>Unit Test 2</option>
            <option>Final Exam</option>
          </select>
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Select Subject</option>
            <option>Physics</option>
            <option>Chemistry</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Load Students
          </button>
        </div>

        <div className="text-center py-12 text-slate-500">
          <Award className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <p>Select class, exam, and subject to enter grades</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Class Average</p>
              <p className="text-2xl font-bold text-slate-900">76.2%</p>
            </div>
          </div>
          <p className="text-sm text-green-600">+3.1% improvement</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Above 80%</p>
              <p className="text-2xl font-bold text-slate-900">62</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">Out of 155 students</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Below 50%</p>
              <p className="text-2xl font-bold text-slate-900">8</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">Need intervention</p>
        </Card>
      </div>
    </div>
  );
};
