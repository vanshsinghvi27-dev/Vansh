/**
 * AI Agent - Gemini 2.5 Pro
 */

const AI_CONFIG = {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    model: 'gemini-2.5-flash-lite',
    systemPrompt: `You are the AI assistant on Vansh Singhvi's portfolio website. You represent Vansh and speak on his behalf.

ABOUT VANSH SINGHVI:
- Premium SaaS video creator and motion designer
- Specializes in creating cinematic video content for startups and tech companies
- Has delivered 50+ projects for clients worldwide
- His work has helped clients raise over $40M in funding combined
- Achieves an average 3x conversion lift for client videos
- Known for obsessive attention to detail and Apple-like premium aesthetics

SERVICES OFFERED:
1. Product Demos - Showcase products with clarity and cinematic style
2. Launch Videos - Build anticipation for product releases
3. Motion Design - Fluid animations and visual storytelling
4. Brand Stories - Emotional narratives that connect with audiences
5. Explainer Videos - Make complex concepts simple and engaging
6. SaaS Content - Specialized content for software companies

WORKING WITH VANSH:
- Typical project timeline: 2-4 weeks
- Process: Discovery → Concept → Production → Delivery
- Works with startups from seed to Series C
- Prefers quality over quantity - takes on select projects
- Contact: Through the contact form or email

YOUR BEHAVIOR:
- Be friendly, professional, and concise
- If asked about pricing, say it depends on project scope and suggest they reach out
- Encourage visitors to explore the portfolio and get in touch
- Keep responses under 3 sentences when possible
- Be enthusiastic but not salesy`
};

const aiToggle = document.getElementById('aiToggle');
const aiChat = document.getElementById('aiChat');
const aiClose = document.getElementById('aiClose');
const aiMessages = document.getElementById('aiMessages');
const aiInput = document.getElementById('aiInput');
const aiSend = document.getElementById('aiSend');

let conversationHistory = [];
let isTyping = false;

if (aiToggle && aiChat) {
    aiToggle.addEventListener('click', toggleChat);
    aiClose.addEventListener('click', closeChat);
    aiSend.addEventListener('click', sendMessage);
    aiInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });
    document.addEventListener('click', e => {
        if (aiChat.classList.contains('active') && !aiChat.contains(e.target) && !aiToggle.contains(e.target)) closeChat();
    });
}

function toggleChat() { aiChat.classList.contains('active') ? closeChat() : openChat(); }
function openChat() { aiChat.classList.add('active'); setTimeout(() => aiInput.focus(), 300); }
function closeChat() { aiChat.classList.remove('active'); }

async function sendMessage() {
    const message = aiInput.value.trim();
    if (!message || isTyping) return;
    isTyping = true;
    addMessage(message, 'user');
    aiInput.value = '';
    const typing = showTyping();

    try {
        if (!AI_CONFIG.apiKey) throw new Error('Add your Gemini API key in ai-agent.js line 7');
        const response = await callGemini(message);
        typing.remove();
        addMessage(response, 'bot');
    } catch (error) {
        typing.remove();
        addMessage(`Error: ${error.message}`, 'bot error');
    }
    isTyping = false;
}

function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `ai-message ${type}`;
    div.innerHTML = `<p>${text}</p>`;
    aiMessages.appendChild(div);
    aiMessages.scrollTop = aiMessages.scrollHeight;
    if (type === 'user') conversationHistory.push({ role: 'user', parts: [{ text }] });
}

function showTyping() {
    const div = document.createElement('div');
    div.className = 'ai-message bot typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    aiMessages.appendChild(div);
    aiMessages.scrollTop = aiMessages.scrollHeight;
    return div;
}

async function callGemini(userMessage) {
    const context = conversationHistory.slice(-6).map(m => `${m.role}: ${m.parts[0].text}`).join('\n');
    const prompt = AI_CONFIG.systemPrompt + (context ? `\n\nRecent:\n${context}\n\n` : '\n\n') + `User: ${userMessage}`;

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${AI_CONFIG.model}:generateContent?key=${AI_CONFIG.apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
            })
        }
    );

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `API Error: ${res.status}`);
    }

    const data = await res.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) throw new Error('Empty response');

    const reply = data.candidates[0].content.parts[0].text;
    conversationHistory.push({ role: 'model', parts: [{ text: reply }] });
    return reply;
}
