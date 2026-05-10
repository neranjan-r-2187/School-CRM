import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  UserCheck,
  UserX,
  TrendingUp,
  Award,
  X,
  Users
} from "lucide-react";
import { toast } from "sonner";
export function StudentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewStudent, setViewStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const students = [
    {
      id: "STU-2026-0142",
      name: "Aarav Kumar",
      class: "10",
      section: "A",
      rollNo: 15,
      parentName: "Ravi Kumar",
      phone: "+91 98765 43210",
      email: "aarav.kumar@school.edu.in",
      avatar: "https://ui-avatars.com/api/?name=Aarav+Kumar&background=3B82F6&color=fff",
      attendance: 96.5,
      avgGrade: 88.5,
      status: "active",
      dob: "2010-08-15",
      address: "B-204, Green Valley, Noida",
      bloodGroup: "O+",
      admissionDate: "2024-04-01"
    },
    {
      id: "STU-2026-0087",
      name: "Priya Patel",
      class: "10",
      section: "B",
      rollNo: 22,
      parentName: "Amit Patel",
      phone: "+91 98234 56789",
      email: "priya.patel@school.edu.in",
      avatar: "https://ui-avatars.com/api/?name=Priya+Patel&background=EC4899&color=fff",
      attendance: 94.8,
      avgGrade: 92.3,
      status: "active",
      dob: "2010-11-22",
      address: "A-305, Lotus Enclave, Gurgaon",
      bloodGroup: "A+",
      admissionDate: "2024-04-01"
    },
    {
      id: "STU-2026-0201",
      name: "Rohan Sharma",
      class: "11",
      section: "A",
      rollNo: 8,
      parentName: "Vikram Sharma",
      phone: "+91 99887 76655",
      email: "rohan.sharma@school.edu.in",
      avatar: "https://ui-avatars.com/api/?name=Rohan+Sharma&background=10B981&color=fff",
      attendance: 91.2,
      avgGrade: 85.7,
      status: "active",
      dob: "2009-05-10",
      address: "C-102, Sunshine Towers, Delhi",
      bloodGroup: "B+",
      admissionDate: "2023-04-01"
    },
    {
      id: "STU-2026-0155",
      name: "Ananya Singh",
      class: "10",
      section: "A",
      rollNo: 5,
      parentName: "Rajesh Singh",
      phone: "+91 97123 45678",
      email: "ananya.singh@school.edu.in",
      avatar: "https://ui-avatars.com/api/?name=Ananya+Singh&background=8B5CF6&color=fff",
      attendance: 98.2,
      avgGrade: 90.1,
      status: "active",
      dob: "2010-03-18",
      address: "D-501, Pearl Heights, Noida",
      bloodGroup: "AB+",
      admissionDate: "2024-04-01"
    },
    {
      id: "STU-2026-0178",
      name: "Arjun Reddy",
      class: "11",
      section: "B",
      rollNo: 12,
      parentName: "Suresh Reddy",
      phone: "+91 96543 21098",
      email: "arjun.reddy@school.edu.in",
      avatar: "https://ui-avatars.com/api/?name=Arjun+Reddy&background=F59E0B&color=fff",
      attendance: 89.5,
      avgGrade: 78.4,
      status: "active",
      dob: "2009-09-25",
      address: "E-203, Royal Gardens, Gurgaon",
      bloodGroup: "O-",
      admissionDate: "2023-04-01"
    },
    {
      id: "STU-2026-0234",
      name: "Kavya Iyer",
      class: "11",
      section: "B",
      rollNo: 18,
      parentName: "Meera Iyer",
      phone: "+91 98876 54321",
      email: "kavya.iyer@school.edu.in",
      avatar: "https://ui-avatars.com/api/?name=Kavya+Iyer&background=EF4444&color=fff",
      attendance: 93.7,
      avgGrade: 87.9,
      status: "active",
      dob: "2009-12-08",
      address: "F-105, Lake View, Delhi",
      bloodGroup: "A-",
      admissionDate: "2023-04-01"
    },
    {
      id: "STU-2026-0098",
      name: "Vikram Gupta",
      class: "10",
      section: "B",
      rollNo: 30,
      parentName: "Anjali Gupta",
      phone: "+91 99123 87654",
      email: "vikram.gupta@school.edu.in",
      avatar: "https://ui-avatars.com/api/?name=Vikram+Gupta&background=06B6D4&color=fff",
      attendance: 87.3,
      avgGrade: 75.2,
      status: "active",
      dob: "2010-07-14",
      address: "G-402, Star Residency, Noida",
      bloodGroup: "B-",
      admissionDate: "2024-04-01"
    },
    {
      id: "STU-2026-0189",
      name: "Sneha Malhotra",
      class: "11",
      section: "A",
      rollNo: 25,
      parentName: "Karan Malhotra",
      phone: "+91 97654 32109",
      email: "sneha.malhotra@school.edu.in",
      avatar: "https://ui-avatars.com/api/?name=Sneha+Malhotra&background=14B8A6&color=fff",
      attendance: 95.1,
      avgGrade: 89.6,
      status: "active",
      dob: "2009-02-20",
      address: "H-301, Green Park, Gurgaon",
      bloodGroup: "O+",
      admissionDate: "2023-04-01"
    },
    {
      id: "STU-2026-0312",
      name: "Aditya Chopra",
      class: "12",
      section: "A",
      rollNo: 10,
      parentName: "Neha Chopra",
      phone: "+91 98111 22334",
      email: "aditya.chopra@school.edu.in",
      avatar: "https://ui-avatars.com/api/?name=Aditya+Chopra&background=8B5CF6&color=fff",
      attendance: 92.8,
      avgGrade: 86.3,
      status: "active",
      dob: "2008-06-12",
      address: "J-201, Vista Apartments, Delhi",
      bloodGroup: "A+",
      admissionDate: "2022-04-01"
    },
    {
      id: "STU-2026-0287",
      name: "Diya Mehta",
      class: "12",
      section: "B",
      rollNo: 15,
      parentName: "Rajiv Mehta",
      phone: "+91 97222 33445",
      email: "diya.mehta@school.edu.in",
      avatar: "https://ui-avatars.com/api/?name=Diya+Mehta&background=EC4899&color=fff",
      attendance: 96.2,
      avgGrade: 91.5,
      status: "active",
      dob: "2008-09-30",
      address: "K-405, Skyline Towers, Noida",
      bloodGroup: "B+",
      admissionDate: "2022-04-01"
    },
    {
      id: "STU-2026-0145",
      name: "Ishaan Kapoor",
      class: "10",
      section: "A",
      rollNo: 18,
      parentName: "Priya Kapoor",
      phone: "+91 98765 11223",
      email: "ishaan.kapoor@school.edu.in",
      avatar: "https://ui-avatars.com/api/?name=Ishaan+Kapoor&background=3B82F6&color=fff",
      attendance: 88.9,
      avgGrade: 79.8,
      status: "active",
      dob: "2010-01-25",
      address: "L-102, Palm Grove, Gurgaon",
      bloodGroup: "AB+",
      admissionDate: "2024-04-01"
    },
    {
      id: "STU-2026-0256",
      name: "Saanvi Joshi",
      class: "11",
      section: "A",
      rollNo: 20,
      parentName: "Manish Joshi",
      phone: "+91 96333 44556",
      email: "saanvi.joshi@school.edu.in",
      avatar: "https://ui-avatars.com/api/?name=Saanvi+Joshi&background=10B981&color=fff",
      attendance: 94.5,
      avgGrade: 88.2,
      status: "active",
      dob: "2009-04-15",
      address: "M-303, Eden Gardens, Delhi",
      bloodGroup: "O+",
      admissionDate: "2023-04-01"
    },
    {
      id: "STU-2026-0198",
      name: "Vihaan Saxena",
      class: "12",
      section: "A",
      rollNo: 22,
      parentName: "Sunita Saxena",
      phone: "+91 99444 55667",
      email: "vihaan.saxena@school.edu.in",
      avatar: "https://ui-avatars.com/api/?name=Vihaan+Saxena&background=F59E0B&color=fff",
      attendance: 90.3,
      avgGrade: 84.7,
      status: "active",
      dob: "2008-11-08",
      address: "N-501, Crystal Heights, Noida",
      bloodGroup: "A+",
      admissionDate: "2022-04-01"
    },
    {
      id: "STU-2026-0223",
      name: "Myra Nair",
      class: "10",
      section: "B",
      rollNo: 25,
      parentName: "Karthik Nair",
      phone: "+91 98555 66778",
      email: "myra.nair@school.edu.in",
      avatar: "https://ui-avatars.com/api/?name=Myra+Nair&background=EF4444&color=fff",
      attendance: 93.1,
      avgGrade: 87.4,
      status: "active",
      dob: "2010-05-20",
      address: "O-204, Rainbow Residency, Gurgaon",
      bloodGroup: "B+",
      admissionDate: "2024-04-01"
    },
    {
      id: "STU-2026-0167",
      name: "Aadhya Desai",
      class: "11",
      section: "B",
      rollNo: 28,
      parentName: "Ritu Desai",
      phone: "+91 97666 77889",
      email: "aadhya.desai@school.edu.in",
      avatar: "https://ui-avatars.com/api/?name=Aadhya+Desai&background=06B6D4&color=fff",
      attendance: 91.7,
      avgGrade: 82.9,
      status: "active",
      dob: "2009-08-18",
      address: "P-106, Metro Plaza, Delhi",
      bloodGroup: "AB-",
      admissionDate: "2023-04-01"
    },
    {
      id: "STU-2026-0134",
      name: "Reyansh Bose",
      class: "12",
      section: "B",
      rollNo: 12,
      parentName: "Anita Bose",
      phone: "+91 96777 88990",
      email: "reyansh.bose@school.edu.in",
      avatar: "https://ui-avatars.com/api/?name=Reyansh+Bose&background=14B8A6&color=fff",
      attendance: 89.2,
      avgGrade: 80.6,
      status: "active",
      dob: "2008-03-22",
      address: "Q-302, Heritage Towers, Noida",
      bloodGroup: "O-",
      admissionDate: "2022-04-01"
    },
    {
      id: "STU-2026-0089",
      name: "Kiara Pillai",
      class: "10",
      section: "A",
      rollNo: 28,
      parentName: "Deepak Pillai",
      phone: "+91 98888 99001",
      email: "kiara.pillai@school.edu.in",
      avatar: "https://ui-avatars.com/api/?name=Kiara+Pillai&background=8B5CF6&color=fff",
      attendance: 85.4,
      avgGrade: 73.2,
      status: "inactive",
      dob: "2010-10-05",
      address: "R-405, Silver Oaks, Gurgaon",
      bloodGroup: "A-",
      admissionDate: "2024-04-01"
    },
    {
      id: "STU-2026-0276",
      name: "Ayaan Khan",
      class: "11",
      section: "A",
      rollNo: 14,
      parentName: "Farah Khan",
      phone: "+91 99999 00112",
      email: "ayaan.khan@school.edu.in",
      avatar: "https://ui-avatars.com/api/?name=Ayaan+Khan&background=3B82F6&color=fff",
      attendance: 92.6,
      avgGrade: 85.8,
      status: "active",
      dob: "2009-07-28",
      address: "S-201, Jade Residency, Delhi",
      bloodGroup: "B+",
      admissionDate: "2023-04-01"
    }
  ];
  const stats = [
    { label: "Total Students", value: "1,245", icon: GraduationCap, color: "bg-blue-500", change: "+45 this year" },
    { label: "Active", value: "1,198", icon: UserCheck, color: "bg-green-500", change: "96.2%" },
    { label: "Inactive", value: "47", icon: UserX, color: "bg-red-500", change: "3.8%" },
    { label: "Avg Attendance", value: "92.8%", icon: TrendingUp, color: "bg-purple-500", change: "+2.1%" }
  ];
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.id.toLowerCase().includes(searchQuery.toLowerCase()) || student.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === "all" || student.class === selectedClass;
    const matchesStatus = selectedStatus === "all" || student.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });
  const handleExport = () => {
    toast.success("Student data exported successfully!");
  };
  const handleDelete = (studentName) => {
    toast.success(`${studentName} removed from records`);
  };
  const handleEdit = (studentName) => {
    toast.info(`Opening edit form for ${studentName}`);
  };
  return <div className="p-8 space-y-6">
      {
    /* View Student Modal */
  }
      {viewStudent && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Student Details</h2>
              <button
    onClick={() => setViewStudent(null)}
    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
  >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {
    /* Profile Section */
  }
              <div className="flex items-center gap-4">
                <img
    src={viewStudent.avatar}
    alt={viewStudent.name}
    className="w-20 h-20 rounded-full"
  />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{viewStudent.name}</h3>
                  <p className="text-slate-600">{viewStudent.id}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${viewStudent.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {viewStudent.status}
                  </span>
                </div>
              </div>

              {
    /* Academic Info */
  }
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Class</p>
                  <p className="text-lg font-semibold text-slate-900">{viewStudent.class}-{viewStudent.section}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Roll Number</p>
                  <p className="text-lg font-semibold text-slate-900">{viewStudent.rollNo}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">Attendance</p>
                  <p className="text-lg font-semibold text-blue-900">{viewStudent.attendance}%</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">Average Grade</p>
                  <p className="text-lg font-semibold text-green-900">{viewStudent.avgGrade}%</p>
                </div>
              </div>

              {
    /* Personal Info */
  }
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Date of Birth</p>
                    <p className="font-medium text-slate-900">{new Date(viewStudent.dob).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Blood Group</p>
                    <p className="font-medium text-slate-900">{viewStudent.bloodGroup}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Admission Date</p>
                    <p className="font-medium text-slate-900">{new Date(viewStudent.admissionDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                </div>
              </div>

              {
    /* Parent Info */
  }
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Parent/Guardian Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-900">{viewStudent.parentName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{viewStudent.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{viewStudent.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                    <span className="text-slate-700">{viewStudent.address}</span>
                  </div>
                </div>
              </div>

              {
    /* Action Buttons */
  }
              <div className="flex gap-3 pt-4">
                <button
    onClick={() => {
      handleEdit(viewStudent.name);
      setViewStudent(null);
    }}
    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
  >
                  Edit Details
                </button>
                <button
    onClick={() => setViewStudent(null)}
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
          <h1 className="text-3xl font-bold text-slate-900">Student Management</h1>
          <p className="text-slate-600 mt-1">Manage and track all student records</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Student
        </button>
      </div>

      {
    /* Statistics Cards */
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
    /* Filters and Search */
  }
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
    type="text"
    placeholder="Search by name, ID, or parent name..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
          </div>
          <select
    value={selectedClass}
    onChange={(e) => setSelectedClass(e.target.value)}
    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
            <option value="all">All Classes</option>
            <option value="10">Class 10</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button
    onClick={handleExport}
    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
  >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {
    /* Students Table */
  }
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Student</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Class</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Parent</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Attendance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Avg Grade</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.map((student) => <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
    src={student.avatar}
    alt={student.name}
    className="w-10 h-10 rounded-full"
  />
                      <div>
                        <p className="font-semibold text-slate-900">{student.name}</p>
                        <p className="text-sm text-slate-500">{student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{student.class}-{student.section}</span>
                      <span className="text-sm text-slate-500">Roll {student.rollNo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-900">{student.parentName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-4 h-4" />
                        {student.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4" />
                        {student.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[80px]">
                        <div
    className={`h-2 rounded-full ${student.attendance >= 95 ? "bg-green-500" : student.attendance >= 90 ? "bg-blue-500" : student.attendance >= 85 ? "bg-yellow-500" : "bg-red-500"}`}
    style={{ width: `${student.attendance}%` }}
  />
                      </div>
                      <span className="text-sm font-medium text-slate-900">{student.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${student.avgGrade >= 90 ? "bg-green-100 text-green-700" : student.avgGrade >= 80 ? "bg-blue-100 text-blue-700" : student.avgGrade >= 70 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      <Award className="w-4 h-4" />
                      {student.avgGrade}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
    onClick={() => setViewStudent(student)}
    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
    title="View"
  >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
    onClick={() => handleEdit(student.name)}
    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
    title="Edit"
  >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
    onClick={() => handleDelete(student.name)}
    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
    title="Delete"
  >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>

        {
    /* Pagination */
  }
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            Showing <span className="font-medium">{filteredStudents.length}</span> of <span className="font-medium">{students.length}</span> students
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              1
            </button>
            <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              3
            </button>
            <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>;
}
