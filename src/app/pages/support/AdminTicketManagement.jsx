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
  Activity
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

      showToast("success", "Reply Sent", "Your message has been sent to the ticket creator.");
      setReplyMessage("");
    } catch (error) {
      showToast("error", "Error", "Failed to send reply.");
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
      showToast("success", "Status Updated", `Ticket status updated to ${status}`);
      
      if (status === "Resolved") {
        addNotification({
          userId: selectedTicket.createdBy?._id || selectedTicket.createdBy,
          type: "ticket",
          title: "Ticket Resolved",
          message: `Your ticket ${selectedTicket.ticketNumber} has been marked as resolved.`
        });
      }
    } catch (error) {
      showToast("error", "Error", "Failed to update status.");
    }
  };

  const handleAssignTicket = async (userId) => {
    if (!selectedTicket) return;
    const ticketId = selectedTicket._id || selectedTicket.id;
    
    try {
      await updateTicket(ticketId, { assignedTo: userId });
      const assignedStaff = users.find(u => u._id === userId || u.id === userId);
      
      setSelectedTicket(prev => ({ ...prev, assignedTo: assignedStaff }));
      showToast("success", "Ticket Assigned", `Ticket assigned to ${assignedStaff?.name || "staff"}`);
    } catch (error) {
      showToast("error", "Error", "Failed to assign ticket.");
    }
  };

  const handleDeleteTicket = async (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await deleteTicket(id);
        setSelectedTicket(null);
        showToast("success", "Ticket Deleted", "The ticket has been removed from the system.");
      } catch (error) {
        showToast("error", "Error", "Failed to delete ticket.");
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Open": return <Clock className="w-4 h-4" />;
      case "In Progress": return <AlertCircle className="w-4 h-4" />;
      case "Resolved": return <CheckCircle2 className="w-4 h-4" />;
      case "Closed": return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open": return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "In Progress": return "bg-amber-500/10 text-amber-600 border-amber-200";
      case "Resolved": return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
      case "Closed": return "bg-slate-500/10 text-slate-600 border-slate-200";
      default: return "";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low": return "bg-slate-100 text-slate-600";
      case "Medium": return "bg-blue-50 text-blue-600";
      case "High": return "bg-orange-50 text-orange-600";
      case "Urgent": return "bg-rose-50 text-rose-600 font-bold";
      default: return "";
    }
  };

  const stats = [
    { label: "Total Tickets", value: tickets.length, color: "bg-blue-600", icon: MessageSquare, gradient: "from-blue-600 to-indigo-600" },
    { label: "Open", value: tickets.filter((t) => t.status === "Open").length, color: "bg-amber-500", icon: Clock, gradient: "from-amber-500 to-orange-500" },
    { label: "In Progress", value: tickets.filter((t) => t.status === "In Progress").length, color: "bg-indigo-500", icon: Activity, gradient: "from-indigo-500 to-purple-600" },
    { label: "Resolved", value: tickets.filter((t) => t.status === "Resolved").length, color: "bg-emerald-500", icon: CheckCircle2, gradient: "from-emerald-500 to-teal-600" }
  ];

  const staffMembers = users.filter(u => u.role === "Admin" || u.role === "Staff" || u.role === "Teacher");

  if (selectedTicket) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSelectedTicket(null)} className="group hover:bg-white/50 backdrop-blur-sm rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Tickets
          </Button>
          <div className="flex items-center gap-2">
             <Button variant="outline" size="sm" className="rounded-xl border-slate-200 hover:bg-slate-50" onClick={() => window.print()}>
               Print Detail
             </Button>
             <Button variant="destructive" size="sm" className="rounded-xl shadow-lg shadow-rose-200" onClick={() => handleDeleteTicket(selectedTicket._id || selectedTicket.id)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/50 rounded-2xl bg-white">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-md px-3 py-1 font-mono tracking-wider">
                    {selectedTicket.ticketNumber}
                  </Badge>
                  <Badge className={`${getPriorityColor(selectedTicket.priority)} border-none shadow-sm px-3 py-1`}>
                    {selectedTicket.priority} Priority
                  </Badge>
                </div>
                <h1 className="text-3xl font-black tracking-tight leading-tight">{selectedTicket.title}</h1>
                <div className="flex items-center gap-4 text-slate-300 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(selectedTicket.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-500" />
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    {selectedTicket.category}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-4">
                <Badge className={`${getStatusColor(selectedTicket.status)} border-none text-base px-6 py-2.5 rounded-2xl shadow-xl backdrop-blur-xl bg-white/10 text-white`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                      selectedTicket.status === 'Open' ? 'bg-blue-400' :
                      selectedTicket.status === 'In Progress' ? 'bg-amber-400' :
                      selectedTicket.status === 'Resolved' ? 'bg-emerald-400' : 'bg-slate-400'
                    }`} />
                    {selectedTicket.status}
                  </div>
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 border-t border-slate-100">
            <div className="lg:col-span-3 p-8 space-y-10">
              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Original Request</h3>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <p className="text-slate-700 leading-relaxed text-lg italic italic">"{selectedTicket.description}"</p>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Activity Feed</h3>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-500 rounded-full font-bold">
                    {selectedTicket.messages?.length || 0} Messages
                  </Badge>
                </div>
                
                <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                  {selectedTicket.messages?.map((message, idx) => (
                    <motion.div 
                      key={message._id || message.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-6 relative"
                    >
                      <div className={`w-8 h-8 rounded-xl z-10 flex items-center justify-center font-bold text-white text-xs shadow-lg transition-transform hover:scale-110 ${
                        message.senderRole === "Admin" ? "bg-blue-600 shadow-blue-200" : "bg-slate-600 shadow-slate-200"
                      }`}>
                        {message.senderName?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-900 text-sm">{message.senderName}</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase">{format(new Date(message.timestamp), "h:mm a")}</span>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed">{message.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {selectedTicket.status !== "Closed" && (
                  <div className="mt-10 pt-8 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 focus-within:border-blue-300 transition-colors">
                      <Textarea 
                        placeholder="Write your response here..." 
                        rows={4} 
                        value={replyMessage} 
                        onChange={(e) => setReplyMessage(e.target.value)} 
                        className="resize-none border-none bg-transparent focus:ring-0 text-slate-900 placeholder:text-slate-400 p-0 mb-4"
                      />
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                             {user?.name?.charAt(0)}
                           </div>
                           <p className="text-xs font-bold text-slate-500">Replying as <span className="text-slate-900">{user?.name}</span></p>
                        </div>
                        <Button onClick={handleSendReply} disabled={!replyMessage.trim()} className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 shadow-lg shadow-blue-200">
                          <Send className="w-4 h-4 mr-2" />
                          Send Response
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <div className="lg:col-span-1 bg-slate-50/50 p-8 border-l border-slate-100 space-y-10">
              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Management</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Current Status</label>
                    <Select value={selectedTicket.status} onValueChange={handleUpdateStatus}>
                      <SelectTrigger className="w-full rounded-xl bg-white border-slate-200 h-11 font-semibold text-slate-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200">
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Assign Agent</label>
                    <Select 
                      value={selectedTicket.assignedTo?._id || selectedTicket.assignedTo || "unassigned"} 
                      onValueChange={handleAssignTicket}
                    >
                      <SelectTrigger className="w-full rounded-xl bg-white border-slate-200 h-11 font-semibold text-slate-900">
                        <SelectValue placeholder="Select Staff..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200">
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {staffMembers.map(staff => (
                          <SelectItem key={staff._id} value={staff._id}>{staff.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Requester</h3>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-500 text-lg shadow-inner">
                      {selectedTicket.createdBy?.name?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-900 truncate">{selectedTicket.createdBy?.name || "Unknown User"}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{selectedTicket.createdBy?.role || "System User"}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-50 space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-bold uppercase">ID</span>
                      <span className="text-slate-600 font-mono">#{(selectedTicket.createdBy?._id || selectedTicket.createdBy || "").slice(-8)}</span>
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
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Ticket Center</h1>
          <p className="text-slate-500 font-semibold text-lg">Manage support requests and administrative issues</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
           <Button variant="ghost" className="rounded-xl font-bold text-slate-600 hover:text-blue-600">Export PDF</Button>
           <Button className="bg-slate-900 hover:bg-black text-white rounded-xl font-bold shadow-lg shadow-slate-200 px-6">
             Analytics View
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group overflow-hidden border-none shadow-xl shadow-slate-200/40 rounded-3xl relative h-32">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity`} />
              <div className="p-6 h-full flex items-center gap-5 relative">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-2xl shadow-${stat.color.split('-')[1]}-200 transition-transform group-hover:scale-110 duration-500`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              placeholder="Search tickets, IDs, or users..." 
              className="h-14 pl-12 pr-6 border-none bg-white shadow-xl shadow-slate-200/30 rounded-2xl font-semibold text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500/20 transition-all" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
          <div className="flex gap-3 h-14">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[200px] h-full border-none bg-white shadow-xl shadow-slate-200/30 rounded-2xl font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <SelectValue placeholder="All Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full md:w-[200px] h-full border-none bg-white shadow-xl shadow-slate-200/30 rounded-2xl font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <SelectValue placeholder="All Priority" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredTickets.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[2rem] p-24 text-center shadow-2xl shadow-slate-200/20 border border-slate-50">
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <MessageSquare className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">No results found</h3>
                <p className="text-slate-400 font-medium max-w-sm mx-auto">Try refining your search terms or adjusting the filters to find what you need.</p>
              </motion.div>
            ) : (
              filteredTickets.map((ticket) => (
                <motion.div 
                  key={ticket._id || ticket.id} 
                  layout 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card 
                    className="p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer border-none shadow-lg shadow-slate-200/40 bg-white group rounded-[2rem] relative overflow-hidden"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-2 transition-all group-hover:w-3 ${
                      ticket.priority === 'Urgent' ? 'bg-rose-500' :
                      ticket.priority === 'High' ? 'bg-orange-500' :
                      ticket.priority === 'Medium' ? 'bg-blue-500' : 'bg-slate-300'
                    }`} />
                    
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                      <div className="flex-1 min-w-0 space-y-4">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-mono text-[11px] font-bold rounded-lg px-2.5 py-1">
                            {ticket.ticketNumber}
                          </Badge>
                          <div className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{ticket.category}</span>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-tight">{ticket.title}</h3>
                          <p className="text-slate-500 font-medium line-clamp-1 text-sm">{ticket.description}</p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-5 pt-1">
                          <Badge className={`${getStatusColor(ticket.status)} border-none px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl shadow-sm`}>
                            <div className="flex items-center gap-2">
                               {getStatusIcon(ticket.status)}
                               {ticket.status}
                            </div>
                          </Badge>
                          <Badge className={`${getPriorityColor(ticket.priority)} border-none px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl shadow-sm`}>
                            {ticket.priority}
                          </Badge>
                          <div className="flex items-center gap-4 text-[11px] text-slate-400 font-bold uppercase tracking-tighter">
                            <span className="flex items-center gap-2">
                              <User className="w-4 h-4 text-slate-300" />
                              {ticket.createdBy?.name || "User"}
                            </span>
                            <span className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-300" />
                              {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 self-end lg:self-center lg:border-l lg:border-slate-100 lg:pl-8">
                        <div className="text-center group-hover:scale-110 transition-transform">
                          <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
                            <MessageSquare className="w-5 h-5 fill-blue-50" />
                            <span className="text-xl font-black tracking-tighter">{ticket.messages?.length || 0}</span>
                          </div>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Responses</p>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-2xl h-12 w-12 text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTicket(ticket._id || ticket.id);
                            }}
                          >
                            <Trash2 className="w-5 h-5" />
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
