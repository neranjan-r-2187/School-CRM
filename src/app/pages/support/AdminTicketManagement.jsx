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
  LogOut,
  Building2,
  LayoutDashboard
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
import { useNavigate } from "react-router-dom";
export const AdminTicketManagement = () => {
  const { user, logout } = useAuth();
  const { showToast } = useNotifications();
  const { tickets, updateTicket, addTicketMessage, users } = useData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const filteredTickets = tickets.filter((ticket) => {
    const creator = users.find((u) => u.id === ticket.createdBy);
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) || (creator?.name.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });
  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    const message = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || "",
      senderName: user?.name || "",
      senderRole: user?.role || "",
      message: replyMessage,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      isInternal: false
    };
    addTicketMessage(selectedTicket.id, message);
    setSelectedTicket({
      ...selectedTicket,
      messages: [...selectedTicket.messages, message],
      updatedAt: message.timestamp
    });
    showToast("success", "Reply Sent", "Your message has been sent to the ticket creator.");
    setReplyMessage("");
  };
  const handleUpdateStatus = (status) => {
    if (!selectedTicket) return;
    updateTicket(selectedTicket.id, {
      status,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      ...status === "Resolved" && { resolvedAt: (/* @__PURE__ */ new Date()).toISOString() }
    });
    const updatedTicket = tickets.find((t) => t.id === selectedTicket.id);
    if (updatedTicket) {
      setSelectedTicket(updatedTicket);
    }
    showToast("success", "Status Updated", `Ticket status updated to ${status}`);
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "Open":
        return <Clock className="w-4 h-4" />;
      case "In Progress":
        return <AlertCircle className="w-4 h-4" />;
      case "Resolved":
        return <CheckCircle2 className="w-4 h-4" />;
      case "Closed":
        return <XCircle className="w-4 h-4" />;
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "In Progress":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Resolved":
        return "bg-green-100 text-green-700 border-green-200";
      case "Closed":
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "bg-slate-100 text-slate-700";
      case "Medium":
        return "bg-blue-100 text-blue-700";
      case "High":
        return "bg-orange-100 text-orange-700";
      case "Urgent":
        return "bg-red-100 text-red-700";
    }
  };
  const stats = [
    {
      label: "Total Tickets",
      value: tickets.length,
      color: "bg-blue-500",
      icon: MessageSquare
    },
    {
      label: "Open",
      value: tickets.filter((t) => t.status === "Open").length,
      color: "bg-orange-500",
      icon: Clock
    },
    {
      label: "In Progress",
      value: tickets.filter((t) => t.status === "In Progress").length,
      color: "bg-yellow-500",
      icon: AlertCircle
    },
    {
      label: "Resolved",
      value: tickets.filter((t) => t.status === "Resolved").length,
      color: "bg-green-500",
      icon: CheckCircle2
    }
  ];
  if (selectedTicket) {
    return <div className="min-h-screen bg-slate-50">
        {
      /* Admin Navbar */
    }
        <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">EduMaster Admin</h2>
                <p className="text-xs text-slate-500">Management Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate("/admin/dashboard")}
      className="flex items-center gap-2"
    >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0)}
                </div>
                <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="text-slate-600 hover:text-red-600"
    >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {
      /* Main Content */
    }
        <div className="p-8">
          {
      /* Header */
    }
          <div className="mb-6">
            <Button
      variant="ghost"
      onClick={() => setSelectedTicket(null)}
      className="mb-4"
    >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tickets
            </Button>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{selectedTicket.title}</h1>
                <p className="text-slate-500 mt-1">{selectedTicket.ticketNumber}</p>
              </div>
              <Badge className={`${getStatusColor(selectedTicket.status)} border`}>
                {getStatusIcon(selectedTicket.status)}
                <span className="ml-1">{selectedTicket.status}</span>
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {
      /* Ticket Details Sidebar */
    }
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Ticket Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    <Select
      value={selectedTicket.status}
      onValueChange={(value) => handleUpdateStatus(value)}
    >
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
                    <p className="text-xs text-slate-500 mb-1">Priority</p>
                    <Badge className={`${getPriorityColor(selectedTicket.priority)} w-full justify-center`}>
                      {selectedTicket.priority}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-1">Category</p>
                    <p className="text-sm font-medium text-slate-900">{selectedTicket.category}</p>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-slate-500 mb-1">Created By</p>
                    <p className="text-sm font-medium text-slate-900">{selectedTicket.createdByName}</p>
                    <p className="text-xs text-slate-500">{selectedTicket.createdByRole}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-1">Created On</p>
                    <p className="text-sm text-slate-900">{format(selectedTicket.createdAt, "MMM d, yyyy h:mm a")}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-1">Last Updated</p>
                    <p className="text-sm text-slate-900">{format(selectedTicket.updatedAt, "MMM d, yyyy h:mm a")}</p>
                  </div>

                  {selectedTicket.resolvedAt && <div>
                      <p className="text-xs text-slate-500 mb-1">Resolved On</p>
                      <p className="text-sm text-slate-900">{format(selectedTicket.resolvedAt, "MMM d, yyyy h:mm a")}</p>
                    </div>}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
      variant="outline"
      className="w-full justify-start"
      onClick={() => handleUpdateStatus("In Progress")}
    >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Mark In Progress
                  </Button>
                  <Button
      variant="outline"
      className="w-full justify-start"
      onClick={() => handleUpdateStatus("Resolved")}
    >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark Resolved
                  </Button>
                  <Button
      variant="outline"
      className="w-full justify-start"
      onClick={() => handleUpdateStatus("Closed")}
    >
                    <XCircle className="w-4 h-4 mr-2" />
                    Close Ticket
                  </Button>
                </div>
              </Card>
            </div>

            {
      /* Conversation */
    }
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Conversation</h3>
                
                {
      /* Description */
    }
                <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-2">Original Request</p>
                  <p className="text-sm text-slate-700">{selectedTicket.description}</p>
                </div>

                {
      /* Messages */
    }
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                  {selectedTicket.messages.map((message) => <div
      key={message.id}
      className={`flex gap-3 ${message.senderId === user?.id ? "flex-row-reverse" : ""}`}
    >
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${message.senderRole === "Admin" ? "bg-blue-600" : "bg-teal-600"}`}>
                          {message.senderName.charAt(0)}
                        </div>
                      </div>
                      <div className={`flex-1 ${message.senderId === user?.id ? "items-end" : "items-start"} flex flex-col`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 ${message.senderId === user?.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-900"}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium">{message.senderName}</p>
                            <Badge variant="outline" className={`text-xs ${message.senderId === user?.id ? "border-white/20 text-white/80" : "border-slate-200 text-slate-500"}`}>
                              {message.senderRole}
                            </Badge>
                          </div>
                          <p className="text-sm">{message.message}</p>
                        </div>
                        <span className="text-xs text-slate-500 mt-1 px-2">
                          {format(message.timestamp, "MMM d, h:mm a")}
                        </span>
                      </div>
                    </div>)}
                </div>

                {
      /* Reply Section */
    }
                {selectedTicket.status !== "Closed" && <div className="border-t pt-6">
                    <div className="space-y-3">
                      <Textarea
      placeholder="Type your response..."
      rows={4}
      value={replyMessage}
      onChange={(e) => setReplyMessage(e.target.value)}
      className="resize-none"
    />
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-slate-500">
                          Replying as <span className="font-medium">{user?.name}</span>
                        </p>
                        <Button
      onClick={handleSendReply}
      disabled={!replyMessage.trim()}
      className="bg-blue-600 hover:bg-blue-700"
    >
                          <Send className="w-4 h-4 mr-2" />
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </div>}
              </Card>
            </div>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-slate-50">
      {
    /* Admin Navbar */
  }
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">EduMaster Admin</h2>
              <p className="text-xs text-slate-500">Management Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
    variant="ghost"
    size="sm"
    onClick={() => navigate("/admin/dashboard")}
    className="flex items-center gap-2"
  >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0)}
              </div>
              <Button
    variant="ghost"
    size="sm"
    onClick={handleLogout}
    className="text-slate-600 hover:text-red-600"
  >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {
    /* Main Content */
  }
      <div className="p-8">
        {
    /* Header */
  }
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Ticket Management</h1>
          <p className="text-slate-500 mt-1">Monitor and resolve support tickets</p>
        </div>

        {
    /* Stats */
  }
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => <motion.div
    key={stat.label}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center flex-shrink-0`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-0.5">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>)}
        </div>

        {
    /* Filters */
  }
        <Card className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
    placeholder="Search tickets by title, number, or user..."
    className="pl-10"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
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
              <SelectTrigger className="w-full sm:w-[180px]">
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

        {
    /* Tickets List */
  }
        <div className="space-y-4">
          {filteredTickets.length === 0 ? <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No tickets found</h3>
              <p className="text-slate-500">Try adjusting your filters</p>
            </Card> : filteredTickets.map((ticket) => <motion.div
    key={ticket.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    layout
  >
                <Card
    className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
    onClick={() => setSelectedTicket(ticket)}
  >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{ticket.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {ticket.ticketNumber}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{ticket.description}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge className={`${getStatusColor(ticket.status)} border flex items-center gap-1`}>
                          {getStatusIcon(ticket.status)}
                          {ticket.status}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {ticket.category}
                        </Badge>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {ticket.createdByName}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(ticket.createdAt, "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MessageSquare className="w-4 h-4" />
                        <span>{ticket.messages.length}</span>
                      </div>
                      {ticket.messages.length > 0 && <span className="text-xs text-slate-500">
                          Last: {format(ticket.updatedAt, "h:mm a")}
                        </span>}
                    </div>
                  </div>
                </Card>
              </motion.div>)}
        </div>
      </div>
    </div>;
};
