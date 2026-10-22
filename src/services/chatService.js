// SmartFit Care Team Real-Time Messaging & Chat Service
// Supports Cross-Tab BroadcastChannel & Reactive DOM Event Bus

const STORAGE_KEY = 'smartfit_chat_threads_v1';
const READ_STATE_KEY = 'smartfit_chat_read_state_v1';

const INITIAL_MESSAGES = [
  // Aby Thomas <-> Coach Marcus Vance (Trainer)
  {
    id: 'msg-1',
    clientEmail: 'aby@example.com',
    specialistEmail: 'marcus@example.com',
    specialistRole: 'TRAINER',
    senderEmail: 'marcus@example.com',
    senderName: 'Coach Marcus Vance',
    senderRole: 'TRAINER',
    text: 'Hey Aby! I reviewed your bench press and squat logs from this week. Your progressive overload tempo on the 82.5kg bench is looking solid.',
    timestamp: 'Yesterday, 10:15 AM',
    rawTime: Date.now() - 86400000
  },
  {
    id: 'msg-2',
    clientEmail: 'aby@example.com',
    specialistEmail: 'marcus@example.com',
    specialistRole: 'TRAINER',
    senderEmail: 'aby@example.com',
    senderName: 'Aby Thomas',
    senderRole: 'USER',
    text: 'Thanks Coach! Should I keep the 90s rest interval between sets or increase it to 2 minutes on compound lifts?',
    timestamp: 'Yesterday, 10:45 AM',
    rawTime: Date.now() - 85000000
  },
  {
    id: 'msg-3',
    clientEmail: 'aby@example.com',
    specialistEmail: 'marcus@example.com',
    specialistRole: 'TRAINER',
    senderEmail: 'marcus@example.com',
    senderName: 'Coach Marcus Vance',
    senderRole: 'TRAINER',
    text: 'Keep 120s on your heavy barbell compounds (squat & bench) to maximize ATP recovery, and 60-75s on isolation accessory work like cable lateral raises and rope pushdowns.',
    timestamp: 'Yesterday, 11:02 AM',
    rawTime: Date.now() - 84000000
  },

  // Aby Thomas <-> Sruthy Varghese (Nutritionist)
  {
    id: 'msg-4',
    clientEmail: 'aby@example.com',
    specialistEmail: 'sruthy@example.com',
    specialistRole: 'NUTRITIONIST',
    senderEmail: 'sruthy@example.com',
    senderName: 'Sruthy Varghese (M.Sc)',
    senderRole: 'NUTRITIONIST',
    text: 'Hello Aby! Your daily protein intake logged at 155g yesterday, which is right in our target hypertrophy window (150-165g). Great job!',
    timestamp: '2 days ago, 02:30 PM',
    rawTime: Date.now() - 172800000
  },
  {
    id: 'msg-5',
    clientEmail: 'aby@example.com',
    specialistEmail: 'sruthy@example.com',
    specialistRole: 'NUTRITIONIST',
    senderEmail: 'aby@example.com',
    senderName: 'Aby Thomas',
    senderRole: 'USER',
    text: 'Hi Sruthy! What is the best post-workout carb to protein ratio if I train in the evening around 7 PM?',
    timestamp: '2 days ago, 03:10 PM',
    rawTime: Date.now() - 170000000
  },
  {
    id: 'msg-6',
    clientEmail: 'aby@example.com',
    specialistEmail: 'sruthy@example.com',
    specialistRole: 'NUTRITIONIST',
    senderEmail: 'sruthy@example.com',
    senderName: 'Sruthy Varghese (M.Sc)',
    senderRole: 'NUTRITIONIST',
    text: 'Aim for roughly a 2:1 or 3:1 Carb-to-Protein ratio within 45 mins. For example, 35g protein with 70g complex carbs like sweet potato or jasmine rice. It promotes optimal glycogen replenishment before bedtime.',
    timestamp: '2 days ago, 03:25 PM',
    rawTime: Date.now() - 169000000
  },

  // Alex Morgan <-> Coach Sarah Jenkins (Trainer)
  {
    id: 'msg-7',
    clientEmail: 'alex@example.com',
    specialistEmail: 'sarah@example.com',
    specialistRole: 'TRAINER',
    senderEmail: 'alex@example.com',
    senderName: 'Alex Morgan',
    senderRole: 'USER',
    text: 'Coach, I have slight lower back tightness today after deadlifts. Should I do active recovery or replace tomorrow with upper body?',
    timestamp: 'Today, 08:30 AM',
    rawTime: Date.now() - 7200000
  },

  // Alex Morgan <-> Dr. Elena Rostova (Nutritionist)
  {
    id: 'msg-8',
    clientEmail: 'alex@example.com',
    specialistEmail: 'elena@example.com',
    specialistRole: 'NUTRITIONIST',
    senderEmail: 'elena@example.com',
    senderName: 'Dr. Elena Rostova (Ph.D)',
    senderRole: 'NUTRITIONIST',
    text: 'Alex, your metabolic recovery markers look great. Remember to maintain 3.5L hydration on heavy lifting days.',
    timestamp: 'Yesterday, 01:15 PM',
    rawTime: Date.now() - 80000000
  }
];

