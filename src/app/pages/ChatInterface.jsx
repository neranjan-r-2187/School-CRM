import { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Plus, 
  MessageSquare,
  ArrowLeft,
  Check,
  CheckCheck
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../hooks/useChat";

export const ChatInterface = () => {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { 
    conversations, 
    messages, 
    sendMessage, 
    searchUsers 
  } = useChat(selectedConversationId);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    sendMessage({
      conversationId: selectedConversationId,
      text: messageText
    });
    setMessageText("");
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      setIsSearching(true);
      const results = await searchUsers(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const startNewChat = (recipient) => {
    sendMessage({
        recipientId: recipient._id,
        text: "Hello!"
    });
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  const selectedConversation = conversations?.find(c => c._id === selectedConversationId);
  const recipient = selectedConversation?.participants?.find(p => p._id !== user?._id && p._id !== user?.id);

  return (
    <div className="flex h-[calc(100vh-160px)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Sidebar */}
      <div className={`w-full lg:w-80 border-r border-slate-200 flex flex-col ${selectedConversationId ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search people..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 shadow-sm"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isSearching ? (
            <div className="p-2 space-y-1">
              <p className="text-xs font-semibold text-slate-500 px-3 py-2 uppercase tracking-wider">Search Results</p>
              {searchResults.map(result => (
                <button 
                  key={result._id}
                  onClick={() => startNewChat(result)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <img src={result.avatar || `https://ui-avatars.com/api/?name=${result.name}`} className="w-10 h-10 rounded-full" alt={result.name} />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-slate-900">{result.name}</p>
                    <p className="text-xs text-slate-500">{result.role}</p>
                  </div>
                </button>
              ))}
              {searchResults.length === 0 && <p className="text-center text-slate-500 text-sm py-4">No users found</p>}
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {conversations?.map(conv => {
                const otherUser = conv.participants?.find(p => p._id !== user?._id && p._id !== user?.id);
                const isActive = selectedConversationId === conv._id;
                return (
                  <button 
                    key={conv._id}
                    onClick={() => setSelectedConversationId(conv._id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                  >
                    <div className="relative">
                      <img src={otherUser?.avatar || `https://ui-avatars.com/api/?name=${otherUser?.name}`} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt={otherUser?.name} />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></span>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex justify-between items-center mb-1">
                        <p className={`text-sm font-bold truncate ${isActive ? 'text-blue-700' : 'text-slate-900'}`}>{otherUser?.name}</p>
                        {conv.lastMessage && (
                          <span className="text-[10px] text-slate-400">
                            {format(new Date(conv.lastMessage.createdAt || conv.updatedAt), 'HH:mm')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{conv.lastMessage?.text || 'No messages yet'}</p>
                    </div>
                  </button>
                );
              })}
              {conversations?.length === 0 && (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 text-sm">No conversations yet. Use search to start a chat!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-slate-50/30 ${!selectedConversationId ? 'hidden lg:flex' : 'flex'}`}>
        {selectedConversationId ? (
          <>
            {/* Header */}
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedConversationId(null)}
                  className="lg:hidden p-2 -ml-2 text-slate-500"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img src={recipient?.avatar || `https://ui-avatars.com/api/?name=${recipient?.name}`} className="w-10 h-10 rounded-full" alt={recipient?.name} />
                <div>
                  <p className="text-sm font-bold text-slate-900">{recipient?.name}</p>
                  <p className="text-xs text-green-500 font-medium">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages?.map((msg) => {
                const isMe = msg.sender?._id === user?._id || msg.sender === user?._id || msg.sender?._id === user?.id || msg.sender === user?.id;
                return (
                  <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] group`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-900 rounded-tl-none border border-slate-100'}`}>
                        {msg.text}
                      </div>
                      <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[10px] text-slate-400">{format(new Date(msg.createdAt), 'HH:mm')}</span>
                        {isMe && (msg.isRead ? <CheckCheck className="w-3 h-3 text-blue-500" /> : <Check className="w-3 h-3 text-slate-400" />)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-200 shadow-lg">
              <form onSubmit={handleSend} className="flex items-center gap-3">
                <button type="button" className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Plus className="w-6 h-6" />
                </button>
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <button 
                  type="submit" 
                  disabled={!messageText.trim()}
                  className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/50">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6 rotate-12">
              <MessageSquare className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-slate-900 font-bold text-xl mb-2">Internal Messaging System</h3>
            <p className="max-w-xs text-sm text-slate-500">Secure role-based communication for students, parents, teachers, and administration.</p>
            <div className="mt-8 flex gap-4">
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200">
                     <img src={`https://i.pravatar.cc/150?u=${i}`} className="w-full h-full rounded-full" alt="user" />
                   </div>
                 ))}
               </div>
               <div className="flex flex-col justify-center text-left">
                  <p className="text-xs font-bold text-slate-900">100+ Members</p>
                  <p className="text-xs text-slate-500">Ready to connect</p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
