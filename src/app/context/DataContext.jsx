import { createContext, useContext, useState } from "react";
import {
  mockThreads,
  mockMessages,
  mockTickets,
  mockAssignments,
  mockAttendance,
  mockGrades,
  mockUsers,
  mockDoubts
} from "../data/mockData";
const DataContext = createContext(void 0);
export const DataProvider = ({ children }) => {
  const [threads, setThreads] = useState(mockThreads);
  const [messages, setMessages] = useState(mockMessages);
  const [tickets, setTickets] = useState(mockTickets);
  const [assignments, setAssignments] = useState(mockAssignments);
  const [attendance, setAttendance] = useState(mockAttendance);
  const [grades, setGrades] = useState(mockGrades);
  const [users, setUsers] = useState(mockUsers);
  const [doubts, setDoubts] = useState(mockDoubts);
  const addThread = (thread) => {
    setThreads((prev) => [thread, ...prev]);
  };
  const updateThread = (threadId, updates) => {
    setThreads((prev) => prev.map((t) => t.id === threadId ? { ...t, ...updates } : t));
  };
  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
    updateThread(message.threadId, {
      lastMessage: message.content,
      timestamp: message.timestamp
    });
  };
  const markThreadAsRead = (threadId) => {
    setThreads((prev) => prev.map((t) => t.id === threadId ? { ...t, unreadCount: 0 } : t));
    setMessages((prev) => prev.map((m) => m.threadId === threadId ? { ...m, isRead: true } : m));
  };
  const addTicket = (ticket) => {
    setTickets((prev) => [ticket, ...prev]);
  };
  const updateTicket = (ticketId, updates) => {
    setTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, ...updates } : t));
  };
  const addTicketMessage = (ticketId, message) => {
    setTickets((prev) => prev.map(
      (t) => t.id === ticketId ? { ...t, messages: [...t.messages, message], updatedAt: message.timestamp } : t
    ));
  };
  const addAssignment = (assignment) => {
    setAssignments((prev) => [assignment, ...prev]);
  };
  const updateAssignment = (assignmentId, updates) => {
    setAssignments((prev) => prev.map((a) => a.id === assignmentId ? { ...a, ...updates } : a));
  };
  const submitAssignment = (assignmentId) => {
    setAssignments((prev) => prev.map(
      (a) => a.id === assignmentId ? { ...a, status: "submitted", submittedDate: (/* @__PURE__ */ new Date()).toISOString() } : a
    ));
  };
  const addAttendance = (record) => {
    setAttendance((prev) => [record, ...prev]);
  };
  const updateAttendance = (date, updates) => {
    setAttendance((prev) => prev.map((a) => a.date === date ? { ...a, ...updates } : a));
  };
  const addGrade = (grade) => {
    setGrades((prev) => [grade, ...prev]);
  };
  const updateGrade = (gradeId, updates) => {
    setGrades((prev) => prev.map((g, i) => i.toString() === gradeId ? { ...g, ...updates } : g));
  };
  const addUser = (user) => {
    setUsers((prev) => [user, ...prev]);
  };
  const updateUser = (userId, updates) => {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, ...updates } : u));
  };
  const deleteUser = (userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };
  const addDoubt = (doubt) => {
    setDoubts((prev) => [doubt, ...prev]);
  };
  const updateDoubt = (doubtId, updates) => {
    setDoubts((prev) => prev.map((d) => d.id === doubtId ? { ...d, ...updates } : d));
  };
  const addDoubtReply = (doubtId, reply) => {
    setDoubts((prev) => prev.map(
      (d) => d.id === doubtId ? { ...d, replies: [...d.replies, reply] } : d
    ));
  };
  const value = {
    threads,
    messages,
    addThread,
    updateThread,
    addMessage,
    markThreadAsRead,
    tickets,
    addTicket,
    updateTicket,
    addTicketMessage,
    assignments,
    addAssignment,
    updateAssignment,
    submitAssignment,
    attendance,
    addAttendance,
    updateAttendance,
    grades,
    addGrade,
    updateGrade,
    users,
    addUser,
    updateUser,
    deleteUser,
    doubts,
    addDoubt,
    updateDoubt,
    addDoubtReply
  };
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
