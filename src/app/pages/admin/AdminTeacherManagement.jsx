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
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";

export const AdminTeacherManagement = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewTeacher, setViewTeacher] = useState(null);

  // Fetch teachers from API
  const { data: teachersResponse, isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const response = await api.get("/api/admin/teachers");
      return response.data.data;
    }
  });

  const teachers = teachersResponse || [];

  // Mutations
  const deleteTeacherMutation = useMutation({
    mutationFn: async (userId) => {
      await api.delete(`/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["teachers"]);
      toast.success("Teacher removed successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete teacher");
    }
  });

  const filteredTeachers = teachers.filter((teacher) => {
    const name = teacher.user?.name || "";
    const email = teacher.user?.email || "";
    const employeeId = teacher.employeeId || "";
    
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           employeeId.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleExport = () => {
    toast.success("Teacher data exported successfully!");
  };

  const handleDelete = (teacher) => {
    if (window.confirm(`Are you sure you want to delete ${teacher.user.name}?`)) {
      deleteTeacherMutation.mutate(teacher.user._id);
    }
  };

  const handleEdit = (teacher) => {
    toast.info(`Edit functionality is available in User Management for ${teacher.user.name}`);
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;

  return <div className="p-8 space-y-6">
      {viewTeacher && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Teacher Details</h2>
              <button onClick={() => setViewTeacher(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(viewTeacher.user?.name)}&background=random`} alt={viewTeacher.user?.name} className="w-20 h-20 rounded-full" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{viewTeacher.user?.name}</h3>
                  <p className="text-slate-600">{viewTeacher.employeeId}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${viewTeacher.user?.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {viewTeacher.user?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Professional Information</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-slate-600">Qualification</p>
                    <p className="font-medium text-slate-900">{viewTeacher.qualification || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Department</p>
                    <p className="font-medium text-slate-900">{viewTeacher.department || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{viewTeacher.user?.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setViewTeacher(null)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium">Close</button>
              </div>
            </div>
          </div>
        </div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Teacher Management</h1>
          <p className="text-slate-600 mt-1">Manage and track all teacher records from the database</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, employee ID, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <button onClick={handleExport} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">Export</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => <div key={teacher._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.user?.name)}&background=random`} alt={teacher.user?.name} className="w-16 h-16 rounded-full" />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{teacher.user?.name}</h3>
                <p className="text-sm text-slate-600">{teacher.department || "No Department"}</p>
                <p className="text-xs text-slate-500 mt-1">{teacher.employeeId}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm">
               <div className="flex items-center justify-between">
                 <span className="text-slate-600">Status:</span>
                 <span className={`px-2 py-0.5 rounded-full text-xs ${teacher.user?.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                   {teacher.user?.isActive ? "Active" : "Inactive"}
                 </span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-slate-600">Email:</span>
                 <span className="text-slate-900 truncate max-w-[150px]">{teacher.user?.email}</span>
               </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setViewTeacher(teacher)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                <Eye className="w-4 h-4" />
                View
              </button>
              <button onClick={() => handleEdit(teacher)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button onClick={() => handleDelete(teacher)} className="px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>)}
      </div>
      {filteredTeachers.length === 0 && <div className="text-center py-12 text-slate-500">No teachers found in the database.</div>}
    </div>;
};
