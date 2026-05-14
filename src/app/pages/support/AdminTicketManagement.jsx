import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Calendar,
  Tag,
  User,
  Send,
  ArrowLeft,
  Trash2,
  UserPlus,
  Filter,
  MoreVertical,
  Activity,
  BarChart3,
  ShieldCheck,
  Zap,
  Target
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { useData } from "../../context/DataContext";
import { format } from "date-fns";

export const AdminTicketManagement = () => {
  const { user } = useAuth();
  const { showToast, addNotification } = useNotifications();
  const { tickets, updateTicket, addTicketMessage, users, deleteTicket } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  const filteredTickets = tickets.filter((ticket) => {
    const creatorName = ticket.createdBy?.name || "";
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
      creatorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    
    try {
      await addTicketMessage(selectedTicket._id || selectedTicket.id, replyMessage);
      
      const newMessage = {
        _id: `msg-${Date.now()}`,
        senderId: user?.id || user?._id || "",
        senderName: user?.name || "",
        senderRole: user?.role || "",
        message: replyMessage,
        timestamp: new Date().toISOString()
      };

      setSelectedTicket(prev => ({
        ...prev,
        messages: [...(prev.messages || []), newMessage],
        updatedAt: new Date().toISOString()
      }));

      showToast("success", "Reply Published", "Your message has been added to the ticket thread.");
      setReplyMessage("");
    } catch (error) {
      showToast("error", "Error", "Failed to publish reply.");
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedTicket) return;
    const ticketId = selectedTicket._id || selectedTicket.id;
    
    try {
      await updateTicket(ticketId, { 
        status,
        ...status === "Resolved" && { resolvedAt: new Date().toISOString() }
      });
      
      setSelectedTicket(prev => ({ ...prev, status }));
      showToast("success", "Lifecycle Updated", `Ticket is now marked as ${status}`);
      
      if (status === "Resolved") {
        addNotification({
          userId: selectedTicket.createdBy?._id || selectedTicket.createdBy,
          type: "ticket",
          title: "Resolution Achieved",
          message: `Administrative action on ${selectedTicket.ticketNumber} is complete.`
        });
      }
    } catch (error) {
      showToast("error", "Error", "Transition failed.");
    }
  };

  const handleAssignTicket = async (userId) => {
    if (!selectedTicket) return;
    const ticketId = selectedTicket._id || selectedTicket.id;
    
    try {
      await updateTicket(ticketId, { assignedTo: userId });
      const assignedStaff = users.find(u => u._id === userId || u.id === userId);
      
      setSelectedTicket(prev => ({ ...prev, assignedTo: assignedStaff }));
      showToast("success", "Ownership Transferred", `Assigned to ${assignedStaff?.name || "Support Staff"}`);
    } catch (error) {
      showToast("error", "Error", "Assignment failed.");
    }
  };

  const handleDeleteTicket = async (id) => {
    if (window.confirm("CRITICAL: Permanent deletion of this record is irreversible. Proceed?")) {
      try {
        await deleteTicket(id);
        setSelectedTicket(null);
        showToast("success", "Record Purged", "The ticket has been permanently removed.");
      } catch (error) {
        showToast("error", "Error", "Purge failed.");
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Open": return <Clock className="w-5 h-5" />;
      case "In Progress": return <Zap className="w-5 h-5" />;
      case "Resolved": return <ShieldCheck className="w-5 h-5" />;
      case "Closed": return <XCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open": return "bg-blue-600 text-white shadow-lg shadow-blue-500/20";
      case "In Progress": return "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20";
      case "Resolved": return "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20";
      case "Closed": return "bg-slate-700 text-white shadow-lg shadow-slate-500/20";
      default: return "";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low": return "bg-slate-100 text-slate-500 border-slate-200";
      case "Medium": return "bg-blue-50 text-blue-600 border-blue-100";
      case "High": return "bg-orange-50 text-orange-600 border-orange-100";
      case "Urgent": return "bg-rose-50 text-rose-600 border-rose-100 font-black shadow-xl shadow-rose-500/5";
      default: return "";
    }
  };

  const dashboardStats = [
    { label: "Active Queue", value: tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length, icon: Activity, gradient: "from-blue-600 to-indigo-600" },
    { label: "Avg Resolution", value: "4.2h", icon: Target, gradient: "from-indigo-600 to-purple-600" },
    { label: "System Health", value: "98%", icon: BarChart3, gradient: "from-emerald-500 to-teal-600" },
    { label: "Resolved Total", value: tickets.filter(t => t.status === 'Resolved').length, icon: ShieldCheck, gradient: "from-slate-800 to-slate-950" }
  ];

  const staffMembers = users.filter(u => u.role === "Admin" || u.role === "Staff" || u.role === "Teacher");

  if (selectedTicket) {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Button variant="ghost" onClick={() => setSelectedTicket(null)} className="group hover:bg-white rounded-2xl h-14 px-6 text-slate-900 font-black tracking-tight">
            <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-2 transition-transform duration-300" />
            RETURN TO QUEUE
          </Button>
          <div className="flex items-center gap-4">
             <Button variant="outline" className="rounded-2xl border-slate-200 h-14 px-8 font-black text-xs tracking-[0.2em] hover:bg-white transition-all">
               GENERATE PDF
             </Button>
             <Button variant="destructive" className="rounded-2xl shadow-2xl shadow-rose-500/20 h-14 px-8 font-black text-xs tracking-[0.2em] transform hover:-translate-y-1 transition-all" onClick={() => handleDeleteTicket(selectedTicket._id || selectedTicket.id)}>
              <Trash2 className="w-5 h-5 mr-3" />
              PURGE RECORD
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-none shadow-[0_40px_100px_rgba(0,0,0,0.1)] rounded-[3rem] bg-white">
          <div className="bg-slate-950 p-12 lg:p-16 text-white relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-60" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">
              <div className="space-y-6 max-w-3xl">
                <div className="flex items-center gap-5">
                  <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-xl px-5 py-2 font-mono tracking-[0.3em] font-black text-xs">
                    TICKET REF: {selectedTicket.ticketNumber}
                  </Badge>
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                  <Badge className={`${getPriorityColor(selectedTicket.priority)} border-none px-6 py-2 rounded-xl font-black uppercase text-[10px]`}>
                    {selectedTicket.priority} URGENCY
                  </Badge>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-none">{selectedTicket.title}</h1>
                <div className="flex flex-wrap items-center gap-10 text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    {format(new Date(selectedTicket.createdAt), "MMMM d, yyyy")}
                  </div>
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-indigo-500" />
                    {selectedTicket.category}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-6">
                <Badge className={`${getStatusColor(selectedTicket.status)} border-none text-base px-10 py-5 rounded-[2rem] shadow-2xl font-black uppercase tracking-[0.2em]`}>
                  <div className="flex items-center gap-4">
                    {getStatusIcon(selectedTicket.status)}
                    {selectedTicket.status}
                  </div>
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-t border-slate-50">
            <div className="lg:col-span-8 p-12 lg:p-16 space-y-20 border-r border-slate-50">
              <section>
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-1.5 h-10 bg-blue-600 rounded-full" />
                   <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Requester Insight</h3>
                </div>
                <div className="bg-slate-50 rounded-[2.5rem] p-12 border border-slate-100 shadow-inner group relative">
                  <p className="text-3xl font-medium text-slate-800 leading-relaxed italic pr-20">"{selectedTicket.description}"</p>
                  <div className="absolute bottom-10 right-12 text-slate-200">
                    <MessageSquare className="w-20 h-20 rotate-12" />
                  </div>
                </div>
              </section>

              <section className="space-y-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-10 bg-indigo-600 rounded-full" />
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Communication Matrix</h3>
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-500 px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">
                    {selectedTicket.messages?.length || 0} PERSISTED ENTRIES
                  </Badge>
                </div>
                
                <div className="space-y-12 relative before:absolute before:left-7 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
                  {selectedTicket.messages?.map((message, idx) => (
                    <motion.div 
                      key={message._id || message.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-10 relative group"
                    >
                      <div className={`w-14 h-14 rounded-2xl z-10 flex items-center justify-center font-black text-sm text-white shadow-2xl transition-all duration-500 group-hover:scale-110 ${
                        message.senderRole === "Admin" ? "bg-slate-950 shadow-slate-900/20" : "bg-indigo-600 shadow-indigo-600/20"
                      }`}>
                        {message.senderName?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className={`rounded-[2.5rem] p-8 border transition-all duration-700 ${
                          message.senderRole === "Admin" 
                          ? "bg-slate-50 border-slate-100 shadow-slate-500/5 hover:shadow-slate-500/10" 
                          : "bg-white border-indigo-50 shadow-indigo-500/5 hover:shadow-indigo-500/10"
                        }`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="font-black text-slate-900 text-lg tracking-tight">{message.senderName}</span>
                              <Badge className="bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-tighter border-none">{message.senderRole}</Badge>
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{format(new Date(message.timestamp), "h:mm a")}</span>
                          </div>
                          <p className="text-slate-600 text-lg font-semibold leading-relaxed">{message.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {selectedTicket.status !== "Closed" && (
                  <div className="mt-20 pt-16 border-t border-slate-50">
                    <div className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-2xl shadow-slate-900/5 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
                      <Textarea 
                        placeholder="Construct a professional response..." 
                        rows={4} 
                        value={replyMessage} 
                        onChange={(e) => setReplyMessage(e.target.value)} 
                        className="resize-none border-none bg-transparent focus:ring-0 text-slate-900 font-bold text-xl placeholder:text-slate-200 p-4 mb-6 leading-relaxed"
                      />
                      <div className="flex justify-between items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white text-base font-black shadow-xl shadow-slate-950/20">
                             {user?.name?.charAt(0)}
                           </div>
                           <div>
                             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Active Operator</p>
                             <p className="text-base font-black text-slate-900">{user?.name}</p>
                           </div>
                        </div>
                        <Button onClick={handleSendReply} disabled={!replyMessage.trim()} className="bg-slate-950 hover:bg-black text-white rounded-2xl h-16 px-12 font-black tracking-widest text-xs shadow-2xl shadow-slate-900/20 transform hover:-translate-y-1 transition-all">
                          <Send className="w-5 h-5 mr-3" />
                          PUBLISH RESPONSE
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <div className="lg:col-span-4 bg-slate-50/30 p-12 lg:p-16 space-y-16">
              <section className="space-y-10">
                <div className="flex items-center gap-4">
                   <div className="w-1.5 h-10 bg-slate-950 rounded-full" />
                   <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Management Console</h3>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-3">Lifecycle Phase</label>
                    <Select value={selectedTicket.status} onValueChange={handleUpdateStatus}>
                      <SelectTrigger className="w-full rounded-[1.5rem] bg-white border-slate-100 h-20 px-8 font-black text-slate-900 shadow-xl shadow-slate-950/5 text-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-[0_30px_60px_rgba(0,0,0,0.15)] p-2">
                        <SelectItem value="Open" className="rounded-xl py-4 font-bold">Open Queue</SelectItem>
                        <SelectItem value="In Progress" className="rounded-xl py-4 font-bold">In Processing</SelectItem>
                        <SelectItem value="Resolved" className="rounded-xl py-4 font-bold text-emerald-600">Finalized / Resolved</SelectItem>
                        <SelectItem value="Closed" className="rounded-xl py-4 font-bold">Closed / Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-3">Lead Support Agent</label>
                    <Select 
                      value={selectedTicket.assignedTo?._id || selectedTicket.assignedTo || "unassigned"} 
                      onValueChange={handleAssignTicket}
                    >
                      <SelectTrigger className="w-full rounded-[1.5rem] bg-white border-slate-100 h-20 px-8 font-black text-slate-900 shadow-xl shadow-slate-950/5 text-lg">
                        <SelectValue placeholder="Delegate Action..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-[0_30px_60px_rgba(0,0,0,0.15)] p-2">
                        <SelectItem value="unassigned" className="rounded-xl py-4 font-bold">Unassigned Queue</SelectItem>
                        {staffMembers.map(staff => (
                          <SelectItem key={staff._id} value={staff._id} className="rounded-xl py-4 font-bold">{staff.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              <section className="space-y-10 pt-16 border-t border-slate-100">
                <div className="flex items-center gap-4">
                   <div className="w-1.5 h-10 bg-slate-900 rounded-full" />
                   <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Requester Profile</h3>
                </div>
                
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-950/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-slate-950 flex items-center justify-center font-black text-white text-3xl shadow-2xl shadow-slate-950/30">
                      {selectedTicket.createdBy?.name?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-2xl font-black text-slate-900 truncate tracking-tight">{selectedTicket.createdBy?.name || "Anonymous User"}</p>
                      <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[10px] px-3 py-1 mt-1">{selectedTicket.createdBy?.role || "Global Identity"}</Badge>
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-black uppercase tracking-widest">Global ID</span>
                      <span className="text-slate-900 font-mono font-bold tracking-tighter">#{(selectedTicket.createdBy?._id || selectedTicket.createdBy || "00000000").slice(-12).toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-black uppercase tracking-widest">Trust Status</span>
                      <span className="text-emerald-500 font-black uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 p-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div className="space-y-4">
          <h1 className="text-6xl lg:text-8xl font-black text-slate-950 tracking-tighter leading-none">
            Support <br /> Oversight
          </h1>
          <p className="text-slate-400 font-black text-xl lg:text-2xl tracking-tight uppercase tracking-[0.1em]">Administrative Ticket Command Center</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-3 rounded-[2rem] shadow-2xl shadow-slate-950/5 border border-slate-50">
           <Button variant="ghost" className="rounded-2xl h-16 px-8 font-black text-slate-500 hover:text-slate-950 transition-colors uppercase tracking-widest text-xs">System Logs</Button>
           <Button className="bg-slate-950 hover:bg-black text-white rounded-2xl h-16 px-10 font-black text-xs tracking-widest shadow-2xl shadow-slate-950/20 transform hover:-translate-y-1 transition-all">
             GLOBAL ANALYTICS
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group overflow-hidden border-none shadow-[0_30px_60px_rgba(0,0,0,0.06)] rounded-[3rem] relative h-48 bg-white hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-700 active:scale-95">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-[0.01] group-hover:opacity-[0.04] transition-opacity duration-700`} />
              <div className="p-10 h-full flex items-center gap-8 relative">
                <div className={`w-20 h-20 rounded-[1.75rem] bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-2xl shadow-${stat.gradient.split('-')[1]}-500/20 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6`}>
                  <stat.icon className="w-9 h-9 text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                  <p className="text-5xl font-black text-slate-950 tracking-tighter leading-none">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="space-y-10">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-200 group-focus-within:text-blue-500 transition-all duration-500" />
            <Input 
              placeholder="Query system for tickets, identities, or status codes..." 
              className="h-24 pl-20 pr-10 border-none bg-white shadow-2xl shadow-slate-950/5 rounded-[2.5rem] font-black text-slate-950 placeholder:text-slate-200 focus:ring-4 focus:ring-blue-500/5 transition-all text-xl" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
          <div className="flex gap-4 h-24 bg-white p-2 rounded-[2.5rem] shadow-2xl shadow-slate-950/5 border border-slate-50">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[260px] h-full border-none bg-transparent rounded-[2rem] font-black text-slate-600 px-8 text-sm">
                <div className="flex items-center gap-4">
                  <Filter className="w-5 h-5 text-slate-200" />
                  <SelectValue placeholder="All Queue" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-[2rem] border-none shadow-[0_40px_80px_rgba(0,0,0,0.2)] p-2">
                <SelectItem value="all" className="rounded-xl py-4 font-bold">All Requests</SelectItem>
                <SelectItem value="Open" className="rounded-xl py-4 font-bold">Awaiting Action</SelectItem>
                <SelectItem value="In Progress" className="rounded-xl py-4 font-bold">Active Processing</SelectItem>
                <SelectItem value="Resolved" className="rounded-xl py-4 font-bold text-emerald-600">Finalized Outcome</SelectItem>
                <SelectItem value="Closed" className="rounded-xl py-4 font-bold text-slate-400">Archived Record</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full md:w-[260px] h-full border-none bg-transparent rounded-[2rem] font-black text-slate-600 px-8 text-sm">
                <div className="flex items-center gap-4">
                  <Target className="w-5 h-5 text-slate-200" />
                  <SelectValue placeholder="All Priorities" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-[2rem] border-none shadow-[0_40px_80px_rgba(0,0,0,0.2)] p-2">
                <SelectItem value="all" className="rounded-xl py-4 font-bold">All Urgency</SelectItem>
                <SelectItem value="Low" className="rounded-xl py-4 font-bold">Standard Priority</SelectItem>
                <SelectItem value="Medium" className="rounded-xl py-4 font-bold">Elevated Priority</SelectItem>
                <SelectItem value="High" className="rounded-xl py-4 font-bold text-orange-600">High Urgency</SelectItem>
                <SelectItem value="Urgent" className="rounded-xl py-4 font-bold text-rose-600">CRITICAL PATH</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTickets.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[4rem] p-48 text-center shadow-2xl shadow-slate-950/5 border border-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/10 to-transparent" />
                <div className="relative z-10">
                  <div className="w-40 h-40 bg-slate-50 rounded-[3rem] flex items-center justify-center mx-auto mb-12 shadow-inner group">
                    <MessageSquare className="w-16 h-16 text-slate-100 group-hover:text-blue-200 transition-all duration-700 group-hover:scale-110" />
                  </div>
                  <h3 className="text-5xl font-black text-slate-950 mb-4 tracking-tighter">Queue Clear</h3>
                  <p className="text-slate-400 font-black text-xl max-w-sm mx-auto uppercase tracking-tighter leading-none">No administrative action required for current selection.</p>
                </div>
              </motion.div>
            ) : (
              filteredTickets.map((ticket, index) => (
                <motion.div 
                  key={ticket._id || ticket.id} 
                  layout 
                  initial={{ opacity: 0, y: 40 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="p-12 hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.12)] transition-all duration-1000 cursor-pointer border-none shadow-[0_20px_60px_rgba(0,0,0,0.03)] bg-white group rounded-[3.5rem] relative overflow-hidden active:scale-[0.99]"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-3 transition-all duration-700 group-hover:w-5 ${
                      ticket.priority === 'Urgent' ? 'bg-rose-600 shadow-[10px_0_40px_rgba(225,29,72,0.3)]' :
                      ticket.priority === 'High' ? 'bg-orange-600 shadow-[10px_0_40px_rgba(234,88,12,0.2)]' :
                      ticket.priority === 'Medium' ? 'bg-blue-600 shadow-[10px_0_40px_rgba(37,99,235,0.2)]' : 'bg-slate-200'
                    }`} />
                    
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-16">
                      <div className="flex-1 min-w-0 space-y-8">
                        <div className="flex items-center gap-6">
                          <Badge variant="secondary" className="bg-slate-950 text-white font-mono text-[10px] font-black px-5 py-2.5 rounded-xl uppercase tracking-[0.3em] shadow-2xl shadow-slate-950/20">
                            #{ticket.ticketNumber}
                          </Badge>
                          <div className="w-2 h-2 rounded-full bg-slate-100" />
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">{ticket.category}</span>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-4xl font-black text-slate-950 group-hover:text-blue-600 transition-colors mb-2 leading-none tracking-tighter">{ticket.title}</h3>
                          <p className="text-slate-400 font-bold line-clamp-1 text-2xl tracking-tight leading-none">{ticket.description}</p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-8 pt-4">
                          <Badge className={`${getStatusColor(ticket.status)} border-none px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl`}>
                            <div className="flex items-center gap-3">
                               {getStatusIcon(ticket.status)}
                               {ticket.status}
                            </div>
                          </Badge>
                          <Badge className={`${getPriorityColor(ticket.priority)} border-none px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl`}>
                            {ticket.priority} URGENCY
                          </Badge>
                          <div className="flex items-center gap-8 text-[11px] text-slate-300 font-black uppercase tracking-widest ml-auto lg:ml-0 border-l border-slate-100 pl-8">
                            <span className="flex items-center gap-4 text-slate-950 font-black">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700">
                                <User className="w-5 h-5" />
                              </div>
                              {ticket.createdBy?.name || "System Identity"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-12 self-end lg:self-center lg:border-l lg:border-slate-50 lg:pl-16">
                        <div className="text-center group-hover:scale-110 transition-transform duration-700">
                          <div className="flex items-center justify-center gap-4 text-slate-200 group-hover:text-blue-600 mb-2 transition-colors">
                            <MessageSquare className="w-9 h-9 fill-blue-50/0 group-hover:fill-blue-50/100 transition-all duration-700" />
                            <span className="text-5xl font-black tracking-tighter text-slate-950">{ticket.messages?.length || 0}</span>
                          </div>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Communication</p>
                        </div>
                        
                        <div className="flex flex-col gap-4">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-[1.75rem] h-20 w-20 text-slate-200 hover:text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 shadow-none hover:shadow-2xl hover:shadow-rose-500/10 active:scale-90" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTicket(ticket._id || ticket.id);
                            }}
                          >
                            <Trash2 className="w-8 h-8" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
