import { Users, BookOpen, UserCheck, TrendingUp, Plus, Edit, Eye } from "lucide-react";
import { toast } from "sonner";
export const AdminClassManagement = () => {
  const classes = [
    {
      id: "CLS-10-A",
      name: "Class 10-A",
      classTeacher: "Mrs. Anjali Gupta",
      totalStudents: 42,
      avgAttendance: 95.2,
      avgPerformance: 85.4,
      subjects: ["Mathematics", "Physics", "Chemistry", "English", "Hindi", "History"]
    },
    {
      id: "CLS-10-B",
      name: "Class 10-B",
      classTeacher: "Ms. Kavita Singh",
      totalStudents: 38,
      avgAttendance: 93.7,
      avgPerformance: 82.8,
      subjects: ["Mathematics", "Physics", "Chemistry", "English", "Hindi", "Geography"]
    },
    {
      id: "CLS-11-A",
      name: "Class 11-A (Science)",
      classTeacher: "Dr. Sunita Reddy",
      totalStudents: 35,
      avgAttendance: 94.1,
      avgPerformance: 83.6,
      subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English"]
    },
    {
      id: "CLS-11-B",
      name: "Class 11-B (Commerce)",
      totalStudents: 40,
      classTeacher: "Mr. Rahul Roy",
      avgAttendance: 92.5,
      avgPerformance: 81.2,
      subjects: ["Accountancy", "Business Studies", "Economics", "English", "Mathematics"]
    },
    {
      id: "CLS-12-A",
      name: "Class 12-A (Science)",
      classTeacher: "Ms. Priya Sharma",
      totalStudents: 30,
      avgAttendance: 96.7,
      avgPerformance: 87.9,
      subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English"]
    },
    {
      id: "CLS-12-B",
      name: "Class 12-B (Commerce)",
      classTeacher: "Mr. Vikram Desai",
      totalStudents: 32,
      avgAttendance: 94.8,
      avgPerformance: 84.5,
      subjects: ["Accountancy", "Business Studies", "Economics", "English", "Mathematics"]
    }
  ];
  const stats = [
    { label: "Total Classes", value: "42", icon: BookOpen, color: "bg-blue-500", change: "Across all grades" },
    { label: "Total Students", value: "1,245", icon: Users, color: "bg-green-500", change: "+45 this year" },
    { label: "Avg Attendance", value: "94.5%", icon: UserCheck, color: "bg-purple-500", change: "+2.1% this month" },
    { label: "Avg Performance", value: "84.2%", icon: TrendingUp, color: "bg-yellow-500", change: "+3.5% this term" }
  ];
  return <div className="p-8 space-y-6">
      {
    /* Header */
  }
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Class Management</h1>
          <p className="text-slate-600 mt-1">Manage classes, sections, and student assignments</p>
        </div>
        <button
    onClick={() => toast.info("Opening add class form")}
    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  >
          <Plus className="w-5 h-5" />
          Add Class
        </button>
      </div>

      {
    /* Stats */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">{stat.change}</p>
          </div>)}
      </div>

      {
    /* Classes Grid */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => <div key={cls.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900 mb-1">{cls.name}</h3>
              <p className="text-sm text-slate-600">Class Teacher: {cls.classTeacher}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">Students</p>
                <p className="text-lg font-bold text-blue-900">{cls.totalStudents}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-600 mb-1">Attendance</p>
                <p className="text-lg font-bold text-green-900">{cls.avgAttendance}%</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-600">Avg Performance</span>
                <span className="font-semibold text-slate-900">{cls.avgPerformance}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
    className="bg-green-500 h-2 rounded-full"
    style={{ width: `${cls.avgPerformance}%` }}
  />
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-slate-600 mb-2">Subjects ({cls.subjects.length})</p>
              <div className="flex flex-wrap gap-1">
                {cls.subjects.slice(0, 3).map((subject, idx) => <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                    {subject}
                  </span>)}
                {cls.subjects.length > 3 && <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                    +{cls.subjects.length - 3} more
                  </span>}
              </div>
            </div>

            <div className="flex gap-2">
              <button
    onClick={() => toast.info(`Viewing details for ${cls.name}`)}
    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
  >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button
    onClick={() => toast.info(`Editing ${cls.name}`)}
    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
  >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>)}
      </div>
    </div>;
};
