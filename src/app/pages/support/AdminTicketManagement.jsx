import { useState } from "react";
import { motion } from "motion/react";
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
  UserPlus
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
      
      // Update local state for immediate feedback
      const newMessage = {
        _id: `msg-${Date.now()}`,
        senderId: user?.id || "",
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
      
      // Notify creator if status changed to Resolved
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
      case "Open": return "bg-blue-100 text-blue-700 border-blue-200";
      case "In Progress": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Resolved": return "bg-green-100 text-green-700 border-green-200";
      case "Closed": return "bg-slate-100 text-slate-700 border-slate-200";
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
    { label: "Total Tickets", value: tickets.length, color: "bg-blue-500", icon: MessageSquare },
    { label: "Open", value: tickets.filter((t) => t.status === "Open").length, color: "bg-orange-500", icon: Clock },
    { label: "In Progress", value: tickets.filter((t) => t.status === "In Progress").length, color: "bg-amber-500", icon: AlertCircle },
    { label: "Resolved", value: tickets.filter((t) => t.status === "Resolved").length, color: "bg-green-500", icon: CheckCircle2 }
  ];

  const staffMembers = users.filter(u => u.role === "Admin" || u.role === "Staff" || u.role === "Teacher");

  if (selectedTicket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => setSelectedTicket(null)} className="pl-0 hover:bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tickets
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteTicket(selectedTicket._id || selectedTicket.id)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Ticket
          </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{selectedTicket.title}</h1>
              <Badge variant="outline" className="text-xs">{selectedTicket.ticketNumber}</Badge>
            </div>
            <p className="text-slate-500 mt-1">Created on {format(new Date(selectedTicket.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
          </div>
          <Badge className={`${getStatusColor(selectedTicket.status)} border px-3 py-1`}>
            {getStatusIcon(selectedTicket.status)}
            <span className="ml-1.5">{selectedTicket.status}</span>
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Description</h3>
              <p className="text-slate-600 whitespace-pre-wrap">{selectedTicket.description}</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-6">Conversation</h3>
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
                {selectedTicket.messages?.map((message) => (
                  <div key={message._id || message.id} className={`flex gap-4 ${message.senderRole === "Admin" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-xs ${
                      message.senderRole === "Admin" ? "bg-blue-600" : "bg-slate-500"
                    }`}>
                      {message.senderName?.charAt(0)}
                    </div>
                    <div className={`flex flex-col ${message.senderRole === "Admin" ? "items-end" : "items-start"}`}>
                      <div className={`p-4 rounded-2xl max-w-[80%] ${
                        message.senderRole === "Admin" ? "bg-blue-600 text-white rounded-tr-none" : "bg-slate-100 text-slate-900 rounded-tl-none"
                      }`}>
                        <p className="text-sm">{message.message}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 font-medium">
                        {message.senderName} • {format(new Date(message.timestamp), "MMM d, h:mm a")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedTicket.status !== "Closed" && (
                <div className="border-t pt-6 space-y-4">
                  <Textarea 
                    placeholder="Type your response..." 
                    rows={4} 
                    value={replyMessage} 
                    onChange={(e) => setReplyMessage(e.target.value)} 
                    className="resize-none border-slate-200 focus:ring-blue-500"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-500">Replying as <span className="font-semibold text-slate-900">{user?.name}</span></p>
                    <Button onClick={handleSendReply} disabled={!replyMessage.trim()} className="bg-blue-600 hover:bg-blue-700">
                      <Send className="w-4 h-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Ticket Controls</h3>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Update Status</label>
                  <Select value={selectedTicket.status} onValueChange={handleUpdateStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Assign To</label>
                  <Select 
                    value={selectedTicket.assignedTo?._id || selectedTicket.assignedTo || "unassigned"} 
                    onValueChange={handleAssignTicket}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Assign staff..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {staffMembers.map(staff => (
                        <SelectItem key={staff._id} value={staff._id}>{staff.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-500">Priority</span>
                    <Badge className={getPriorityColor(selectedTicket.priority)}>{selectedTicket.priority}</Badge>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Category</span>
                    <span className="font-medium text-slate-900">{selectedTicket.category}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-slate-50 border-none shadow-none">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Requester Details</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                  {selectedTicket.createdBy?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{selectedTicket.createdBy?.name || "Unknown User"}</p>
                  <p className="text-xs text-slate-500">{selectedTicket.createdBy?.role || "User"}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <User className="w-3.5 h-3.5" />
                  ID: {selectedTicket.createdBy?._id || selectedTicket.createdBy}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Ticket Management</h1>
        <p className="text-slate-500 font-medium">Monitor and resolve administrative & support issues</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 border-none shadow-sm bg-white">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center shadow-lg shadow-${stat.color.split('-')[1]}-200`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-4 bg-white border-none shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by title, TKT number, or name..." 
              className="pl-10 border-slate-100 bg-slate-50/50" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[180px] border-slate-100 bg-slate-50/50">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-full md:w-[180px] border-slate-100 bg-slate-50/50">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No tickets found</h3>
            <p className="text-slate-500 mt-2">Adjust your search or filters to find what you're looking for.</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <motion.div key={ticket._id || ticket.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card 
                className="p-6 hover:shadow-xl transition-all cursor-pointer border-none shadow-sm bg-white group"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{ticket.title}</h3>
                      <Badge variant="secondary" className="font-mono text-[10px]">{ticket.ticketNumber}</Badge>
                    </div>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-1">{ticket.description}</p>
                    <div className="flex flex-wrap items-center gap-4">
                      <Badge className={`${getStatusColor(ticket.status)} border-none px-2.5 py-0.5 text-[10px] font-bold uppercase`}>
                        {ticket.status}
                      </Badge>
                      <Badge className={`${getPriorityColor(ticket.priority)} border-none px-2.5 py-0.5 text-[10px] font-bold uppercase`}>
                        {ticket.priority}
                      </Badge>
                      <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          {ticket.createdBy?.name || "User"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                        </span>
                        {ticket.assignedTo && (
                          <span className="flex items-center gap-1.5 text-blue-600">
                            <UserPlus className="w-3.5 h-3.5" />
                            Assigned to {ticket.assignedTo.name || "Staff"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 self-end md:self-center">
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 text-slate-400 mb-1">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm font-bold">{ticket.messages?.length || 0}</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Messages</p>
                    </div>
                    <div className="h-10 w-[1px] bg-slate-100 hidden md:block" />
                    <Button variant="ghost" size="icon" className="text-slate-300 group-hover:text-red-500 group-hover:bg-red-50" onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTicket(ticket._id || ticket.id);
                    }}>
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
