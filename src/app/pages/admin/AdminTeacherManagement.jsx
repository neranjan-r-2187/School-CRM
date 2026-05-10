import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  BookOpen,
  Users,
  Award,
  X,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
export const AdminTeacherManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [viewTeacher, setViewTeacher] = useState(null);
  const teachers = [
    {
      id: "TCH-2026-001",
      name: "Mrs. Anjali Gupta",
      email: "anjali.gupta@school.edu.in",
      phone: "+91 98765 43210",
      subject: "Mathematics",
      classes: ["10-A", "10-B", "11-A"],
      experience: "12 years",
      qualification: "M.Sc Mathematics, B.Ed",
      avatar: "https://ui-avatars.com/api/?name=Anjali+Gupta&background=3B82F6&color=fff",
      status: "active",
      joiningDate: "2014-06-15",
      avgRating: 4.8,
      totalClasses: 245
    },
    {
      id: "TCH-2026-002",
      name: "Ms. Priya Sharma",
      email: "priya.sharma@school.edu.in",
      phone: "+91 98234 56789",
      subject: "Physics & Chemistry",
      classes: ["10-A", "11-B", "12-A"],
      experience: "8 years",
      qualification: "M.Sc Physics, B.Ed",
      avatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=EC4899&color=fff",
      status: "active",
      joiningDate: "2018-04-10",
      avgRating: 4.6,
      totalClasses: 198
    },
    {
      id: "TCH-2026-003",
      name: "Ms. Meera Iyer",
      email: "meera.iyer@school.edu.in",
      phone: "+91 99887 76655",
      subject: "English",
      classes: ["10-A", "10-B", "11-A", "11-B"],
      experience: "15 years",
      qualification: "MA English Literature, B.Ed",
      avatar: "https://ui-avatars.com/api/?name=Meera+Iyer&background=10B981&color=fff",
      status: "active",
      joiningDate: "2011-08-01",
      avgRating: 4.9,
      totalClasses: 312
    },
    {
      id: "TCH-2026-004",
      name: "Mr. Rahul Roy",
      email: "rahul.roy@school.edu.in",
      phone: "+91 97123 45678",
      subject: "History & Civics",
      classes: ["10-A", "11-A", "12-B"],
      experience: "10 years",
      qualification: "MA History, B.Ed",
      avatar: "https://ui-avatars.com/api/?name=Rahul+Roy&background=8B5CF6&color=fff",
      status: "active",
      joiningDate: "2016-07-15",
      avgRating: 4.5,
      totalClasses: 223
    },
    {
      id: "TCH-2026-005",
      name: "Dr. Sunita Reddy",
      email: "sunita.reddy@school.edu.in",
      phone: "+91 96543 21098",
      subject: "Biology",
      classes: ["11-A", "11-B", "12-A", "12-B"],
      experience: "18 years",
      qualification: "Ph.D. Biology, M.Sc, B.Ed",
      avatar: "https://ui-avatars.com/api/?name=Sunita+Reddy&background=F59E0B&color=fff",
      status: "active",
      joiningDate: "2008-06-20",
      avgRating: 4.9,
      totalClasses: 356
    },
    {
      id: "TCH-2026-006",
      name: "Mr. Vikram Desai",
      email: "vikram.desai@school.edu.in",
      phone: "+91 98876 54321",
      subject: "Computer Science",
      classes: ["10-A", "10-B", "11-A", "12-A"],
      experience: "6 years",
      qualification: "MCA, B.Ed",
      avatar: "https://ui-avatars.com/api/?name=Vikram+Desai&background=EF4444&color=fff",
      status: "active",
      joiningDate: "2020-08-10",
      avgRating: 4.7,
      totalClasses: 167
    },
    {
      id: "TCH-2026-007",
      name: "Ms. Kavita Singh",
      email: "kavita.singh@school.edu.in",
      phone: "+91 99123 87654",
      subject: "Hindi",
      classes: ["10-A", "10-B", "11-A"],
      experience: "9 years",
      qualification: "MA Hindi, B.Ed",
      avatar: "https://ui-avatars.com/api/?name=Kavita+Singh&background=06B6D4&color=fff",
      status: "active",
      joiningDate: "2017-06-15",
      avgRating: 4.4,
      totalClasses: 201
    },
    {
      id: "TCH-2026-008",
      name: "Mr. Arjun Malhotra",
      email: "arjun.malhotra@school.edu.in",
      phone: "+91 97654 32109",
      subject: "Geography",
      classes: ["10-A", "11-B", "12-A"],
      experience: "7 years",
      qualification: "MA Geography, B.Ed",
      avatar: "https://ui-avatars.com/api/?name=Arjun+Malhotra&background=14B8A6&color=fff",
      status: "active",
      joiningDate: "2019-04-01",
      avgRating: 4.6,
      totalClasses: 178
    }
  ];
  const stats = [
    { label: "Total Teachers", value: "87", icon: Users, color: "bg-blue-500", change: "+5 this year" },
    { label: "Active", value: "82", icon: CheckCircle, color: "bg-green-500", change: "94.3%" },
    { label: "Avg Rating", value: "4.7/5", icon: Award, color: "bg-yellow-500", change: "+0.2 this term" },
    { label: "Total Classes", value: "2,145", icon: BookOpen, color: "bg-purple-500", change: "This month" }
  ];
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) || teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()) || teacher.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });
  const handleExport = () => {
    toast.success("Teacher data exported successfully!");
  };
  const handleDelete = (teacherName) => {
    toast.success(`${teacherName} removed from records`);
  };
  const handleEdit = (teacherName) => {
    toast.info(`Opening edit form for ${teacherName}`);
  };
  return <div className="p-8 space-y-6">
      {
    /* View Teacher Modal */
  }
      {viewTeacher && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Teacher Details</h2>
              <button
    onClick={() => setViewTeacher(null)}
    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
  >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {
    /* Profile */
  }
              <div className="flex items-center gap-4">
                <img
    src={viewTeacher.avatar}
    alt={viewTeacher.name}
    className="w-20 h-20 rounded-full"
  />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{viewTeacher.name}</h3>
                  <p className="text-slate-600">{viewTeacher.subject}</p>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 bg-green-100 text-green-700">
                    {viewTeacher.status}
                  </span>
                </div>
              </div>

              {
    /* Stats */
  }
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">Experience</p>
                  <p className="text-lg font-semibold text-blue-900">{viewTeacher.experience}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-600 mb-1">Avg Rating</p>
                  <p className="text-lg font-semibold text-yellow-900">{viewTeacher.avgRating}/5</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600 mb-1">Classes</p>
                  <p className="text-lg font-semibold text-purple-900">{viewTeacher.totalClasses}</p>
                </div>
              </div>

              {
    /* Details */
  }
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Professional Information</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-slate-600">Qualification</p>
                    <p className="font-medium text-slate-900">{viewTeacher.qualification}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Classes Teaching</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {viewTeacher.classes.map((cls, idx) => <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          {cls}
                        </span>)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Joining Date</p>
                    <p className="font-medium text-slate-900">
                      {new Date(viewTeacher.joiningDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>

              {
    /* Contact */
  }
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{viewTeacher.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{viewTeacher.email}</span>
                  </div>
                </div>
              </div>

              {
    /* Actions */
  }
              <div className="flex gap-3 pt-4">
                <button
    onClick={() => {
      handleEdit(viewTeacher.name);
      setViewTeacher(null);
    }}
    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
  >
                  Edit Details
                </button>
                <button
    onClick={() => setViewTeacher(null)}
    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
  >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>}

      {
    /* Header */
  }
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Teacher Management</h1>
          <p className="text-slate-600 mt-1">Manage and track all teacher records</p>
        </div>
        <button
    onClick={() => toast.info("Opening add teacher form")}
    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  >
          <Plus className="w-5 h-5" />
          Add Teacher
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
    /* Search and Filter */
  }
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
    type="text"
    placeholder="Search by name, subject, or email..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
          </div>
          <button
    onClick={handleExport}
    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
  >
            Export
          </button>
        </div>
      </div>

      {
    /* Teachers Grid */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => <div key={teacher.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <img
    src={teacher.avatar}
    alt={teacher.name}
    className="w-16 h-16 rounded-full"
  />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{teacher.name}</h3>
                <p className="text-sm text-slate-600">{teacher.subject}</p>
                <p className="text-xs text-slate-500 mt-1">{teacher.id}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Experience:</span>
                <span className="font-medium text-slate-900">{teacher.experience}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Rating:</span>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium text-slate-900">{teacher.avgRating}/5</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Classes:</span>
                <span className="font-medium text-slate-900">{teacher.classes.length}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {teacher.classes.slice(0, 3).map((cls, idx) => <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                  {cls}
                </span>)}
              {teacher.classes.length > 3 && <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                  +{teacher.classes.length - 3}
                </span>}
            </div>

            <div className="flex gap-2">
              <button
    onClick={() => setViewTeacher(teacher)}
    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
  >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button
    onClick={() => handleEdit(teacher.name)}
    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
  >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
    onClick={() => handleDelete(teacher.name)}
    className="px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
  >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>)}
      </div>
    </div>;
};
