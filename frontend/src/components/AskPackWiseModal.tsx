import React, { useState, useEffect } from 'react';
import { X, Send, HelpCircle, Sparkles, Bot, Plus, Trash2, Edit2, MessageSquare, Search, AlertCircle, Check } from 'lucide-react';
import { RecommendationResult } from '../types';

interface AskProps {
  isOpen: boolean;
  onClose: () => void;
  activeResult?: RecommendationResult | null;
}

interface ChatMsg {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMsg[];
}

export const AskPackWiseModal: React.FC<AskProps> = ({ isOpen, onClose, activeResult }) => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const local = localStorage.getItem("packwise_chats");
    if (local) {
      try { return JSON.parse(local); } catch (e) {}
    }
    const defaultConv: Conversation = {
      id: "conv-1",
      title: "Packaging Science Q&A",
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleTimeString(),
      messages: [
        {
          id: "m-1",
          sender: "bot",
          text: "Hello! I am Ask PackWise, your food packaging science assistant. Ask me about OTR, WVTR, respiration produce films, MAP gas flushing, polymer barrier properties, or your active recommendation!",
          timestamp: new Date().toLocaleTimeString()
        }
      ]
    };
    return [defaultConv];
  });

  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || "conv-1");
  const [input, setInput] = useState('');
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [newTitleText, setNewTitleText] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("packwise_chats", JSON.stringify(conversations));
  }, [conversations]);

  if (!isOpen) return null;

  const currentConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  const handleCreateNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: `New Packaging Inquiry ${conversations.length + 1}`,
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleTimeString(),
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: "bot",
          text: "Started a new inquiry session. How can I assist with food packaging materials or barrier specifications?",
          timestamp: new Date().toLocaleTimeString()
        }
      ]
    };
    setConversations([newConv, ...conversations]);
    setActiveConvId(newId);
  };

  const handleRenameChat = (convId: string) => {
    if (!newTitleText.trim()) return;
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, title: newTitleText.trim() } : c));
    setEditingTitleId(null);
  };

  const handleDeleteSingleChat = (convId: string) => {
    const remaining = conversations.filter(c => c.id !== convId);
    if (remaining.length === 0) {
      handleCreateNewChat();
    } else {
      setConversations(remaining);
      if (activeConvId === convId) {
        setActiveConvId(remaining[0].id);
      }
    }
    setDeleteConfirmId(null);
  };

  const handleDeleteAllChats = () => {
    const resetConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: "New Packaging Inquiry",
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleTimeString(),
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: "bot",
          text: "All previous conversations cleared. Ready for your next packaging inquiry!",
          timestamp: new Date().toLocaleTimeString()
        }
      ]
    };
    setConversations([resetConv]);
    setActiveConvId(resetConv.id);
    setDeleteAllConfirm(false);
  };

  const handleSend = async (qText?: string) => {
    const question = (qText || input).trim();
    if (!question) return;

    const userMsg: ChatMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString()
    };

    // Update messages for current conversation
    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          updatedAt: new Date().toLocaleTimeString(),
          messages: [...c.messages, userMsg]
        };
      }
      return c;
    }));

    if (!qText) setInput('');

    // Dynamic grounded answer lookup
    let answer = "";
    const qLower = question.toLowerCase();

    if ((qLower.includes("why") && qLower.includes("recommended")) || qLower.includes("this packaging")) {
      if (activeResult) {
        answer = `Your active recommendation for '${activeResult.commodity_name}' selected ${activeResult.primary_material.name} (Structure: ${activeResult.primary_structure.code_name}) because: ${activeResult.why_selected_explanation}`;
      } else {
        answer = "No active recommendation is currently selected. Run a dynamic packaging analysis first, or select a report from history!";
      }
    } else if (qLower.includes("tomato") || qLower.includes("respiration")) {
      answer = "Fresh tomatoes have a high metabolic respiration rate. Sealing living produce in non-breathable 100% airtight plastic starves it of oxygen, triggering anaerobic fermentation, ethanol off-odors, and rapid decay. Micro-perforated film maintains O2/CO2 equilibrium while locking in humidity.";
    } else if (qLower.includes("otr")) {
      answer = "Oxygen Transmission Rate (OTR) quantifies oxygen gas volume permeating through film per unit area over 24 hours (cc/m²/24h). Fried snacks like potato chips require ultra-low OTR (<1.0 cc/m²/24h) to prevent lipid oxidation and rancidity.";
    } else if (qLower.includes("wvtr")) {
      answer = "Water Vapor Transmission Rate (WVTR) measures moisture permeating film (g/m²/24h). Low WVTR (<1.0 g/m²/24h) prevents dry biscuits/powders from picking up atmospheric moisture and turning soggy.";
    } else if (qLower.includes("map") || qLower.includes("modified atmosphere")) {
      answer = "Modified Atmosphere Packaging (MAP) replaces ambient air with a protective gas mix (e.g. 100% N2 for chips to stop oxidation, or 3-5% O2 / 5-10% CO2 for produce) to double shelf life without chemical additives.";
    } else if (qLower.includes("monomaterial") || qLower.includes("recycl")) {
      answer = "Monomaterial polyolefins (such as BOPP/CPP mono-PP or LDPE monolayer) can be easily recycled in standard municipal plastic streams, unlike traditional PET/Aluminium multi-material laminates which require specialized delamination.";
    } else {
      answer = `Based on PackWise AI packaging science database: For '${question}', we evaluate food moisture %, lipid oxidation risk, respiration rate, and storage temperature to specify exact barrier film thickness and polymer composition.`;
    }

    const botMsg: ChatMsg = {
      id: `msg-${Date.now() + 1}`,
      sender: 'bot',
      text: answer,
      timestamp: new Date().toLocaleTimeString()
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          updatedAt: new Date().toLocaleTimeString(),
          messages: [...c.messages, botMsg]
        };
      }
      return c;
    }));
  };

  const filteredConversations = conversations.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#4CAF50]/20 w-full max-w-4xl h-[620px] flex overflow-hidden relative">
        
        {/* Left Conversation History Sidebar */}
        <div className="w-72 bg-[#FFF8E7]/60 border-r border-amber-200/80 flex flex-col justify-between p-3 shrink-0">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-[#245B35] flex items-center gap-1">
                <MessageSquare className="w-4 h-4 text-[#4CAF50]" /> Chat History
              </span>
              <button
                onClick={handleCreateNewChat}
                className="p-1.5 bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white rounded-lg shadow-sm text-xs font-bold flex items-center gap-1"
                title="New Chat"
              >
                <Plus className="w-3.5 h-3.5" /> New
              </button>
            </div>

            {/* Search Conversations */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
              />
            </div>

            {/* Conversation List */}
            <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
              {filteredConversations.map(c => {
                const isActive = c.id === activeConvId;
                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveConvId(c.id)}
                    className={`p-2.5 rounded-xl cursor-pointer text-xs font-semibold flex justify-between items-center transition-all ${
                      isActive ? 'bg-[#245B35] text-white shadow-sm' : 'hover:bg-amber-100/50 text-slate-700'
                    }`}
                  >
                    {editingTitleId === c.id ? (
                      <div className="flex items-center gap-1 w-full" onClick={e => e.stopPropagation()}>
                        <input
                          type="text"
                          value={newTitleText}
                          onChange={(e) => setNewTitleText(e.target.value)}
                          className="px-1.5 py-0.5 rounded text-xs text-slate-900 border w-full"
                          autoFocus
                        />
                        <button onClick={() => handleRenameChat(c.id)} className="text-emerald-300 hover:text-white"><Check className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <>
                        <div className="truncate pr-1">
                          <p className="font-bold truncate">{c.title}</p>
                          <p className="text-[10px] opacity-75">{c.messages.length} msgs • {c.createdAt}</p>
                        </div>
                        {isActive && (
                          <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                            <button onClick={() => { setEditingTitleId(c.id); setNewTitleText(c.title); }} className="p-1 hover:bg-white/20 rounded" title="Rename"><Edit2 className="w-3 h-3 text-amber-300" /></button>
                            <button onClick={() => setDeleteConfirmId(c.id)} className="p-1 hover:bg-white/20 rounded text-red-300" title="Delete"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setDeleteAllConfirm(true)}
            className="w-full py-1.5 text-[11px] font-bold text-tomato-red hover:bg-red-50 border border-red-200 rounded-xl transition-colors flex items-center justify-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All Chats
          </button>
        </div>

        {/* Right Main Chat Area */}
        <div className="flex-1 flex flex-col justify-between bg-white relative">
          
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-[#245B35] to-[#4CAF50] p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-[#FFC107]" />
              <div>
                <h3 className="font-extrabold text-sm leading-none">{currentConv.title}</h3>
                <p className="text-[10px] text-slate-100">PackWise AI Science Engine Assistant</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="p-2.5 bg-[#FFF8E7] border-b border-amber-200/60 overflow-x-auto flex gap-2 shrink-0">
            {[
              "Why was this packaging recommended?",
              "Why does tomato need breathable packaging?",
              "What is OTR vs WVTR?",
              "Why is monomaterial PP eco-friendly?"
            ].map((sq, i) => (
              <button
                key={i}
                onClick={() => handleSend(sq)}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-[#4CAF50]/30 text-[#245B35] font-bold text-[11px] rounded-lg shrink-0 transition-colors"
              >
                {sq}
              </button>
            ))}
          </div>

          {/* Message Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {currentConv.messages.map((m) => (
              <div key={m.id} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-[#4CAF50] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                <div className={`p-3.5 rounded-2xl max-w-md text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#245B35] text-white font-medium rounded-tr-none'
                    : 'bg-white text-slate-700 border border-slate-200 shadow-sm rounded-tl-none font-normal'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Ask PackWise about OTR, MAP, or active recommendation..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#4CAF50]"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white rounded-xl shadow-md transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Single Chat Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-center">
            <AlertCircle className="w-10 h-10 text-tomato-red mx-auto" />
            <h3 className="font-extrabold text-base text-[#245B35]">Delete Conversation?</h3>
            <p className="text-xs text-slate-500">Are you sure you want to delete this specific chat thread?</p>
            <div className="flex gap-2 justify-center pt-2">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600">Cancel</button>
              <button onClick={() => handleDeleteSingleChat(deleteConfirmId)} className="px-5 py-2 bg-tomato-red text-white rounded-xl text-xs font-extrabold shadow-md">Delete Chat</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Chats Confirmation Modal */}
      {deleteAllConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-center">
            <AlertCircle className="w-10 h-10 text-tomato-red mx-auto" />
            <h3 className="font-extrabold text-base text-[#245B35]">Delete ALL Conversations?</h3>
            <p className="text-xs text-slate-500">This will permanently erase your entire Ask PackWise chat history across all sessions.</p>
            <div className="flex gap-2 justify-center pt-2">
              <button onClick={() => setDeleteAllConfirm(false)} className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600">Cancel</button>
              <button onClick={handleDeleteAllChats} className="px-5 py-2 bg-tomato-red text-white rounded-xl text-xs font-extrabold shadow-md">Confirm Clear All</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
