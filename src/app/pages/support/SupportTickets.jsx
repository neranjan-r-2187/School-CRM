import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Calendar,
  Tag,
  ChevronRight,
  Send,
  Sparkles,
  ArrowRight,
  LifeBuoy,
  HelpCircle
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { useData } from "../../context/DataContext";
import { format } from "date-fns";

export const SupportTickets = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const { tickets, addTicket, addTicketMessage } = useData();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "Technical",
    priority: "Medium"
  });

  const userTickets = tickets.filter((ticket) => 
    ticket.createdBy?._id === user?.id || ticket.createdBy === user?.id || ticket.createdBy?._id === user?._id
  );

  const filteredTickets = userTickets.filter((ticket) => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTicket = async () => {
    if (!newTicket.title || !newTicket.description) {
      showToast("error", "Information Missing", "Please provide both a title and description.");
      return;
    }

    try {
      await addTicket(newTicket);
      showToast("success", "Ticket Submitted", "Our support team has received your request.");
      setIsCreateDialogOpen(false);
      setNewTicket({
        title: "",
        description: "",
        category: "Technical",
        priority: "Medium"
      });
    } catch (error) {
      showToast("error", "Submission Failed", "There was an error creating your ticket.");
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    
    try {
      await addTicketMessage(selectedTicket._id || selectedTicket.id, replyMessage);
      
      const newMessage = {
        _id: `msg-${Date.now()}`,
        senderId: user?.id || user?._id,
        senderName: user?.name,
        senderRole: user?.role,
        message: replyMessage,
        timestamp: new Date().toISOString()
      };
      
      setSelectedTicket(prev => ({
        ...prev,
        messages: [...(prev.messages || []), newMessage]
      }));
      
      setReplyMessage("");
      showToast("success", "Message Sent", "Your reply has been added successfully.");
    } catch (error) {
      showToast("error", "Failed to Send", "Could not add your reply.");
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
      case "Open": return "bg-blue-500/10 text-blue-600 border-blue-100";
      case "In Progress": return "bg-indigo-500/10 text-indigo-600 border-indigo-100";
      case "Resolved": return "bg-emerald-500/10 text-emerald-600 border-emerald-100";
      case "Closed": return "bg-slate-500/10 text-slate-600 border-slate-100";
      default: return "";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low": return "bg-slate-100 text-slate-600";
      case "Medium": return "bg-blue-50 text-blue-600";
      case "High": return "bg-orange-50 text-orange-600";
      case "Urgent": return "bg-rose-50 text-rose-600 font-bold shadow-sm shadow-rose-100";
      default: return "";
    }
  };

  const dashboardStats = [
    { label: "Total Requests", value: userTickets.length, icon: LifeBuoy, color: "from-blue-600 to-indigo-600" },
    { label: "Currently Active", value: userTickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length, icon: Activity, color: "from-indigo-600 to-purple-600" },
    { label: "Successfully Resolved", value: userTickets.filter(t => t.status === 'Resolved').length, icon: CheckCircle2, color: "from-emerald-500 to-teal-600" }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Premium Hero Header */}
      <div className="relative overflow-hidden bg-slate-950 rounded-[2.5rem] p-10 lg:p-16 text-white shadow-2xl shadow-slate-900/40">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-emerald-500/10 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-6 max-w-2xl">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 backdrop-blur-xl px-5 py-2 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">
              Support Experience Center
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              How can we <br /> help you today?
            </h1>
            <p className="text-slate-400 font-medium text-lg lg:text-xl leading-relaxed">
              Our dedicated support team is here to ensure your educational journey remains smooth and uninterrupted.
            </p>
            
            <div className="flex flex-wrap gap-10 pt-4">
               {dashboardStats.map(stat => (
                 <div key={stat.label} className="group">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 group-hover:text-blue-400 transition-colors">{stat.label}</p>
                    <div className="flex items-center gap-3">
                      <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.color} shadow-lg`} />
                    </div>
                 </div>
               ))}
            </div>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-white hover:bg-slate-100 text-slate-950 rounded-[1.5rem] font-black px-12 h-20 shadow-2xl shadow-white/5 group transition-all transform hover:-translate-y-1">
                <Plus className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-500 text-blue-600" />
                SUBMIT NEW REQUEST
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white rounded-[3rem] border-none shadow-[0_40px_100px_rgba(0,0,0,0.15)] p-0 overflow-hidden">
              <div className="bg-slate-950 p-12 text-white relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-50" />
                <DialogHeader className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl shadow-blue-500/20">
                      <Sparkles className="w-7 h-7 text-blue-400" />
                    </div>
                    <div>
                      <DialogTitle className="text-3xl font-black tracking-tight">Create Request</DialogTitle>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Ref: {format(new Date(), 'yyyy-MM-dd')}</p>
                    </div>
                  </div>
                </DialogHeader>
              </div>
              
              <div className="p-12 space-y-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Request Headline</label>
                  <Input 
                    placeholder="Briefly summarize your issue..." 
                    className="h-16 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-slate-900 shadow-inner px-6 text-lg placeholder:text-slate-300" 
                    value={newTicket.title} 
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })} 
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Context</label>
                  <Textarea 
                    placeholder="Provide as much detail as possible..." 
                    rows={6} 
                    className="rounded-[2rem] bg-slate-50 border-transparent focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-500/5 transition-all font-semibold text-slate-900 shadow-inner resize-none p-8 leading-relaxed text-lg placeholder:text-slate-300" 
                    value={newTicket.description} 
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Category</label>
                    <Select value={newTicket.category} onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}>
                      <SelectTrigger className="h-16 rounded-2xl bg-slate-50 border-transparent focus:bg-white transition-all font-black text-slate-700 px-6">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border border-slate-200 bg-white shadow-2xl p-2 z-[9999]">
                        <SelectItem value="Technical" className="rounded-xl font-bold py-3">Technical</SelectItem>
                        <SelectItem value="Academic" className="rounded-xl font-bold py-3">Academic</SelectItem>
                        <SelectItem value="Financial" className="rounded-xl font-bold py-3">Financial</SelectItem>
                        <SelectItem value="Administrative" className="rounded-xl font-bold py-3">Administrative</SelectItem>
                        <SelectItem value="Other" className="rounded-xl font-bold py-3">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Urgency Level</label>
                    <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
                      <SelectTrigger className="h-16 rounded-2xl bg-slate-50 border-transparent focus:bg-white transition-all font-black text-slate-700 px-6">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl p-2 z-[9999]">
                        <SelectItem value="Low" className="rounded-xl font-bold py-3">Low Urgency</SelectItem>
                        <SelectItem value="Medium" className="rounded-xl font-bold py-3">Medium Urgency</SelectItem>
                        <SelectItem value="High" className="rounded-xl font-bold py-3">High Urgency</SelectItem>
                        <SelectItem value="Urgent" className="rounded-xl font-bold py-3 text-rose-600">CRITICAL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-6">
                <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="rounded-xl font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest text-xs">Discard</Button>
                <Button onClick={handleCreateTicket} className="bg-slate-900 hover:bg-black text-white rounded-2xl font-black h-16 px-12 shadow-2xl shadow-slate-900/20 transform hover:-translate-y-1 transition-all">
                  SEND REQUEST
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filter and Search Hub */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 relative w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-blue-500 transition-all duration-500" />
          <Input 
            placeholder="Search through your request history..." 
            className="h-20 pl-16 pr-8 border-none bg-white shadow-2xl shadow-slate-200/40 rounded-[1.5rem] font-black text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-500/5 transition-all text-lg" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="w-full md:w-auto bg-white p-2 rounded-[1.5rem] shadow-2xl shadow-slate-200/40 border border-slate-50">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[240px] h-16 border-none bg-transparent font-black text-slate-600 px-6">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-slate-300" />
                <SelectValue placeholder="All Requests" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
              <SelectItem value="all" className="rounded-xl font-bold py-3">All Requests</SelectItem>
              <SelectItem value="Open" className="rounded-xl font-bold py-3">Pending Action</SelectItem>
              <SelectItem value="In Progress" className="rounded-xl font-bold py-3">Actively Processing</SelectItem>
              <SelectItem value="Resolved" className="rounded-xl font-bold py-3 text-emerald-600">Successfully Resolved</SelectItem>
              <SelectItem value="Closed" className="rounded-xl font-bold py-3">Closed Archive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ticket List Canvas */}
      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {filteredTickets.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[3.5rem] p-40 text-center shadow-2xl shadow-slate-200/20 border border-slate-50 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/20 to-transparent" />
              <div className="relative z-10">
                <div className="w-36 h-36 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner group">
                  <HelpCircle className="w-16 h-16 text-slate-100 group-hover:text-blue-200 transition-colors duration-500" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Quiet on our end</h3>
                <p className="text-slate-400 font-semibold max-w-sm mx-auto text-xl mb-12 leading-relaxed">
                  {searchQuery || filterStatus !== "all" ? "No matches found for your current filters." : "Looks like everything is running smoothly. But if you need us, we're right here."}
                </p>
                {!searchQuery && filterStatus === "all" && (
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-slate-950 hover:bg-black text-white rounded-[2rem] font-black h-20 px-16 shadow-2xl shadow-slate-950/20 group">
                    <Plus className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-500" />
                    SUBMIT YOUR FIRST REQUEST
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            filteredTickets.map((ticket, index) => (
              <motion.div 
                key={ticket._id || ticket.id} 
                layout 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="p-10 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 cursor-pointer border-none shadow-2xl shadow-slate-200/40 bg-white group rounded-[3rem] relative overflow-hidden active:scale-[0.98]" 
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                    <div className="flex-1 min-w-0 space-y-6">
                      <div className="flex items-center gap-5">
                        <Badge variant="secondary" className="bg-slate-900 text-white font-mono text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20">
                          #{ticket.ticketNumber}
                        </Badge>
                        <div className="w-2 h-2 rounded-full bg-slate-100" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{ticket.category}</span>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight tracking-tight">{ticket.title}</h3>
                        <p className="text-slate-400 font-semibold line-clamp-1 text-xl">{ticket.description}</p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-6 pt-4">
                        <Badge className={`${getStatusColor(ticket.status)} border-none px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-black/5`}>
                          <div className="flex items-center gap-3">
                             {getStatusIcon(ticket.status)}
                             {ticket.status}
                          </div>
                        </Badge>
                        <Badge className={`${getPriorityColor(ticket.priority)} border-none px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-black/5`}>
                          {ticket.priority}
                        </Badge>
                        <div className="flex items-center gap-3 text-[11px] text-slate-300 font-black uppercase tracking-widest ml-auto lg:ml-0">
                          <Calendar className="w-5 h-5 opacity-40" />
                          {format(new Date(ticket.createdAt), "MMMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-12 self-end lg:self-center bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all duration-700">
                      <div className="text-center px-6">
                        <div className="flex items-center justify-center gap-3 text-slate-300 group-hover:text-indigo-600 mb-1 transition-colors">
                          <MessageSquare className="w-7 h-7" />
                          <span className="text-3xl font-black tracking-tighter">{ticket.messages?.length || 0}</span>
                        </div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Thread</p>
                      </div>
                      <div className="h-16 w-[1px] bg-slate-200" />
                      <div className="w-16 h-16 rounded-[1.5rem] bg-white flex items-center justify-center shadow-2xl shadow-black/5 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                        <ChevronRight className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Ticket Context Deep Dive Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-hidden flex flex-col bg-white rounded-[4rem] border-none shadow-[0_60px_120px_-20px_rgba(0,0,0,0.25)] p-0">
          {selectedTicket && (
            <>
              <div className="bg-slate-950 p-12 lg:p-16 text-white relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-transparent to-emerald-500/20 opacity-60" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center justify-between">
                     <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-xl px-5 py-2 font-mono tracking-[0.3em] font-black text-xs">
                       REFERENCE #{selectedTicket.ticketNumber}
                     </Badge>
                     <Badge className={`${getStatusColor(selectedTicket.status)} border-none px-8 py-3 rounded-2xl font-black uppercase text-[11px] shadow-2xl shadow-black/20`}>
                       <div className="flex items-center gap-3">
                          {getStatusIcon(selectedTicket.status)}
                          {selectedTicket.status}
                       </div>
                     </Badge>
                   </div>
                   <DialogTitle className="text-5xl font-black tracking-tight leading-none text-white">{selectedTicket.title}</DialogTitle>
                   <div className="flex flex-wrap items-center gap-10 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">
                      <span className="flex items-center gap-3 text-indigo-400"><Tag className="w-5 h-5" /> {selectedTicket.category}</span>
                      <span className="flex items-center gap-3"><Clock className="w-5 h-5" /> Submitted on {format(new Date(selectedTicket.createdAt), "MMMM d, yyyy 'at' h:mm a")}</span>
                   </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-12 lg:p-16 space-y-16 bg-white custom-scrollbar">
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Request Origin & Context</h4>
                  <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 shadow-inner relative">
                    <p className="text-2xl font-medium text-slate-800 leading-relaxed italic pr-10">"{selectedTicket.description}"</p>
                    <div className="absolute top-8 right-10 text-blue-100">
                      <Sparkles className="w-12 h-12 rotate-12" />
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="flex items-center justify-between ml-2">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Communication Timeline</h4>
                    <Badge variant="outline" className="border-slate-100 text-slate-400 font-black rounded-full px-4">{selectedTicket.messages?.length || 0} Events</Badge>
                  </div>
                  
                  <div className="space-y-12 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
                    {selectedTicket.messages?.map((message, idx) => (
                      <motion.div 
                        key={message._id || message.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-12 relative group"
                      >
                        <div className={`w-12 h-12 rounded-[1.25rem] z-10 flex items-center justify-center font-black text-sm text-white shadow-2xl transition-transform duration-500 group-hover:scale-110 ${
                          message.senderId === user?.id || message.senderId === user?._id ? "bg-indigo-600 shadow-indigo-200" : "bg-slate-900 shadow-slate-200"
                        }`}>
                          {message.senderName?.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className={`rounded-[2.5rem] p-8 shadow-xl border transition-all duration-500 ${
                            message.senderId === user?.id || message.senderId === user?._id 
                            ? "bg-white border-indigo-50 shadow-indigo-500/5 group-hover:shadow-indigo-500/10" 
                            : "bg-slate-50 border-slate-100 shadow-slate-500/5 group-hover:shadow-slate-500/10"
                          }`}>
                            <div className="flex items-center justify-between mb-4">
                               <span className="text-base font-black text-slate-900 tracking-tight">{message.senderName}</span>
                               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{format(new Date(message.timestamp), "MMM d, h:mm a")}</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed font-semibold text-lg">{message.message}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedTicket.status !== "Closed" && selectedTicket.status !== "Resolved" && (
                <div className="p-12 bg-slate-50 border-t border-slate-100 flex-shrink-0">
                  <div className="bg-white rounded-[2.5rem] p-6 shadow-2xl shadow-slate-900/5 border border-slate-100 flex items-end gap-6 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
                    <Textarea 
                      placeholder="Type your follow-up message..." 
                      rows={2} 
                      value={replyMessage} 
                      onChange={(e) => setReplyMessage(e.target.value)} 
                      className="flex-1 border-none bg-transparent focus:ring-0 text-slate-900 placeholder:text-slate-300 py-3 resize-none text-xl font-bold font-semibold px-4"
                    />
                    <Button 
                      onClick={handleSendReply} 
                      disabled={!replyMessage.trim()} 
                      className="bg-slate-950 hover:bg-black h-20 w-20 rounded-[1.5rem] flex-shrink-0 shadow-2xl shadow-slate-900/20 active:scale-95 transition-all group"
                    >
                      <Send className="w-7 h-7 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
