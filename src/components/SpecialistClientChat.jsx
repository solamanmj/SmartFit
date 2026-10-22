import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, CheckCircle2, User, Clock, 
  Sparkles, ShieldCheck, Dumbbell, Utensils, RefreshCw,
  HelpCircle, AlertCircle, Flame, HeartHandshake, Zap
} from 'lucide-react';
import { 
  getConversationMessages, 
  sendChatMessage,
  syncConversationWithBackend
} from '../services/chatService';

export default function SpecialistClientChat({
  specialistUser, // The logged-in Trainer or Nutritionist
  client,         // The selected client object { fullName, email, fitnessGoal, etc. }
  specialistRole  // 'TRAINER' | 'NUTRITIONIST'
}) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const messagesEndRef = useRef(null);

  const isTrainer = specialistRole === 'TRAINER';
  const specialistEmail = specialistUser?.email || (isTrainer ? 'marcus@example.com' : 'sruthy@example.com');
  const specialistName = specialistUser?.fullName || (isTrainer ? 'Coach Marcus Vance' : 'Sruthy Varghese (M.Sc)');
  const clientEmail = client?.email || 'aby@example.com';
  const clientName = client?.fullName || 'Aby Thomas';

  const themeColor = isTrainer ? '#FF7043' : '#10B981';
  const bgBadge = isTrainer ? 'rgba(255, 112, 67, 0.15)' : 'rgba(16, 185, 129, 0.15)';

  // Quick trainer response templates categorized by common client concerns
  const trainerConcernTemplates = [
    {
      category: 'form',
      label: '🏋️ Form & Technique',
      text: 'Great form question! Remember to brace your core with diaphragmatic breathing, keep your spine neutral, and control the 3-second eccentric (lowering) tempo on compound movements.'
    },
    {
      category: 'split',
      label: '📅 Workout Split Guidance',
      text: 'I have calibrated and prescribed your customized weekly workout split in your dashboard! Follow the prescribed daily muscle group focus and stay consistent with the target session durations.'
    },
    {
      category: 'soreness',
      label: '🩹 Soreness & DOMS',
      text: 'Muscle soreness (DOMS) is completely normal with new training intensities. Prioritize 8+ hours of sleep, light active recovery (20m walk), and 3.5L hydration with electrolytes.'
    },
    {
      category: 'rest',
      label: '⏱️ Rest & Intervals',
      text: 'For your strength and hypertrophy goals, maintain 90-120 seconds rest between heavy compound lifts (squat, bench, deadlift) and 60 seconds on isolation accessories.'
    },
    {
      category: 'cardio',
      label: '🏃 Cardio Timing',
      text: 'Perform your cardio intervals either after your lifting session or on dedicated active recovery days to keep your muscle power output at maximum peak during lifts.'
    },
    {
      category: 'motivation',
      label: '🔥 Motivation & Consistency',
      text: 'Outstanding adherence this week! Trust the process, track your weekly progressive overload, and keep showing up. You are making real measurable progress!'
    }
  ];

  const nutritionistTemplates = [
    {
      category: 'allergy',
      label: '🚫 Allergy & Substitutions',
      text: 'I have reviewed your restricted food profile. Always substitute confirmed allergens with high-biological-value alternatives (e.g. Organic Tofu or Lentils for dairy/eggs) and verify allergen labels.'
    },
    {
      category: 'flares',
      label: '⚡ Food Flare & Sensitivity',
      text: 'For reported food sensitivity or skin flares, let us initiate a temporary 14-day elimination trial for that specific item. Please log your daily symptoms in the Symptom Diary so I can track your recovery.'
    },
    {
      category: 'protein',
      label: '🥩 Protein Targets',
      text: 'Your daily protein target is calibrated at 1.8g to 2.2g per kg of bodyweight. Distribute this across 3-4 feedings (30-45g per meal) to maintain continuous muscle protein synthesis.'
    },
    {
      category: 'carbs',
      label: '🍠 Pre/Post Workout Fuel',
      text: 'Incorporate 40-60g of complex low-GI carbohydrates (sweet potato, oats, or quinoa) in your pre-workout meal 90 minutes before training for sustained glycogen output.'
    },
    {
      category: 'water',
      label: '💧 Hydration & Electrolytes',
      text: 'Maintain at least 3.5 Liters of water daily, especially on heavy training days. Drink 500ml upon waking and another 500ml during your workout session.'
    },
    {
      category: 'meals',
      label: '🥗 30-Day Protocol',
      text: 'I have updated and verified your 30-day nutrition protocol in your dashboard. Stick to the prescribed whole food ingredients for optimal metabolic flexibility!'
    }
  ];

  const concernTemplates = isTrainer ? trainerConcernTemplates : nutritionistTemplates;

  const filteredTemplates = activeCategory === 'all' 
    ? concernTemplates 
    : concernTemplates.filter(t => t.category === activeCategory);

  useEffect(() => {
    loadMessages();

    const handleChatUpdate = () => {
      loadMessages();
    };

    window.addEventListener('smartfit_chat_update', handleChatUpdate);
    return () => {
      window.removeEventListener('smartfit_chat_update', handleChatUpdate);
    };
  }, [clientEmail, specialistEmail]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    if (!clientEmail || !specialistEmail) return;
    const thread = getConversationMessages(clientEmail, specialistEmail);
    setMessages(thread);

    // Sync with MongoDB backend
    try {
      const synced = await syncConversationWithBackend(clientEmail, specialistEmail, specialistRole);
      if (Array.isArray(synced) && synced.length > 0) {
        setMessages(synced);
      }
    } catch (e) {}
  };

  const handleSendMessage = (textToSend = null) => {
    const text = typeof textToSend === 'string' ? textToSend : inputText;
    if (!text || !text.trim()) return;

    sendChatMessage({
      clientEmail,
      specialistEmail,
      specialistRole,
      senderEmail: specialistEmail,
      senderName: specialistName,
      senderRole: specialistRole,
      recipientEmail: clientEmail,
      recipientName: clientName,
      recipientRole: 'USER',
      text: text.trim()
    });

    setInputText('');
    loadMessages();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '660px',
      background: 'rgba(18, 24, 38, 0.95)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      overflow: 'hidden',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 22px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: isTrainer ? 'linear-gradient(135deg, #FF7043, #D84315)' : 'linear-gradient(135deg, #10B981, #047857)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            fontWeight: 800,
            fontSize: '1rem',
            boxShadow: `0 4px 15px ${themeColor}44`
          }}>
            {clientName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, color: '#FFF', fontSize: '1.1rem', fontWeight: 800 }}>
                {clientName}
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, backgroundColor: 'rgba(52,211,153,0.12)', padding: '2px 8px', borderRadius: '10px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399', display: 'inline-block' }} /> Live Consultation
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
              {client.email} • 🎯 <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{client.fitnessGoal || 'General Fitness'}</span> • ⚖️ {client.weight || 75} kg
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={loadMessages}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '7px 14px',
              color: '#CBD5E1',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: '0.2s'
            }}
          >
            <RefreshCw size={14} /> Refresh Chat
          </button>
        </div>
      </div>

      {/* Concern Resolver Quick Filters Banner */}
      <div style={{
        background: 'rgba(255, 112, 67, 0.04)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none'
      }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: themeColor, display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <HeartHandshake size={14} /> Clear Client Concerns:
        </span>
        <button
          onClick={() => setActiveCategory('all')}
          style={{
            fontSize: '0.72rem',
            padding: '4px 10px',
            borderRadius: '12px',
            background: activeCategory === 'all' ? themeColor : 'rgba(255, 255, 255, 0.04)',
            color: activeCategory === 'all' ? '#FFF' : '#CBD5E1',
            border: activeCategory === 'all' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
            cursor: 'pointer',
            fontWeight: 600
          }}>
          All Presets
        </button>
        {concernTemplates.map(tpl => (
          <button
            key={tpl.category}
            onClick={() => setActiveCategory(tpl.category)}
            style={{
              fontSize: '0.72rem',
              padding: '4px 10px',
              borderRadius: '12px',
              background: activeCategory === tpl.category ? themeColor : 'rgba(255, 255, 255, 0.04)',
              color: activeCategory === tpl.category ? '#FFF' : '#CBD5E1',
              border: activeCategory === tpl.category ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
              cursor: 'pointer',
              fontWeight: 600
            }}>
            {tpl.label}
          </button>
        ))}
      </div>

      {/* Messages Thread */}
      <div style={{
        flex: 1,
        padding: '18px 22px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        background: 'radial-gradient(ellipse at top, rgba(26, 34, 51, 0.4) 0%, rgba(11, 15, 23, 0.8) 100%)'
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#94A3B8', fontSize: '0.9rem' }}>
            <MessageSquare size={38} style={{ color: themeColor, margin: '0 auto 12px auto', opacity: 0.7 }} />
            <p style={{ margin: '0 0 6px 0', color: '#FFF', fontWeight: 800, fontSize: '1.05rem' }}>
              Direct Coach Communication Desk with {clientName}
            </p>
            <p style={{ margin: '0 auto', maxWidth: '420px', lineHeight: 1.5, fontSize: '0.85rem' }}>
              Address questions about the prescribed workout split, guide lifting form, advise on rest days, and clear any training doubts.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSpecialist = msg.senderRole === specialistRole || msg.senderEmail?.toLowerCase() === specialistEmail.toLowerCase();
            return (
              <div 
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isSpecialist ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '82%',
                  background: isSpecialist
                    ? (isTrainer ? 'linear-gradient(135deg, #FF7043, #E64A19)' : 'linear-gradient(135deg, #10B981, #047857)')
                    : 'rgba(255, 255, 255, 0.06)',
                  color: '#FFF',
                  padding: '12px 16px',
                  borderRadius: isSpecialist ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  boxShadow: isSpecialist ? `0 4px 16px ${themeColor}44` : 'none',
                  border: isSpecialist ? 'none' : '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  {!isSpecialist && (
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38BDF8', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span>👤 {msg.senderName || clientName} (Client Concern)</span>
                    </div>
                  )}
                  {msg.text}
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '4px', padding: '0 4px' }}>
                  {msg.timestamp}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Coach Resolution Reply Buttons */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'rgba(0, 0, 0, 0.25)',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none'
      }}>
        {filteredTemplates.map((tpl, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(tpl.text)}
            style={{
              fontSize: '0.75rem',
              padding: '6px 12px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#CBD5E1',
              cursor: 'pointer',
              flexShrink: 0,
              transition: '0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = bgBadge;
              e.currentTarget.style.color = themeColor;
              e.currentTarget.style.borderColor = themeColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.color = '#CBD5E1';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <span>⚡ {tpl.label}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
        style={{
          padding: '14px 18px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.45)',
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}
      >
        <input
          type="text"
          placeholder={`Type coach response to clear ${clientName}'s concerns or doubts...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#FFF',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          style={{
            padding: '12px 22px',
            borderRadius: '14px',
            background: inputText.trim() 
              ? (isTrainer ? 'linear-gradient(135deg, #FF7043, #E64A19)' : 'linear-gradient(135deg, #10B981, #047857)')
              : 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#FFF',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: inputText.trim() ? 'pointer' : 'not-allowed',
            boxShadow: inputText.trim() ? `0 4px 15px ${themeColor}55` : 'none',
            transition: '0.2s'
          }}
        >
          <Send size={16} /> Send Advice
        </button>
      </form>
    </div>
  );
}
