import { useState } from "react";
import {
  Search,
  Paperclip,
  Mic,
  Send,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  Check,
  CheckCheck,
  Plus,
  MessageSquare,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { format } from "date-fns";
import { mockUsers, mockThreads, CURRENT_USER_ID } from "../data/mockData";
export const ChatInterface = () => {
  const navigate = useNavigate();
  const [activeThread, setActiveThread] = useState(null);
  const [threads, setThreads] = useState(mockThreads);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const filteredThreads = threads.filter((t) => {
    const participant = mockUsers.find((u) => u.id === t.participantId);
    return participant?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const handleThreadClick = (thread) => {
    setActiveThread(thread);
    setMessages(thread.messages);
    setShowChat(true);
    const updatedThreads = threads.map(
      (t) => t.id === thread.id ? { ...t, unreadCount: 0 } : t
    );
    setThreads(updatedThreads);
  };
  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeThread) return;
    const newMsg = {
      id: `new-${Date.now()}`,
      senderId: CURRENT_USER_ID,
      text: newMessage,
      timestamp: /* @__PURE__ */ new Date(),
      status: "sent"
    };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setNewMessage("");
    const updatedThreads = threads.map(
      (t) => t.id === activeThread.id ? { ...t, lastMessage: newMessage, lastMessageTime: /* @__PURE__ */ new Date(), messages: updatedMessages } : t
    );
    const currentThread = updatedThreads.find((t) => t.id === activeThread.id);
    const otherThreads = updatedThreads.filter((t) => t.id !== activeThread.id);
    if (currentThread) {
      setThreads([currentThread, ...otherThreads]);
    }
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyMsg = {
        id: `reply-${Date.now()}`,
        senderId: activeThread.participantId,
        text: "Thanks for the message. I will check and get back to you.",
        timestamp: /* @__PURE__ */ new Date(),
        status: "delivered"
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 2e3);
  };
  const startNewChat = (user) => {
    const existingThread = threads.find((t) => t.participantId === user.id);
    if (existingThread) {
      handleThreadClick(existingThread);
    } else {
      const newThread = {
        id: `new-thread-${Date.now()}`,
        participantId: user.id,
        lastMessage: "",
        lastMessageTime: /* @__PURE__ */ new Date(),
        unreadCount: 0,
        messages: []
      };
      setThreads([newThread, ...threads]);
      setActiveThread(newThread);
      setMessages([]);
      setShowChat(true);
    }
    setShowNewChatModal(false);
  };
  const getParticipant = (thread) => {
    return mockUsers.find((u) => u.id === thread.participantId);
  };
  return <div className="flex h-[calc(100vh-theme(spacing.32))] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
      
      {
    /* New Chat Modal */
  }
      <AnimatePresence>
        {showNewChatModal && <div className="absolute inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]"
  >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">New Message</h3>
                <button onClick={() => setShowNewChatModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 border-b border-slate-100">
                 <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
    type="text"
    placeholder="Search teachers, staff..."
    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
  />
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {mockUsers.filter((u) => u.id !== CURRENT_USER_ID).map((user) => <button
    key={user.id}
    onClick={() => startNewChat(user)}
    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl text-left transition-colors"
  >
                     <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                     <div>
                       <p className="font-semibold text-slate-900 text-sm">{user.name}</p>
                       <p className="text-xs text-slate-500">{user.role}</p>
                     </div>
                   </button>)}
              </div>
            </motion.div>
          </div>}
      </AnimatePresence>

      {
    /* Sidebar - Threads */
  }
      <div className={clsx(
    "w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50",
    showChat ? "hidden md:flex" : "flex"
  )}>
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <button onClick={() => navigate("/parent/dashboard")} className="md:hidden p-2 -ml-2 hover:bg-slate-100 rounded-full">
                <ArrowLeft className="w-5 h-5 text-slate-500" />
                </button>
                <h2 className="text-xl font-bold text-slate-800">Messages</h2>
            </div>
            <button
    onClick={() => setShowNewChatModal(true)}
    className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
  >
                <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search conversations..."
    className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
  />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredThreads.map((thread) => {
    const participant = getParticipant(thread);
    if (!participant) return null;
    return <motion.button
      key={thread.id}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleThreadClick(thread)}
      className={clsx(
        "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
        activeThread?.id === thread.id ? "bg-blue-50 border border-blue-100 shadow-sm" : "hover:bg-slate-100 border border-transparent"
      )}
    >
                <div className="relative">
                    <img src={participant.avatar} alt={participant.name} className="w-12 h-12 rounded-full border border-slate-200" />
                    {participant.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-slate-900 truncate text-sm">{participant.name}</h3>
                    <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
                        {format(new Date(thread.lastMessageTime), "h:mm a")}
                    </span>
                    </div>
                    <div className="flex justify-between items-center">
                    <p className={clsx("text-sm truncate pr-2", thread.unreadCount > 0 ? "font-semibold text-slate-800" : "text-slate-500")}>
                        {thread.lastMessage || "No messages yet"}
                    </p>
                    {thread.unreadCount > 0 && <span className="w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                        {thread.unreadCount}
                        </span>}
                    </div>
                </div>
                </motion.button>;
  })}
        </div>
      </div>

      {
    /* Main Chat Area */
  }
      <div className={clsx(
    "flex-1 flex flex-col bg-slate-50/30",
    !showChat ? "hidden md:flex" : "flex"
  )}>
        {activeThread && getParticipant(activeThread) ? <>
            {
    /* Header */
  }
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowChat(false)} className="md:hidden p-2 -ml-2 hover:bg-slate-100 rounded-full">
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <div className="relative">
                  <img src={getParticipant(activeThread)?.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                  {getParticipant(activeThread)?.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{getParticipant(activeThread)?.name}</h3>
                  <p className="text-xs text-slate-500">
                    {getParticipant(activeThread)?.role} • {getParticipant(activeThread)?.online ? "Online" : getParticipant(activeThread)?.lastActive}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <button className="p-2 hover:bg-slate-100 rounded-full"><Phone className="w-5 h-5" /></button>
                <button className="p-2 hover:bg-slate-100 rounded-full"><Video className="w-5 h-5" /></button>
                <button className="p-2 hover:bg-slate-100 rounded-full"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            {
    /* Messages */
  }
            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col-reverse">
              {isTyping && <div className="flex gap-3 mb-2">
                  <img src={getParticipant(activeThread)?.avatar} className="w-8 h-8 rounded-full self-end" alt="Avatar" />
                  <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>}
              
              {[...messages].reverse().map((msg, index) => {
    const isMe = msg.senderId === CURRENT_USER_ID;
    const showAvatar = !isMe && (index === 0 || messages[[...messages].reverse().indexOf(msg) - 1]?.senderId !== msg.senderId);
    return <motion.div
      key={msg.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "flex gap-3 max-w-[85%]",
        isMe ? "ml-auto flex-row-reverse" : ""
      )}
    >
                    {!isMe && <div className="w-8 flex-shrink-0">
                             {
      /* Always show avatar space or avatar for consistent alignment */
    }
                            <img src={getParticipant(activeThread)?.avatar} className="w-8 h-8 rounded-full self-end" alt="Avatar" />
                        </div>}
                    
                    <div className={clsx(
      "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
      isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"
    )}>
                        <p>{msg.text}</p>
                        <div className={clsx(
      "flex items-center justify-end gap-1 mt-1 text-[10px]",
      isMe ? "text-blue-100" : "text-slate-400"
    )}>
                        <span>{format(new Date(msg.timestamp), "h:mm a")}</span>
                        {isMe && (msg.status === "read" ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
                        </div>
                    </div>
                    </motion.div>;
  })}
              
              <div className="text-center my-4 pb-2">
                <span className="px-3 py-1 bg-slate-100 text-xs text-slate-500 rounded-full">Feb 04, 2026</span>
              </div>
            </div>

            {
    /* Input Area */
  }
            <div className="p-4 bg-white border-t border-slate-200">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <input
    type="text"
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    placeholder="Type a message..."
    className="w-full bg-slate-100 border-none rounded-full pl-4 pr-10 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
  />
                </div>
                {newMessage.trim() ? <button
    type="submit"
    className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
  >
                    <Send className="w-5 h-5" />
                  </button> : <button type="button" className="p-3 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors">
                    <Mic className="w-5 h-5" />
                  </button>}
              </form>
            </div>
          </> : <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Select a Conversation</h3>
            <p className="max-w-xs mx-auto">Choose a contact from the list or start a new chat with teachers or school staff.</p>
            <button
    onClick={() => setShowNewChatModal(true)}
    className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
  >
                Start New Chat
            </button>
          </div>}
      </div>
    </div>;
};
