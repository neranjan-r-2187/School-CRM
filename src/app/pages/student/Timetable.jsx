import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { useStudentSchedule } from "../../features/student-dashboard/hooks/useStudentData";
import { useAuth } from "../../context/AuthContext";
import { todaySchedule as mockSchedule } from "../../data/mockData";
export const Timetable = () => {
  const { user } = useAuth();
  const { data: schedule, isLoading } = useStudentSchedule();
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const [selectedDay, setSelectedDay] = useState("Monday");

  const currentDaySchedule = schedule?.find(s => s.day === selectedDay)?.periods || [];
  return <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Weekly Timetable</h1>
          <p className="text-slate-500">{user?.class?.name || "Class"} - {user?.class?.section || "Section"}</p>
        </div>

        {
    /* Day Selector */
  }
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {days.map((day) => <button
    key={day}
    onClick={() => setSelectedDay(day)}
    className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${selectedDay === day ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"}`}
  >
              {day}
            </button>)}
        </div>

        {
    /* Schedule */
  }
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              {selectedDay}'s Classes
            </h2>
            <div className="space-y-3">
              {isLoading ? (
                <div className="py-12 text-center text-slate-400">Loading schedule...</div>
              ) : currentDaySchedule.length > 0 ? (
                currentDaySchedule.map((cls, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all"
                  >
                    <div className="text-center min-w-[80px]">
                      <div className="flex items-center justify-center gap-1 text-slate-600 mb-1">
                        <Clock className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{cls.startTime}</p>
                      <p className="text-xs text-slate-400">{cls.endTime}</p>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1">{cls.subject?.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {cls.teacher?.user?.name || "Teacher"}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {cls.room || "Classroom"}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 italic">No classes scheduled for {selectedDay}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