// Initialize BroadcastChannel if supported
let broadcastChannel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('smartfit_live_chat_channel');
    broadcastChannel.onmessage = (event) => {
      if (event.data?.type === 'chat_update') {
        window.dispatchEvent(new CustomEvent('smartfit_chat_update', { detail: event.data.payload }));
      }
    };
  } catch (e) {
    console.warn('BroadcastChannel initialization note:', e);
  }
}

// Helper to load all messages
export function loadAllMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MESSAGES));
      return INITIAL_MESSAGES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MESSAGES));
      return INITIAL_MESSAGES;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to parse chat messages:', err);
    return INITIAL_MESSAGES;
  }
}

// Get messages for a specific conversation pair (Client <-> Specialist)
export function getConversationMessages(clientEmail, specialistEmail) {
  if (!clientEmail || !specialistEmail) return [];
  const cEmail = clientEmail.trim().toLowerCase();
  const sEmail = specialistEmail.trim().toLowerCase();

  const all = loadAllMessages();
  return all.filter(m => 
    (m.clientEmail?.toLowerCase() === cEmail && m.specialistEmail?.toLowerCase() === sEmail) ||
    ((m.senderEmail?.toLowerCase() === cEmail && m.recipientEmail?.toLowerCase() === sEmail) ||
     (m.senderEmail?.toLowerCase() === sEmail && m.recipientEmail?.toLowerCase() === cEmail))
  ).sort((a, b) => (a.rawTime || 0) - (b.rawTime || 0));
}

// Asynchronously sync conversation with backend MongoDB
export async function syncConversationWithBackend(clientEmail, specialistEmail, userRole = 'NUTRITIONIST') {
  if (!clientEmail || !specialistEmail) return getConversationMessages(clientEmail, specialistEmail);
  const cEmail = clientEmail.trim().toLowerCase();
  const sEmail = specialistEmail.trim().toLowerCase();

  try {
    const API_BASE_URL = 'http://localhost:8081/api';
    let url = '';
    if (userRole === 'NUTRITIONIST') {
      url = `${API_BASE_URL}/nutritionist/chat/conversation/${encodeURIComponent(cEmail)}?email=${encodeURIComponent(sEmail)}`;
    } else {
      url = `${API_BASE_URL}/users/chat/specialist?email=${encodeURIComponent(cEmail)}&role=${encodeURIComponent(userRole)}`;
    }

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const backendMsgs = Array.isArray(data) ? data : (data.messages || []);
      if (backendMsgs.length > 0) {
        const all = loadAllMessages();
        const existingIds = new Set(all.map(m => m.id));
        let changed = false;

        backendMsgs.forEach(bm => {
          if (!existingIds.has(bm.id)) {
            all.push(bm);
            existingIds.add(bm.id);
            changed = true;
          }
        });

        if (changed) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
          window.dispatchEvent(new CustomEvent('smartfit_chat_update', { detail: backendMsgs[backendMsgs.length - 1] }));
        }
      }
    }
  } catch (err) {
    console.log('[INFO] Chat backend sync notice:', err.message);
  }

  return getConversationMessages(cEmail, sEmail);
}

// Get the latest message snippet and timestamp for a client thread
export function getClientThreadSummary(clientEmail, specialistEmail) {
  const msgs = getConversationMessages(clientEmail, specialistEmail);
  if (!msgs || msgs.length === 0) {
    return {
      lastMessage: null,
      lastText: 'No messages yet. Start consultation.',
      timestamp: '',
      hasUnread: false,
      unreadCount: 0
    };
  }

  const last = msgs[msgs.length - 1];
  const isFromUser = last.senderRole === 'USER' || last.senderEmail?.toLowerCase() === clientEmail?.toLowerCase();

  return {
    lastMessage: last,
    lastText: last.text,
    timestamp: last.timestamp,
    isFromClient: isFromUser,
    hasUnread: isFromUser,
    unreadCount: isFromUser ? 1 : 0
  };
}

