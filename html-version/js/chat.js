let admissionData = null;

async function loadAdmissionData() {
  try {
    const response = await fetch('./data/admissionData.json');
    admissionData = await response.json();
  } catch (error) {
    console.error('Failed to load admission data:', error);
  }
}

function getLocalAdmissionReply(query) {
  if (!admissionData) return null;
  const q = query.toLowerCase();
  const hasAny = (keywords) => keywords.some((k) => q.includes(k));

  if (hasAny(["procedure", "process", "how to apply", "application", "admission steps"])) {
    return `### Admission Procedure - ${admissionData.university}\n\n- **Mode:** ${admissionData.admission.mode}\n- **Application Window:** ${admissionData.admission.start_date} to ${admissionData.admission.end_date}\n\n#### Step-by-step process\n1. Register on the admission portal.\n2. Fill academic and personal details.\n3. Upload required documents.\n4. Pay the application fee.\n5. Submit application and track status.\n6. Attend counseling/verification if shortlisted.\n\n#### Required documents\n- 10th and 12th marksheets\n- Transfer certificate\n- Government photo ID\n- Passport-size photographs\n- Category certificate (if applicable)\n- Entrance scorecard (if applicable)\n\nFor help, contact **${admissionData.contact.email}** or **${admissionData.contact.phone}**.`;
  }

  if (hasAny(["deadline", "last date", "admission date", "start date", "when do admissions start"])) {
    return `### Admission Dates\n\n- **Start Date:** ${admissionData.admission.start_date}\n- **End Date:** ${admissionData.admission.end_date}\n- **Mode:** ${admissionData.admission.mode}`;
  }

  if (hasAny(["documents", "document required", "certificates"])) {
    return `### Required Documents\n\n- 10th and 12th marksheets\n- Transfer certificate\n- Government photo ID\n- Passport-size photographs\n- Category certificate (if applicable)\n- Entrance scorecard (if applicable)`;
  }

  if (hasAny(["course", "program", "programs available"])) {
    const courseLines = admissionData.courses.map(c => `- **${c.name}** (${c.duration})`).join('\n');
    return `### Available Courses\n\n${courseLines}`;
  }

  if (hasAny(["fee", "fees", "cost", "tuition"])) {
    const feeLines = admissionData.courses.map(c => `- **${c.name}:** ${c.fees}`).join('\n');
    return `### Fee Structure\n\n${feeLines}`;
  }

  if (hasAny(["eligibility", "eligible", "criteria"])) {
    const eligibilityLines = admissionData.courses.map(c => `- **${c.name}:** ${c.eligibility}`).join('\n');
    return `### Eligibility Criteria\n\n${eligibilityLines}`;
  }

  if (hasAny(["contact", "phone", "email"])) {
    return `### Admission Contact\n\n- **Email:** ${admissionData.contact.email}\n- **Phone:** ${admissionData.contact.phone}`;
  }

  return "I can only help with university admission queries. Feel free to ask about procedure, courses, fees, eligibility, deadlines, required documents, or contact details!";
}

function appendMessage(role, content) {
  const messagesDiv = document.getElementById('chat-messages');
  const bubble = document.createElement('div');
  bubble.className = `message-bubble ${role === 'user' ? 'user-message' : 'assistant-message'}`;
  
  // Basic markdown-like formatting
  let formattedContent = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/### (.*?)\n/g, '<h3>$1</h3>')
    .replace(/#### (.*?)\n/g, '<h4>$1</h4>')
    .replace(/\n/g, '<br>');
  
  bubble.innerHTML = formattedContent;
  messagesDiv.appendChild(bubble);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  appendMessage('user', text);
  input.value = '';

  setTimeout(() => {
    const reply = getLocalAdmissionReply(text);
    appendMessage('assistant', reply);
  }, 500);
}

function toggleChat() {
  const window = document.getElementById('chat-window');
  const icon = document.getElementById('chat-toggle-icon');
  if (window.style.display === 'flex') {
    window.style.display = 'none';
    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>';
  } else {
    window.style.display = 'flex';
    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadAdmissionData();
  
  const input = document.getElementById('chat-input');
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Initial welcome message
  setTimeout(() => {
    appendMessage('assistant', "Hi! 👋 I'm the **Meow University Admission Enquiries Assistant**.\n\nI can instantly help with **admission procedure, eligibility, deadlines, fees, and required documents**.");
  }, 500);
});
