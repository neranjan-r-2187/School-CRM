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
  Send
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
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
    ticket.createdBy?._id === user?.id || ticket.createdBy === user?.id
  );

  const filteredTickets = userTickets.filter((ticket) => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTicket = async () => {
    if (!newTicket.title || !newTicket.description) {
      showToast("error", "Validation Error", "Please fill in all required fields.");
      return;
    }

    try {
      await addTicket(newTicket);
      showToast("success", "Ticket Created", `Your ${newTicket.category} ticket has been submitted successfully.`);
      setIsCreateDialogOpen(false);
      setNewTicket({
        title: "",
        description: "",
        category: "Technical",
        priority: "Medium"
      });
    } catch (error) {
      showToast("error", "Error", "Failed to create ticket.");
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    
    try {
      await addTicketMessage(selectedTicket._id || selectedTicket.id, replyMessage);
      setReplyMessage("");
      showToast("success", "Message Sent", "Your reply has been added to the ticket.");
      
      // Update local state for the selected ticket
      const newMessage = {
        _id: `msg-${Date.now()}`,
        senderId: user?.id,
        senderName: user?.name,
        senderRole: user?.role,
        message: replyMessage,
        timestamp: new Date().toISOString()
      };
      
      setSelectedTicket(prev => ({
        ...prev,
        messages: [...(prev.messages || []), newMessage]
      }));
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
      case "Open": return "bg-blue-100 text-blue-700";
      case "In Progress": return "bg-amber-100 text-amber-700";
      case "Resolved": return "bg-green-100 text-green-700";
      case "Closed": return "bg-slate-100 text-slate-700";
      default: return "";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low": return "bg-slate-100 text-slate-700";
      case "Medium": return "bg-blue-100 text-blue-700";
      case "High": return "bg-orange-100 text-orange-700";
      case "Urgent": return "bg-red-100 text-red-700";
      default: return "";
    }
  };

  const stats = [
    { label: "Total Tickets", value: userTickets.length, color: "text-blue-600" },
    { label: "Open", value: userTickets.filter((t) => t.status === "Open").length, color: "text-orange-600" },
    { label: "In Progress", value: userTickets.filter((t) => t.status === "In Progress").length, color: "text-amber-600" },
    { label: "Resolved", value: userTickets.filter((t) => t.status === "Resolved").length, color: "text-green-600" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Support Tickets</h1>
          <p className="text-slate-600 mt-1">Manage your support requests and track their progress</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Title</label>
                <Input 
                  placeholder="Brief description of your issue" 
                  value={newTicket.title} 
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <Textarea 
                  placeholder="Provide detailed information about your issue..." 
                  rows={4} 
                  value={newTicket.description} 
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <Select value={newTicket.category} onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Financial">Financial</SelectItem>
                      <SelectItem value="Administrative">Administrative</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Priority</label>
                  <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateTicket} className="bg-blue-600 hover:bg-blue-700">Create Ticket</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search tickets..." 
              className="pl-10" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTickets.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No tickets found</h3>
              <p className="text-slate-500 mb-6">
                {searchQuery || filterStatus !== "all" ? "Try adjusting your filters" : "Create your first support ticket to get help"}
              </p>
              {!searchQuery && filterStatus === "all" && (
                <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Ticket
                </Button>
              )}
            </Card>
          ) : (
            filteredTickets.map((ticket) => (
              <motion.div key={ticket._id || ticket.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card 
                  className="p-6 hover:shadow-md transition-all cursor-pointer border-slate-100" 
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">{ticket.title}</h3>
                        <Badge variant="secondary" className="font-mono text-[10px]">{ticket.ticketNumber}</Badge>
                      </div>
                      <p className="text-sm text-slate-500 mb-4 line-clamp-1">{ticket.description}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge className={`${getStatusColor(ticket.status)} border-none flex items-center gap-1.5`}>
                          {getStatusIcon(ticket.status)}
                          {ticket.status}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1 text-[11px]">
                          <Tag className="w-3 h-3" />
                          {ticket.category}
                        </Badge>
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="flex items-center gap-1.5 text-sm font-bold">
                        <MessageSquare className="w-4 h-4" />
                        <span>{ticket.messages?.length || 0}</span>
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col bg-white">
          {selectedTicket && (
            <>
              <DialogHeader className="flex-shrink-0 border-b pb-4">
                <div className="flex items-start justify-between gap-4 pr-6">
                  <div>
                    <DialogTitle className="text-2xl font-black text-slate-900">{selectedTicket.title}</DialogTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="font-mono text-[10px]">{selectedTicket.ticketNumber}</Badge>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Created {format(new Date(selectedTicket.createdAt), "MMM d, h:mm a")}</span>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(selectedTicket.status)} border-none px-3 py-1 font-bold`}>
                    {selectedTicket.status}
                  </Badge>
                </div>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto py-6 space-y-8 pr-2">
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</p>
                    <p className="text-sm font-bold text-slate-900">{selectedTicket.category}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Priority</p>
                    <Badge className={getPriorityColor(selectedTicket.priority)}>{selectedTicket.priority}</Badge>
                  </div>
                  {selectedTicket.assignedTo?.name && (
                    <div className="col-span-2 pt-2 border-t border-slate-100 mt-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned Support Staff</p>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                          {selectedTicket.assignedTo.name.charAt(0)}
                        </div>
                        <p className="text-sm font-bold text-slate-900">{selectedTicket.assignedTo.name}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Original Description</h4>
                  <p className="text-sm text-slate-700 bg-white border border-slate-100 p-4 rounded-xl shadow-sm">{selectedTicket.description}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Conversation</h4>
                  <div className="space-y-6">
                    {selectedTicket.messages?.map((message) => (
                      <div key={message._id || message.id} className={`flex gap-3 ${message.senderId === user?.id ? "flex-row-reverse" : ""}`}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${
                          message.senderId === user?.id ? "bg-blue-600" : "bg-slate-400"
                        }`}>
                          {message.senderName?.charAt(0)}
                        </div>
                        <div className={`flex flex-col ${message.senderId === user?.id ? "items-end" : "items-start"}`}>
                          <div className={`max-w-[90%] rounded-2xl p-4 shadow-sm ${
                            message.senderId === user?.id ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border border-slate-100 text-slate-900 rounded-tl-none"
                          }`}>
                            <p className="text-sm">{message.message}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 font-bold">
                            {message.senderName} • {format(new Date(message.timestamp), "h:mm a")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedTicket.status !== "Closed" && selectedTicket.status !== "Resolved" && (
                <div className="flex-shrink-0 border-t pt-4 bg-white mt-auto">
                  <div className="relative">
                    <Textarea 
                      placeholder="Type your message..." 
                      rows={2} 
                      value={replyMessage} 
                      onChange={(e) => setReplyMessage(e.target.value)} 
                      className="resize-none border-slate-200 focus:ring-blue-500 pr-12"
                    />
                    <Button 
                      onClick={handleSendReply} 
                      disabled={!replyMessage.trim()} 
                      size="icon"
                      className="absolute right-2 bottom-2 bg-blue-600 hover:bg-blue-700 h-8 w-8"
                    >
                      <Send className="w-4 h-4" />
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
