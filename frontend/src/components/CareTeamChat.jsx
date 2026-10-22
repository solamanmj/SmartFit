import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, X, Dumbbell, Utensils, Sparkles, 
  CheckCircle2, User, ShieldCheck, Clock, ChevronDown, 
  Maximize2, Minimize2, Flame, Droplets, Zap
} from 'lucide-react';
import { 
  getConversationMessages, 
  sendChatMessage, 
  generateSmartSpecialistReply 
} from '../services/chatService';

export default function CareTeamChat({ 
  user, 
  initialRole = 'TRAINER', 
  isOpen, 
  onClose,
  isFloating = false 
}) {
  const [activeSpecialistRole, setActiveSpecialistRole] = useState(initialRole);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);

  // Derive client & specialist details
  const clientEmail = user?.email || 'aby@example.com';
  const clientName = user?.fullName || 'Aby Thomas';
  const clientGoal = user?.fitnessGoal || 'Muscle Building';

  const assignedTrainer = user?.assignedTrainer || {
    email: 'marcus@example.com',
    name: 'Coach Marcus Vance',
    specialization: 'Hypertrophy & Strength Conditioning'
  };

  const assignedNutritionist = user?.assignedNutritionist || {
    email: 'sruthy@example.com',
    name: 'Sruthy Varghese (M.Sc)',
    qualification: 'M.Sc. Dietetics & Performance Nutrition'
  };

  const currentSpecialist = activeSpecialistRole === 'TRAINER' ? {
    role: 'TRAINER',
    email: assignedTrainer.email || 'marcus@example.com',
    name: assignedTrainer.name || 'Coach Marcus Vance',
    title: 'Certified Master Strength & Conditioning Coach',
    badge: '🏋️ Trainer',
    subtext: assignedTrainer.specialization || 'Hypertrophy & Strength Conditioning',
    themeColor: '#FF7043',
    bgBadge: 'rgba(255, 112, 67, 0.15)',
    avatarBg: 'linear-gradient(135deg, #FF7043, #D84315)'
  } : {
    role: 'NUTRITIONIST',
    email: assignedNutritionist.email || 'sruthy@example.com',
    name: assignedNutritionist.name || 'Sruthy Varghese (M.Sc)',
    title: 'Clinical Sports Nutritionist & Dietitian',
    badge: '🥗 Nutritionist',
    subtext: assignedNutritionist.qualification || 'M.Sc. Dietetics & Performance Nutrition',
    themeColor: '#10B981',
    bgBadge: 'rgba(16, 185, 129, 0.15)',
    avatarBg: 'linear-gradient(135deg, #10B981, #047857)'
  };

  // Quick suggestions based on active specialist
  const trainerQuickPrompts = [
    'Can you review my compound bench press form?',
    'How should I adjust my rest intervals?',
    'Feeling sore in lower back after deadlifts',
    'Best cardio timing with heavy strength training?'
  ];

  const nutritionistQuickPrompts = [
    'What is my optimal daily protein target?',
    'Best post-workout meal ratio for muscle growth?',
    'Healthy high-protein snacks between meals?',
    'How many liters of water should I target daily?'
  ];

  const quickPrompts = activeSpecialistRole === 'TRAINER' ? trainerQuickPrompts : nutritionistQuickPrompts;

  useEffect(() => {
    if (initialRole) {
      setActiveSpecialistRole(initialRole);
    }
  }, [initialRole]);

  useEffect(() => {
    loadMessages();

    // Listen for real-time chat updates
    const handleChatUpdate = () => {
      loadMessages();
    };

    window.addEventListener('smartfit_chat_update', handleChatUpdate);
    return () => {
      window.removeEventListener('smartfit_chat_update', handleChatUpdate);
    };
  }, [clientEmail, currentSpecialist.email, activeSpecialistRole]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const loadMessages = () => {
    const thread = getConversationMessages(clientEmail, currentSpecialist.email);
    setMessages(thread);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (textToSend = null) => {
    const text = typeof textToSend === 'string' ? textToSend : inputText;
    if (!text || !text.trim()) return;

    // Send user message
    const userMsg = sendChatMessage({
      clientEmail,
      specialistEmail: currentSpecialist.email,
      specialistRole: currentSpecialist.role,
      senderEmail: clientEmail,
      senderName: clientName,
      senderRole: 'USER',
      recipientEmail: currentSpecialist.email,
      recipientName: currentSpecialist.name,
      recipientRole: currentSpecialist.role,
      text: text.trim()
    });

    setInputText('');
    loadMessages();

    // Simulate smart real-time reply from specialist
    setIsTyping(true);
    setTimeout(() => {
      const replyText = generateSmartSpecialistReply({
        userMessage: text,
        specialistRole: currentSpecialist.role,
        specialistName: currentSpecialist.name,
        specialistSpecialization: currentSpecialist.subtext,
        clientName,
        clientGoal
      });

      sendChatMessage({
        clientEmail,
        specialistEmail: currentSpecialist.email,
        specialistRole: currentSpecialist.role,
        senderEmail: currentSpecialist.email,
        senderName: currentSpecialist.name,
        senderRole: currentSpecialist.role,
        recipientEmail: clientEmail,
        recipientName: clientName,
        recipientRole: 'USER',
        text: replyText
      });

      setIsTyping(false);
      loadMessages();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div 
      style={isFloating ? {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1100,
        width: isExpanded ? '640px' : '440px',
        maxWidth: '92vw',
        height: isExpanded ? '720px' : '560px',
        maxHeight: '86vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.12)',
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#180614',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      } : {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '16px'
      }}
    >
      <div 
        style={isFloating ? {
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          background: 'linear-gradient(180deg, #22081c 0%, #150311 100%)'
        } : {
          width: '580px',
          maxWidth: '100%',
          height: '680px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '22px',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #22081c 0%, #150311 100%)',
          border: `1px solid ${currentSpecialist.themeColor}55`,
          boxShadow: `0 30px 70px rgba(0,0,0,0.8), 0 0 40px ${currentSpecialist.themeColor}22`
        }}
      >
        {/* ========================================================================= */}
        {/* CHAT HEADER: Tabs & Specialist Profile */}
        {/* ========================================================================= */}
        <div style={{
          padding: '16px 20px 14px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(255, 255, 255, 0.03)'
        }}>
          {/* Top action row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: currentSpecialist.avatarBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                fontWeight: 800,
                fontSize: '0.9rem',
                boxShadow: `0 4px 12px ${currentSpecialist.themeColor}44`
              }}>
                {activeSpecialistRole === 'TRAINER' ? <Dumbbell size={16} /> : <Utensils size={16} />}
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: '#FFF', margin: 0, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Care Team Live Desk
                  <span style={{ fontSize: '0.7rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399', display: 'inline-block' }} /> Online
                  </span>
                </h3>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isFloating && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '8px', padding: '6px', color: '#CBD5E1', cursor: 'pointer' }}
                  title={isExpanded ? 'Collapse view' : 'Expand view'}
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              )}
              <button 
                onClick={onClose}
                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '8px', padding: '6px', color: '#CBD5E1', cursor: 'pointer' }}
                title="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Specialist Switcher Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            background: 'rgba(0, 0, 0, 0.35)',
            padding: '4px',
            borderRadius: '12px'
          }}>
            <button
              onClick={() => setActiveSpecialistRole('TRAINER')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeSpecialistRole === 'TRAINER' ? 'rgba(255, 112, 67, 0.25)' : 'transparent',
                color: activeSpecialistRole === 'TRAINER' ? '#FFB8A1' : '#94A3B8',
                fontWeight: activeSpecialistRole === 'TRAINER' ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: '0.2s',
                outline: activeSpecialistRole === 'TRAINER' ? '1px solid rgba(255, 112, 67, 0.4)' : 'none'
              }}
            >
              <Dumbbell size={15} color={activeSpecialistRole === 'TRAINER' ? '#FF7043' : '#94A3B8'} />
              <span>Trainer Marcus</span>
            </button>

            <button
              onClick={() => setActiveSpecialistRole('NUTRITIONIST')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeSpecialistRole === 'NUTRITIONIST' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                color: activeSpecialistRole === 'NUTRITIONIST' ? '#A7F3D0' : '#94A3B8',
                fontWeight: activeSpecialistRole === 'NUTRITIONIST' ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: '0.2s',
                outline: activeSpecialistRole === 'NUTRITIONIST' ? '1px solid rgba(16, 185, 129, 0.4)' : 'none'
              }}
            >
              <Utensils size={15} color={activeSpecialistRole === 'NUTRITIONIST' ? '#10B981' : '#94A3B8'} />
              <span>Dietitian Sruthy</span>
            </button>
          </div>

          {/* Active Specialist Micro-Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '10px',
            fontSize: '0.78rem',
            color: '#B392A5'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color={currentSpecialist.themeColor} />
              <span style={{ fontWeight: 600, color: '#FFF' }}>{currentSpecialist.name}</span>
              <span style={{ opacity: 0.6 }}>•</span>
              <span style={{ color: currentSpecialist.themeColor, fontWeight: 600 }}>{currentSpecialist.subtext}</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#4ADE80', fontWeight: 600 }}>Active Direct Link</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MESSAGES BODY */}
        {/* ========================================================================= */}
        <div style={{
          flex: 1,
          padding: '16px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {/* Welcome Info Box */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
            padding: '12px 14px',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-subtle)'
          }}>
            <div style={{ fontWeight: 700, color: '#FFF', marginBottom: '2px' }}>
              Direct Chat with {currentSpecialist.name}
            </div>
            Ask questions about workout technique, rest days, macro adjustments, or share session updates.
          </div>

          {/* Messages list */}
          {messages.map((msg) => {
            const isMe = msg.senderRole === 'USER' || msg.senderEmail?.toLowerCase() === clientEmail.toLowerCase();
            return (
              <div 
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '8px',
                  maxWidth: '82%'
                }}>
                  {!isMe && (
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: currentSpecialist.avatarBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFF',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {activeSpecialistRole === 'TRAINER' ? 'MV' : 'SV'}
                    </div>
                  )}

                  <div style={{
                    background: isMe 
                      ? 'linear-gradient(135deg, #FF7043, #E64A19)' 
                      : 'rgba(255, 255, 255, 0.07)',
                    color: isMe ? '#FFF' : '#F1F5F9',
                    padding: '10px 14px',
                    borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    border: isMe ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.88rem',
                    lineHeight: 1.45,
                    wordBreak: 'break-word',
                    boxShadow: isMe ? '0 4px 14px rgba(255, 112, 67, 0.3)' : '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    {!isMe && (
                      <div style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: currentSpecialist.themeColor,
                        marginBottom: '4px'
                      }}>
                        {msg.senderName}
                      </div>
                    )}
                    {msg.text}
                  </div>
                </div>

                <span style={{
                  fontSize: '0.68rem',
                  color: '#64748B',
                  marginTop: '4px',
                  paddingLeft: isMe ? '0' : '36px',
                  paddingRight: isMe ? '4px' : '0'
                }}>
                  {msg.timestamp}
                </span>
              </div>
            );
          })}

          {/* Specialist Typing Indicator */}
          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: currentSpecialist.avatarBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                fontSize: '0.72rem',
                fontWeight: 800
              }}>
                {activeSpecialistRole === 'TRAINER' ? 'MV' : 'SV'}
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '8px 14px',
                borderRadius: '16px 16px 16px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ fontSize: '0.75rem', color: currentSpecialist.themeColor, fontWeight: 600 }}>
                  {currentSpecialist.name} is typing
                </span>
                <span className="dot-flashing" style={{ display: 'inline-flex', gap: '2px' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: currentSpecialist.themeColor, animation: 'pulse 1s infinite' }} />
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: currentSpecialist.themeColor, animation: 'pulse 1s infinite 0.2s' }} />
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: currentSpecialist.themeColor, animation: 'pulse 1s infinite 0.4s' }} />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ========================================================================= */}
        {/* QUICK SUGGESTIONS CAROUSEL */}
        {/* ========================================================================= */}
        <div style={{
          padding: '8px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none'
        }}>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              style={{
                fontSize: '0.74rem',
                padding: '5px 10px',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#CBD5E1',
                cursor: 'pointer',
                flexShrink: 0,
                transition: '0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = currentSpecialist.bgBadge;
                e.currentTarget.style.color = currentSpecialist.themeColor;
                e.currentTarget.style.borderColor = currentSpecialist.themeColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.color = '#CBD5E1';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              💬 {prompt}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* INPUT FORM */}
        {/* ========================================================================= */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          style={{
            padding: '14px 16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <input
            type="text"
            placeholder={`Message ${currentSpecialist.name}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFF',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: inputText.trim() 
                ? (activeSpecialistRole === 'TRAINER' ? 'linear-gradient(135deg, #FF7043, #E64A19)' : 'linear-gradient(135deg, #10B981, #047857)')
                : 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputText.trim() ? 'pointer' : 'not-allowed',
              transition: '0.2s',
              boxShadow: inputText.trim() ? `0 4px 14px ${currentSpecialist.themeColor}55` : 'none',
              flexShrink: 0
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
