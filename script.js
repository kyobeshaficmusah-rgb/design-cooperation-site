const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const quoteForm = document.getElementById('quoteForm');
const quoteSummary = document.getElementById('quoteSummary');

const assistantName = 'Design Cooperation AI Consultant';

const defaultResponse = `I can help with branding, design packages, and quote requests. Ask me about service packages, branding direction, or share your project requirements.`;

const recommendationMap = [
  {
    keywords: ['branding', 'brand', 'logo', 'identity'],
    response: 'For branding and identity, I recommend our Branding Package. It includes logo design, visual system guidance, typography, color palette, and a brand guidelines overview.'
  },
  {
    keywords: ['website', 'site', 'web design', 'landing page'],
    response: 'For website work, our Website Design Package is ideal. It covers responsive design concepts, visual direction, and handoff assets for a conversion-focused online experience.'
  },
  {
    keywords: ['social', 'instagram', 'facebook', 'social media'],
    response: 'For social presence, our Social Media Design Package will help. It delivers a set of post templates, story assets, and campaign visuals aligned to your brand.'
  },
  {
    keywords: ['print', 'printing', 'brochure', 'flyer', 'business card'],
    response: 'For printed materials, our Print & Production Package is perfect. It includes artwork preparation, print-ready files, and production support recommendations.'
  },
  {
    keywords: ['package', 'recommend', 'recommendation', 'suggest'],
    response: 'I can recommend packages based on your goals. Tell me if you need branding, packaging, website, or social media design.'
  }
];

const quoteQuestions = [
  'quote',
  'estimate',
  'pricing',
  'cost',
  'quotation'
];

function appendMessage(content, type = 'assistant') {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${type}`;
  bubble.textContent = content;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function fetchAssistantResponse(message) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('Server error:', text);
      return 'Sorry, I could not reach the AI service right now.';
    }
    const data = await res.json();
    return data.reply || 'Sorry, no response from AI.';
  } catch (err) {
    console.error(err);
    return 'An error occurred while contacting the AI service.';
  }
}

const typingIndicator = document.getElementById('typingIndicator');
const quickActions = document.querySelectorAll('.quick-action');

function showTyping() {
  typingIndicator.classList.remove('hidden');
}

function hideTyping() {
  typingIndicator.classList.add('hidden');
}

function respondWithTyping(message) {
  appendMessage(message, 'assistant');
  hideTyping();
}

sendBtn.addEventListener('click', async () => {
  const message = chatInput.value.trim();
  if (!message) return;
  appendMessage(message, 'user');
  chatInput.value = '';
  showTyping();
  const reply = await fetchAssistantResponse(message);
  respondWithTyping(reply);
});

chatInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendBtn.click();
  }
});

quickActions.forEach((button) => {
  button.addEventListener('click', async () => {
    const message = button.textContent;
    appendMessage(message, 'user');
    showTyping();
    const reply = await fetchAssistantResponse(message);
    respondWithTyping(reply);
  });
});

quoteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const fullName = document.getElementById('qFullName').value.trim();
  const company = document.getElementById('qCompany').value.trim();
  const phone = document.getElementById('qPhone').value.trim();
  const email = document.getElementById('qEmail').value.trim();
  const service = document.getElementById('qService').value.trim();
  const budget = document.getElementById('qBudget').value.trim();
  const description = document.getElementById('qDescription').value.trim();

  if (!fullName || !phone || !email || !service || !description) {
    quoteSummary.textContent = 'Please complete the required fields: Full Name, Phone, Email, Service and Project Description.';
    quoteSummary.classList.remove('hidden');
    return;
  }

  quoteSummary.innerHTML = `
    <h4>Quotation Request</h4>
    <p><strong>Name:</strong> ${fullName}${company ? ' — ' + company : ''}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
    <p><strong>Service Required:</strong> ${service}</p>
    <p><strong>Budget Range:</strong> ${budget || 'Discuss'}</p>
    <p><strong>Project Description:</strong><br>${description.replace(/\n/g, '<br>')}</p>
    <p>Thank you — our team will review this request and follow up within one business day to discuss next steps.</p>
  `;
  quoteSummary.classList.remove('hidden');
  quoteForm.reset();
});

const galleryItems = [
  {
    src: 'assets/projects/kaana-genius/cover.jpg',
    title: 'Kaana Genius',
    caption: 'Publishing & Education portfolio showcase.'
  },
  {
    src: 'assets/projects/new-style-construction/cover.jpg',
    title: 'New Style Construction',
    caption: 'Construction & Engineering portfolio showcase.'
  },
  {
    src: 'assets/projects/nyombi-savo/cover.jpg',
    title: 'Nyombi Savo',
    caption: 'Japanese new & used spare parts portfolio showcase.'
  },
  {
    src: 'assets/projects/engo-tours/cover.jpg',
    title: 'Engo Tours',
    caption: 'Tourism & travel portfolio showcase.'
  },
  {
    src: 'assets/projects/metric-cafe/cover.jpg',
    title: 'Metric Café',
    caption: 'Food & beverage portfolio showcase.'
  }
];

const galleryModal = document.querySelector('.gallery-modal');
const galleryBackdrop = document.querySelector('[data-gallery-close]');
const galleryClose = document.querySelector('.gallery-close');
const galleryImage = document.querySelector('.gallery-image');
const galleryTitle = document.querySelector('.gallery-title');
const galleryCaption = document.querySelector('.gallery-caption');
const galleryCounter = document.querySelector('.gallery-counter');
const galleryPrev = document.querySelector('.gallery-prev');
const galleryNext = document.querySelector('.gallery-next');
const galleryTriggers = document.querySelectorAll('[data-gallery-index]');
let currentGalleryIndex = 0;

function updateGalleryContent(index) {
  const item = galleryItems[index];
  galleryImage.src = item.src;
  galleryImage.alt = item.title;
  galleryTitle.textContent = item.title;
  galleryCaption.textContent = item.caption;
  galleryCounter.textContent = `${index + 1} / ${galleryItems.length}`;
}

function openGallery(index) {
  currentGalleryIndex = index;
  updateGalleryContent(index);
  galleryModal.classList.add('is-open');
  galleryModal.setAttribute('aria-hidden', 'false');
}

function closeGallery() {
  galleryModal.classList.remove('is-open');
  galleryModal.setAttribute('aria-hidden', 'true');
}

function showNextGalleryItem() {
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
  updateGalleryContent(currentGalleryIndex);
}

function showPreviousGalleryItem() {
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
  updateGalleryContent(currentGalleryIndex);
}

galleryTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const index = Number(trigger.dataset.galleryIndex);
    openGallery(index);
  });
});

galleryClose.addEventListener('click', closeGallery);
galleryBackdrop.addEventListener('click', closeGallery);
galleryPrev.addEventListener('click', showPreviousGalleryItem);
galleryNext.addEventListener('click', showNextGalleryItem);

document.addEventListener('keydown', (event) => {
  if (galleryModal.classList.contains('is-open')) {
    if (event.key === 'Escape') {
      closeGallery();
    } else if (event.key === 'ArrowRight') {
      showNextGalleryItem();
    } else if (event.key === 'ArrowLeft') {
      showPreviousGalleryItem();
    }
  }
});

appendMessage(`Hello! I am ${assistantName}. Ask me about branding and design, service packages, or request a custom quote.`, 'assistant');
