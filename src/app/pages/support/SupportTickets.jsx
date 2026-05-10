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
  User,
  ChevronRight
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
  const { showToast, addNotification } = useNotifications();
  const { tickets, addTicket } = useData();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "Technical",
    priority: "Medium"
  });
  const userTickets = tickets.filter((ticket) => ticket.createdBy === user?.id);
  const filteredTickets = userTickets.filter((ticket) => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  const handleCreateTicket = () => {
    const ticket = {
      id: `ticket-${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(Math.random() * 1e4).toString().padStart(4, "0")}`,
      title: newTicket.title,
      description: newTicket.description,
      category: newTicket.category,
      priority: newTicket.priority,
      status: "Open",
      createdBy: user?.id || "",
      createdByRole: user?.role || "",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      messages: []
    };
    addTicket(ticket);
    showToast("success", "Ticket Created", `Your ${newTicket.category} ticket has been submitted successfully.`);
    addNotification({
      type: "info",
      title: "Ticket Submitted",
      message: `Your ticket "${newTicket.title}" has been created and assigned to support team.`
    });
    setIsCreateDialogOpen(false);
    setNewTicket({
      title: "",
      description: "",
      category: "Technical",
      priority: "Medium"
    });
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
        return "bg-blue-100 text-blue-700";
      case "In Progress":
        return "bg-orange-100 text-orange-700";
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "Closed":
        return "bg-slate-100 text-slate-700";
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
    { label: "Total Tickets", value: userTickets.length, color: "text-blue-600" },
    { label: "Open", value: userTickets.filter((t) => t.status === "Open").length, color: "text-orange-600" },
    { label: "In Progress", value: userTickets.filter((t) => t.status === "In Progress").length, color: "text-yellow-600" },
    { label: "Resolved", value: userTickets.filter((t) => t.status === "Resolved").length, color: "text-green-600" }
  ];
  return <div className="p-8 space-y-6">
      {
    /* Header */
  }
      <div className="flex items-center justify-between">
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
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTicket} className="bg-blue-600 hover:bg-blue-700">
                  Create Ticket
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {
    /* Stats */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => <motion.div
    key={stat.label}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
            <Card className="p-6">
              <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </Card>
          </motion.div>)}
      </div>

      {
    /* Filters */
  }
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
    placeholder="Search tickets..."
    className="pl-10"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
            </div>
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

      {
    /* Tickets List */
  }
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTickets.length === 0 ? <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No tickets found</h3>
              <p className="text-slate-500 mb-6">
                {searchQuery || filterStatus !== "all" ? "Try adjusting your filters" : "Create your first support ticket to get help"}
              </p>
              {!searchQuery && filterStatus === "all" && <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Ticket
                </Button>}
            </Card> : filteredTickets.map((ticket) => <motion.div
    key={ticket.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    layout
  >
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
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
                        <Badge className={`${getStatusColor(ticket.status)} flex items-center gap-1`}>
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
                          <Calendar className="w-3 h-3" />
                          {format(ticket.createdAt, "MMM d, yyyy")}
                        </span>
                        {ticket.assignedToName && <span className="text-xs text-slate-500 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            Assigned to {ticket.assignedToName}
                          </span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MessageSquare className="w-4 h-4" />
                        <span>{ticket.messages.length}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </Card>
              </motion.div>)}
        </AnimatePresence>
      </div>

      {
    /* Ticket Detail Dialog */
  }
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white">
          {selectedTicket && <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <DialogTitle className="text-xl">{selectedTicket.title}</DialogTitle>
                    <p className="text-sm text-slate-500 mt-1">{selectedTicket.ticketNumber}</p>
                  </div>
                  <Badge className={getStatusColor(selectedTicket.status)}>
                    {selectedTicket.status}
                  </Badge>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {
    /* Ticket Info */
  }
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Category</p>
                    <p className="text-sm font-medium text-slate-900">{selectedTicket.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Priority</p>
                    <Badge className={getPriorityColor(selectedTicket.priority)}>
                      {selectedTicket.priority}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Created</p>
                    <p className="text-sm text-slate-900">{format(selectedTicket.createdAt, "MMM d, yyyy h:mm a")}</p>
                  </div>
                  {selectedTicket.assignedToName && <div>
                      <p className="text-xs text-slate-500 mb-1">Assigned To</p>
                      <p className="text-sm text-slate-900">{selectedTicket.assignedToName}</p>
                    </div>}
                </div>

                {
    /* Description */
  }
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Description</h4>
                  <p className="text-sm text-slate-600">{selectedTicket.description}</p>
                </div>

                {
    /* Messages */
  }
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-4">Conversation</h4>
                  <div className="space-y-4">
                    {selectedTicket.messages.map((message) => <div key={message.id} className={`flex gap-3 ${message.senderId === user?.id ? "flex-row-reverse" : ""}`}>
                        <div className={`flex-1 ${message.senderId === user?.id ? "items-end" : "items-start"} flex flex-col`}>
                          <div className={`max-w-[80%] rounded-2xl p-4 ${message.senderId === user?.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-900"}`}>
                            <p className="text-sm font-medium mb-1">{message.senderName}</p>
                            <p className="text-sm">{message.message}</p>
                          </div>
                          <span className="text-xs text-slate-500 mt-1 px-2">
                            {format(message.timestamp, "MMM d, h:mm a")}
                          </span>
                        </div>
                      </div>)}
                  </div>
                </div>

                {
    /* Reply Section - Only show if ticket is not closed */
  }
                {selectedTicket.status !== "Closed" && selectedTicket.status !== "Resolved" && <div className="border-t pt-4">
                    <Textarea placeholder="Type your message..." rows={3} />
                    <div className="flex justify-end mt-3">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </div>}
              </div>
            </>}
        </DialogContent>
      </Dialog>
    </div>;
};
