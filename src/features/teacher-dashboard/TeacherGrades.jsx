import { Award, TrendingUp, AlertCircle, Loader2, ChevronRight } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { useTeacherClasses, useTeacherSubjects } from "./hooks/useTeacherData";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";

export const TeacherGrades = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const { data: classes, isLoading: classesLoading } = useTeacherClasses();
  const { data: subjects, isLoading: subjectsLoading } = useTeacherSubjects();

  return (
    <div className="space-y-8">
      <Card className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Grade Management</h2>
            <p className="text-slate-500 font-medium mt-1">Submit and analyze student performance metrics</p>
          </div>
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
            <Award className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class Unit</label>
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-slate-700 transition-all appearance-none cursor-pointer"
            >
              <option value="">Select Unit</option>
              {classes?.map((cls) => (
                <option key={cls._id} value={cls._id}>{cls.name} - {cls.section}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Subject</label>
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-slate-700 transition-all appearance-none cursor-pointer"
            >
              <option value="">Select Subject</option>
              {subjects?.map((sub) => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assessment Type</label>
            <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-slate-700 transition-all appearance-none cursor-pointer">
              <option>Mid Term</option>
              <option>Final Exam</option>
              <option>Unit Test 1</option>
              <option>Unit Test 2</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 group">
              Initialise Entry
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 py-24 text-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Award className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Configure Parameters</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">Select a class and subject to load the student roster and begin grade entry.</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-8 bg-white rounded-[2rem] shadow-sm border border-slate-200/60 group hover:shadow-xl transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
              <TrendingUp className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Class Average</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">76.2%</p>
            </div>
          </div>
          <Badge variant="success" className="px-4 py-1 rounded-full font-bold text-[10px]">+3.1% FROM PREVIOUS</Badge>
        </Card>

        <Card className="p-8 bg-white rounded-[2rem] shadow-sm border border-slate-200/60 group hover:shadow-xl transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
              <Award className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Elite Performers</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">62</p>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Scored above 80%</p>
        </Card>

        <Card className="p-8 bg-white rounded-[2rem] shadow-sm border border-slate-200/60 group hover:shadow-xl transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
              <AlertCircle className="w-7 h-7 text-rose-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Critical Intervention</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">8</p>
            </div>
          </div>
          <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">Urgent review required</p>
        </Card>
      </div>
    </div>
  );
};
