import { Users, BookOpen, UserCheck, TrendingUp, Plus, Edit, Eye, Loader2, X, Trash2, GraduationCap, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import { useState } from "react";
import { Card, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useNavigate } from "react-router-dom";

export const AdminClassManagement = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({ name: "", section: "", classTeacherId: "" });

  // Fetch classes from API
  const { data: classesResponse, isLoading: isLoadingClasses, isError: isErrorClasses } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const response = await api.get("/classes");
      return response.data.data;
    }
  });

  // Fetch teachers for selection
  const { data: teachersResponse, isLoading: isLoadingTeachers } = useQuery({
    queryKey: ["teachers-minimal"],
    queryFn: async () => {
      const response = await api.get("/admin/teachers");
      return response.data.data;
    }
  });

  const classes = classesResponse || [];
  const teachers = teachersResponse || [];

  // Mutations
  const createClassMutation = useMutation({
    mutationFn: async (newClass) => {
      await api.post("/admin/classes", newClass);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["classes"]);
      toast.success("Class created successfully");
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create class");
    }
  });

  const updateClassMutation = useMutation({
    mutationFn: async ({ id, ...data }) => {
      await api.put(`/admin/classes/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["classes"]);
      toast.success("Class updated successfully");
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update class");
    }
  });

  const deleteClassMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/classes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["classes"]);
      toast.success("Class deleted successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete class");
    }
  });

  const handleOpenModal = (cls = null) => {
    if (cls) {
      setEditingClass(cls);
      setFormData({ 
        name: cls.name, 
        section: cls.section, 
        classTeacherId: cls.classTeacher?._id || cls.classTeacher || "" 
      });
    } else {
      setEditingClass(null);
      setFormData({ name: "", section: "", classTeacherId: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClass) {
      updateClassMutation.mutate({ id: editingClass._id, ...formData });
    } else {
      createClassMutation.mutate(formData);
    }
  };

  if (isLoadingClasses) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Class Management</h1>
          <p className="text-slate-600 mt-1">Configure academic structure and teacher assignments</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-all shadow-lg shadow-slate-950/20 font-bold text-sm">
          <Plus className="w-4 h-4" />
          Add New Class
        </button>
      </div>

      {isErrorClasses && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3 font-medium">
          <TrendingUp className="w-5 h-5" />
          Failed to load classes. Please try again later.
        </div>
      )}

      {classes.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Academic Structure is Empty</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">Define your school's classes and sections to begin managing students and faculty.</p>
          <button onClick={() => handleOpenModal()} className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            Create First Class
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls._id} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(cls)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => { if(window.confirm("Delete this class?")) deleteClassMutation.mutate(cls._id); }} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-black text-slate-900">Class {cls.name}</h3>
                  <Badge variant="primary" className="h-6">{cls.section}</Badge>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-slate-400" />
                  </div>
                  <span>{cls.classTeacher?.user?.name || cls.classTeacher?.name || "Unassigned Teacher"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Students</p>
                  <p className="text-xl font-black text-slate-900">--</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Schedule</p>
                  <p className="text-xs font-bold text-blue-600">Active</p>
                </div>
              </div>

              <button 
                onClick={() => navigate('/admin/dashboard/timetable-approvals')}
                className="w-full py-3 bg-slate-50 text-slate-900 rounded-2xl text-sm font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 border border-slate-100 group/btn"
              >
                <Calendar className="w-4 h-4 text-blue-600 group-hover/btn:text-white" />
                Manage Timetable
              </button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-300 border border-white/20">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-900">{editingClass ? "Refine Class" : "Initialize Class"}</h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">Configure academic parameters</p>
              </div>
              <button onClick={handleCloseModal} className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 rounded-2xl transition-all">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Class Identifier</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-slate-900" 
                  placeholder="e.g. 10 or Senior-A" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Section</label>
                <input 
                  type="text" 
                  required 
                  value={formData.section} 
                  onChange={e => setFormData({...formData, section: e.target.value})} 
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-slate-900" 
                  placeholder="e.g. A, B, Alpha" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Class Custodian (Teacher)</label>
                <div className="relative">
                  <select
                    value={formData.classTeacherId}
                    onChange={e => setFormData({...formData, classTeacherId: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                  >
                    <option value="">Select Faculty Member</option>
                    {teachers.map(t => (
                      <option key={t._id} value={t._id}>
                        {t.user?.name || "Unknown"} — {t.department || "General"}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <TrendingUp className="w-5 h-5 rotate-90" />
                  </div>
                </div>
                {isLoadingTeachers && <p className="text-[10px] text-blue-600 animate-pulse font-black uppercase tracking-widest">Syncing faculty database...</p>}
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button" 
                  onClick={handleCloseModal} 
                  className="flex-1 px-6 py-4 rounded-2xl text-sm font-black text-slate-500 hover:bg-slate-100 transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  disabled={createClassMutation.isPending || updateClassMutation.isPending} 
                  className="flex-[2] bg-slate-900 text-white p-4 rounded-2xl hover:bg-black font-black text-sm shadow-xl shadow-slate-950/20 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                >
                  {(createClassMutation.isPending || updateClassMutation.isPending) ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      {editingClass ? "Commit Changes" : "Create Instance"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
