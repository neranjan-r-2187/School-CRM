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
  ArrowRight
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
      showToast("error", "Wait!", "Please provide a title and description for your ticket.");
      return;
    }

    try {
      await addTicket(newTicket);
      showToast("success", "Request Sent", "Our support team has been notified of your request.");
      setIsCreateDialogOpen(false);
      setNewTicket({
        title: "",
        description: "",
        category: "Technical",
        priority: "Medium"
      });
    } catch (error) {
      showToast("error", "Error", "Failed to submit ticket. Please try again.");
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
      showToast("success", "Message Sent", "Your reply has been added.");
    } catch (error) {
      showToast("error", "Error", "Failed to send message.");
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
      case "Open": return "bg-blue-500/10 text-blue-600";
      case "In Progress": return "bg-amber-500/10 text-amber-600";
      case "Resolved": return "bg-emerald-500/10 text-emerald-600";
      case "Closed": return "bg-slate-500/10 text-slate-600";
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
    { label: "Active Tickets", value: userTickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length, gradient: "from-blue-600 to-indigo-600" },
    { label: "Resolved", value: userTickets.filter(t => t.status === 'Resolved').length, gradient: "from-emerald-500 to-teal-600" }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <Badge className="bg-blue-500/20 text-blue-200 border-blue-500/30 backdrop-blur-md px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">
              Support & Help Center
            </Badge>
            <h1 className="text-5xl font-black tracking-tight leading-tight">Need assistance?</h1>
            <p className="text-blue-100/70 font-medium text-lg max-w-xl leading-relaxed">
              Submit a ticket for technical issues, academic queries, or administrative support. Our team will get back to you shortly.
            </p>
            <div className="flex gap-8 pt-2">
               {stats.map(stat => (
                 <div key={stat.label}>
                    <p className="text-blue-200/50 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
                 </div>
               ))}
            </div>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-white hover:bg-blue-50 text-slate-900 rounded-[1.5rem] font-black px-10 h-16 shadow-2xl shadow-white/10 group transition-all">
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-500" />
                CREATE NEW TICKET
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-slate-50 p-8 border-b border-slate-100">
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <DialogTitle className="text-2xl font-black text-slate-900">New Support Request</DialogTitle>
                  </div>
                  <p className="text-slate-500 font-medium">Please provide details about the issue you're facing.</p>
                </DialogHeader>
              </div>
              
              <div className="p-10 space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ticket Title</label>
                  <Input 
                    placeholder="Briefly describe the subject (e.g., Login issue)" 
                    className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-300 transition-all font-semibold text-slate-900 shadow-inner" 
                    value={newTicket.title} 
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })} 
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Description</label>
                  <Textarea 
                    placeholder="Provide as much detail as possible to help us resolve it faster..." 
                    rows={5} 
                    className="rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-300 transition-all font-semibold text-slate-900 shadow-inner resize-none p-5" 
                    value={newTicket.description} 
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <Select value={newTicket.category} onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}>
                      <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white transition-all font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="Financial">Financial</SelectItem>
                        <SelectItem value="Administrative">Administrative</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Priority Level</label>
                    <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
                      <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white transition-all font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl z-[100]">
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="rounded-xl font-bold px-6">Cancel</Button>
                <Button onClick={handleCreateTicket} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black px-10 shadow-lg shadow-blue-200">
                  SUBMIT TICKET
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 relative w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder="Search your tickets by title or content..." 
            className="h-16 pl-14 pr-6 border-none bg-white shadow-2xl shadow-slate-200/50 rounded-[1.5rem] font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/10 transition-all" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="w-full md:w-auto bg-white p-1 rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[200px] h-14 border-none bg-transparent font-bold text-slate-600">
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
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredTickets.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[3rem] p-32 text-center shadow-2xl shadow-slate-200/20 border border-slate-50">
              <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <MessageSquare className="w-12 h-12 text-slate-200" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">You have no tickets</h3>
              <p className="text-slate-400 font-medium max-w-sm mx-auto text-lg mb-10">
                {searchQuery || filterStatus !== "all" ? "No matches for your current filters." : "If you need help, our support team is just one ticket away."}
              </p>
              {!searchQuery && filterStatus === "all" && (
                <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black h-16 px-12 shadow-2xl shadow-blue-200 group">
                  <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                  CREATE YOUR FIRST TICKET
                </Button>
              )}
            </motion.div>
          ) : (
            filteredTickets.map((ticket, index) => (
              <motion.div 
                key={ticket._id || ticket.id} 
                layout 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="p-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer border-none shadow-xl shadow-slate-200/30 bg-white group rounded-[2.5rem] relative overflow-hidden active:scale-[0.99]" 
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="flex-1 min-w-0 space-y-6">
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-mono text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest">
                          #{ticket.ticketNumber}
                        </Badge>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{ticket.category}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">{ticket.title}</h3>
                        <p className="text-slate-500 font-medium line-clamp-1 text-lg">{ticket.description}</p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-6 pt-2">
                        <Badge className={`${getStatusColor(ticket.status)} border-none px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-sm`}>
                          <div className="flex items-center gap-2">
                             {getStatusIcon(ticket.status)}
                             {ticket.status}
                          </div>
                        </Badge>
                        <Badge className={`${getPriorityColor(ticket.priority)} border-none px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-sm`}>
                          {ticket.priority}
                        </Badge>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-black uppercase tracking-tighter ml-auto md:ml-0">
                          <Calendar className="w-4 h-4 text-slate-300" />
                          {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-10 self-end lg:self-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-all">
                      <div className="text-center px-4">
                        <div className="flex items-center justify-center gap-2 text-slate-400 group-hover:text-blue-600 mb-1 transition-colors">
                          <MessageSquare className="w-6 h-6" />
                          <span className="text-2xl font-black tracking-tighter">{ticket.messages?.length || 0}</span>
                        </div>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Responses</p>
                      </div>
                      <div className="h-12 w-[2px] bg-slate-200" />
                      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                        <ChevronRight className="w-7 h-7" />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white rounded-[3rem] border-none shadow-[0_50px_100px_rgba(0,0,0,0.1)] p-0">
          {selectedTicket && (
            <>
              <div className="bg-slate-900 p-10 text-white relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-50" />
                <div className="relative z-10 space-y-4">
                   <div className="flex items-center justify-between">
                     <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-md px-3 py-1 font-mono tracking-widest">
                       #{selectedTicket.ticketNumber}
                     </Badge>
                     <Badge className={`${getStatusColor(selectedTicket.status)} border-none px-6 py-2 rounded-2xl font-black uppercase text-[10px] shadow-2xl`}>
                       {selectedTicket.status}
                     </Badge>
                   </div>
                   <DialogTitle className="text-4xl font-black tracking-tight leading-tight">{selectedTicket.title}</DialogTitle>
                   <div className="flex items-center gap-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-2"><Tag className="w-4 h-4" /> {selectedTicket.category}</span>
                      <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {format(new Date(selectedTicket.createdAt), "MMM d, h:mm a")}</span>
                   </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-12 space-y-12 bg-white">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Original Inquiry</h4>
                  <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100/50 relative">
                    <p className="text-xl font-medium text-slate-800 leading-relaxed italic">"{selectedTicket.description}"</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timeline & Conversation</h4>
                  </div>
                  
                  <div className="space-y-10 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                    {selectedTicket.messages?.map((message, idx) => (
                      <div key={message._id || message.id} className="flex gap-10 relative">
                        <div className={`w-10 h-10 rounded-2xl z-10 flex items-center justify-center font-black text-xs text-white shadow-xl ${
                          message.senderId === user?.id || message.senderId === user?._id ? "bg-blue-600" : "bg-slate-900"
                        }`}>
                          {message.senderName?.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className={`rounded-3xl p-6 shadow-sm border ${
                            message.senderId === user?.id || message.senderId === user?._id 
                            ? "bg-white border-blue-100" 
                            : "bg-slate-50 border-slate-100"
                          }`}>
                            <div className="flex items-center justify-between mb-3">
                               <span className="text-sm font-black text-slate-900">{message.senderName}</span>
                               <span className="text-[10px] font-bold text-slate-300">{format(new Date(message.timestamp), "MMM d, h:mm a")}</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed font-medium">{message.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedTicket.status !== "Closed" && selectedTicket.status !== "Resolved" && (
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex-shrink-0">
                  <div className="bg-white rounded-[2rem] p-4 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-end gap-4 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <Textarea 
                      placeholder="Type your message to support..." 
                      rows={2} 
                      value={replyMessage} 
                      onChange={(e) => setReplyMessage(e.target.value)} 
                      className="flex-1 border-none bg-transparent focus:ring-0 text-slate-900 placeholder:text-slate-400 py-2 resize-none"
                    />
                    <Button 
                      onClick={handleSendReply} 
                      disabled={!replyMessage.trim()} 
                      className="bg-blue-600 hover:bg-blue-700 h-14 w-14 rounded-2xl flex-shrink-0 shadow-lg shadow-blue-200"
                    >
                      <Send className="w-5 h-5" />
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
