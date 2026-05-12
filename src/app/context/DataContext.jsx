import { createContext, useContext, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const DataContext = createContext(void 0);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Fetch Assignments
  const { data: assignments = [] } = useQuery({
    queryKey: ["assignments", user?.id],
    queryFn: async () => {
      const endpoint = user?.role === "Student" ? "/api/students/assignments" : "/api/teachers/assignments";
      const response = await api.get(endpoint);
      return response.data.data;
    },
    enabled: !!user
  });

  // 2. Fetch Attendance
  const { data: attendance = [] } = useQuery({
    queryKey: ["attendance", user?.id],
    queryFn: async () => {
      if (user?.role !== "Student") return [];
      const response = await api.get("/api/students/attendance");
      return response.data.data;
    },
    enabled: !!user && user.role === "Student"
  });

  // 3. Fetch Grades
  const { data: grades = [] } = useQuery({
    queryKey: ["grades", user?.id],
    queryFn: async () => {
      if (user?.role !== "Student") return [];
      const response = await api.get("/api/students/grades");
      return response.data.data;
    },
    enabled: !!user && user.role === "Student"
  });

  // 4. Fetch Users
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // Allow Admin and Students (to find teachers)
      const response = await api.get("/api/admin/users");
      return response.data.data;
    },
    enabled: !!user
  });

  // 5. Fetch Tickets
  const { data: tickets = [] } = useQuery({
    queryKey: ["tickets", user?.id],
    queryFn: async () => {
      const response = await api.get("/api/tickets");
      return response.data.data;
    },
    enabled: !!user
  });

  // 6. Fetch Doubts
  const { data: doubts = [] } = useQuery({
    queryKey: ["doubts", user?.id],
    queryFn: async () => {
      const response = await api.get("/api/doubts");
      return response.data.data;
    },
    enabled: !!user
  });

  // Mutations
  const addTicketMutation = useMutation({
    mutationFn: (ticketData) => api.post("/api/tickets", ticketData),
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
    }
  });

  const addDoubtMutation = useMutation({
    mutationFn: (doubtData) => api.post("/api/doubts", doubtData),
    onSuccess: () => {
      queryClient.invalidateQueries(["doubts"]);
    }
  });

  const updateDoubtMutation = useMutation({
    mutationFn: ({ id, ...data }) => api.put(`/api/doubts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["doubts"]);
    }
  });

  const value = useMemo(() => ({
    threads: [],
    messages: [],
    tickets,
    assignments,
    attendance,
    grades,
    users,
    doubts,
    addTicket: (data) => addTicketMutation.mutate(data),
    addTicketMessage: (id, message) => api.post(`/api/tickets/${id}/messages`, { message }).then(() => queryClient.invalidateQueries(["tickets"])),
    updateTicket: (id, data) => api.put(`/api/tickets/${id}`, data).then(() => queryClient.invalidateQueries(["tickets"])),
    addDoubt: (data) => addDoubtMutation.mutate(data),
    updateDoubt: (id, data) => updateDoubtMutation.mutate({ id, ...data }),
    addDoubtReply: (id, message) => api.post(`/api/doubts/${id}/replies`, { message }).then(() => queryClient.invalidateQueries(["doubts"])),
  }), [assignments, attendance, grades, users, tickets, doubts]);

  return <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === void 0) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
