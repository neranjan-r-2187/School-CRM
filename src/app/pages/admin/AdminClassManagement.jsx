import { Users, BookOpen, UserCheck, TrendingUp, Plus, Edit, Eye, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import { useState } from "react";

export const AdminClassManagement = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({ name: "", section: "", classTeacherId: "" });

  // Fetch classes from API
  const { data: classesResponse, isLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const response = await api.get("/classes");
      return response.data.data;
    }
  });

  const classes = classesResponse || [];

  // Mutations
  const createClassMutation = useMutation({
    mutationFn: async (newClass) => {
      await api.post("/admin/classes", newClass);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["classes"]);
      toast.success("Class created successfully");
      handleCloseModal();
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
    }
  });

  const deleteClassMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/classes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["classes"]);
      toast.success("Class deleted successfully");
    }
  });

  const handleOpenModal = (cls = null) => {
    if (cls) {
      setEditingClass(cls);
      setFormData({ name: cls.name, section: cls.section, classTeacherId: cls.classTeacher?._id || "" });
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

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;

  return <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Class Management</h1>
          <p className="text-slate-600 mt-1">Manage classes and sections from the database</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" />
          Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => <div key={cls._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900 mb-1">{cls.name}-{cls.section}</h3>
              <p className="text-sm text-slate-600">Class Teacher: {cls.classTeacher?.name || "Unassigned"}</p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => handleOpenModal(cls)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 text-sm font-medium">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button onClick={() => { if(window.confirm("Delete this class?")) deleteClassMutation.mutate(cls._id); }} className="px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>)}
      </div>

      {isModalOpen && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{editingClass ? "Edit Class" : "Add Class"}</h2>
            <button onClick={handleCloseModal}><X /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Class Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded p-2" placeholder="e.g. Class 10" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Section</label>
              <input type="text" required value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} className="w-full border rounded p-2" placeholder="e.g. A" />
            </div>
            <button type="submit" disabled={createClassMutation.isPending || updateClassMutation.isPending} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50">
              {editingClass ? "Update" : "Create"} Class
            </button>
          </form>
        </div>
      </div>}
    </div>;
};