// Send a new message (saves locally + dispatches event + persists to backend)
export function sendChatMessage({
  clientEmail,
  specialistEmail,
  specialistRole,
  senderEmail,
  senderName,
  senderRole,
  recipientEmail,
  recipientName,
  recipientRole,
  text
}) {
  const all = loadAllMessages();
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timestamp = `Today, ${timeString}`;
  const mutationId = `mut-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

  const newMsg = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    clientMutationId: mutationId,
    clientEmail: (clientEmail || senderEmail).trim().toLowerCase(),
    specialistEmail: (specialistEmail || recipientEmail).trim().toLowerCase(),
    specialistRole: specialistRole || (senderRole === 'USER' ? recipientRole : senderRole) || 'NUTRITIONIST',
    senderEmail: senderEmail.trim().toLowerCase(),
    senderName: senderName || 'User',
    senderRole: senderRole || 'USER',
    recipientEmail: (recipientEmail || specialistEmail).trim().toLowerCase(),
    recipientName: recipientName || 'Care Specialist',
    recipientRole: recipientRole || specialistRole || 'NUTRITIONIST',
    text: text.trim(),
    timestamp,
    rawTime: Date.now()
  };

  all.push(newMsg);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

  // Dispatch custom event for real-time reactive sync across local components
  window.dispatchEvent(new CustomEvent('smartfit_chat_update', { detail: newMsg }));

  // Broadcast to other open browser tabs/windows
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: 'chat_update', payload: newMsg });
    } catch (e) {}
  }

  // Asynchronously persist to backend API
  (async () => {
    try {
      const API_BASE_URL = 'http://localhost:8081/api';
      const isNutriSender = (senderRole || '').toUpperCase() === 'NUTRITIONIST';
      const endpoint = isNutriSender ? `${API_BASE_URL}/nutritionist/chat/messages` : `${API_BASE_URL}/users/chat/messages`;
      
      const payload = isNutriSender ? {
        clientEmail: newMsg.clientEmail,
        text: newMsg.text,
        clientMutationId: mutationId
      } : {
        clientEmail: newMsg.clientEmail,
        specialistRole: newMsg.specialistRole,
        text: newMsg.text,
        clientMutationId: mutationId
      };

      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.log('[INFO] Chat backend async persistence note:', e.message);
    }
  })();

  return newMsg;
}

// Intelligent contextual auto-reply generator for Trainer & Nutritionist
export function generateSmartSpecialistReply({
  userMessage,
  specialistRole,
  specialistName,
  specialistSpecialization,
  clientName,
  clientGoal
}) {
  const text = userMessage.toLowerCase();
  const isTrainer = specialistRole === 'TRAINER';

  if (isTrainer) {
    if (text.includes('sore') || text.includes('pain') || text.includes('fatigue') || text.includes('tight') || text.includes('back') || text.includes('knee')) {
      return `Hi ${clientName || 'there'}! Thanks for alerting me. For localized tightness or soreness, shift today's focus to gentle active mobility (cat-cow, foam rolling, 20m light walk) and avoid axial loading. If the sensation is sharp, pause that exercise immediately and let's substitute it with a supported movement!`;
    }
    if (text.includes('form') || text.includes('check') || text.includes('squat') || text.includes('bench') || text.includes('deadlift')) {
      return `Great question on lifting technique! On compound lifts, always brace your core before descending, keep your spine neutral, and control the 3-second eccentric phase. Feel free to log your sets in the Dashboard and I'll calibrate your target weights!`;
    }
    if (text.includes('rest') || text.includes('interval') || text.includes('sets') || text.includes('reps')) {
      return `For your goal of ${clientGoal || 'Muscle Building & Strength'}, I recommend keeping compound rest intervals between 90-120 seconds and isolation movements between 60-75 seconds. This allows full ATP replenishment between sets.`;
    }
    if (text.includes('cardio') || text.includes('hiit') || text.includes('treadmill') || text.includes('run')) {
      return `For cardio integration with your strength routine, do your high-intensity intervals (HIIT) on separate days or after your lifting session to keep your power output fresh. 2-3 sessions of 20 mins weekly is ideal!`;
    }
    return `Thanks for the update, ${clientName || 'champ'}! I've reviewed your latest training session on SmartFit. Keep pushing progressive overload with strict form, and remember to log your workout rating so I can adjust your split for next week!`;
  } else {
    // Nutritionist Role
    if (text.includes('protein') || text.includes('shake') || text.includes('whey') || text.includes('powder')) {
      return `Hi ${clientName || 'there'}! For your body weight and goal of ${clientGoal || 'muscle & metabolic conditioning'}, aim for 1.8g to 2.2g of protein per kg of bodyweight daily. Distribute this across 3-4 meals (roughly 30-45g per meal) to optimize muscle protein synthesis.`;
    }
    if (text.includes('carb') || text.includes('keto') || text.includes('rice') || text.includes('oat') || text.includes('calorie')) {
      return `Carbohydrates are your primary anaerobic fuel! Focus on slow-digesting complex carbs (sweet potato, oats, quinoa, brown rice) around your workout windows, and prioritize leafy fibrous vegetables in the evening.`;
    }
    if (text.includes('water') || text.includes('hydration') || text.includes('drink')) {
      return `Hydration is critical for cellular energy and nutrient transport. We are targeting 3.0 to 3.5 Liters of water daily. Try drinking 500ml right when you wake up and 500ml during your training session!`;
    }
    return `Hello ${clientName || 'there'}! I've checked your daily nutrition checklist on your dashboard. Your macro breakdown is tracking in the right direction. Keep logging your daily meals and hydration so we can maintain peak metabolic efficiency!`;
  }
}
