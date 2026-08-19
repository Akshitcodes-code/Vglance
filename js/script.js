/**
 * SearchAI - Main Dashboard Engine (Vanilla JS)
 * Handles state management, UI rendering, history, theme toggle, and carousel interactions.
 */

// Data Collections
const INITIAL_HISTORY = [
  { id: '1', query: 'What is Quantum Computing?', time: '2 min ago' },
  { id: '2', query: 'Best AI tools for developer', time: '1 hour ago' },
  { id: '3', query: 'How does photosynthesis work?', time: '3 hours ago' },
  { id: '4', query: 'Newton\'s Laws of Motion', time: '5 hours ago' },
  { id: '5', query: 'Python vs JavaScript', time: '1 day ago' },
  { id: '6', query: 'Machine Learning basics', time: '2 days ago' },
  { id: '7', query: 'Weather in Tokyo', time: '3 days ago' },
  { id: '8', query: 'Healthy breakfast ideas', time: '4 days ago' }
];

const REELS_DATA = [
  {
    id: 'r1',
    title: 'AI Fundamentals & Machine Intelligence',
    creator: 'AI Lab',
    duration: '0:58',
    image: 'assets/images/reel-1.jpg',
    fallbackBg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    category: 'educational'
  },
  {
    id: 'r2',
    title: 'Write Smarter Python Code with AI Clean Architecture',
    creator: 'CodeMentor',
    duration: '8:35',
    image: 'assets/images/reel-2.jpg',
    fallbackBg: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
    category: 'quick-tips'
  },
  {
    id: 'r3',
    title: 'Equation Solving: Step-by-Step Calculus',
    creator: 'MathSolutions',
    duration: '15:20',
    image: 'assets/images/reel-3.jpg',
    fallbackBg: 'linear-gradient(135deg, #701a75 0%, #4c1d95 100%)',
    category: 'educational'
  },
  {
    id: 'r4',
    title: 'Daily Design Inspiration & Interface Guidelines',
    creator: 'ArtInspire',
    duration: '10:15',
    image: 'assets/images/reel-4.jpg',
    fallbackBg: 'linear-gradient(135deg, #831843 0%, #9f1239 100%)',
    category: 'for-you'
  }
];

// App State
const state = {
  theme: localStorage.getItem('theme') || 'dark',
  history: [...INITIAL_HISTORY],
  activeCategory: 'all',
  isSearching: false
};

// Initialize Application Lifecycle
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  initializeTheme();
  initializeIcons();
  initializeHistory();
  initializeReels();
  initializeSearch();
  initializeTabs();
  initializeCarousel();
  initializeDropdowns();
  initializeMobileNavigation();
  initializeShortcuts();
}

/**
 * Icons Hydration (Lucide CDN helper)
 */
function initializeIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * Theme Toggle & Local Storage System
 */
function initializeTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  const themeBtn = document.getElementById('themeToggleBtn');

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', state.theme);
      localStorage.setItem('theme', state.theme);
    });
  }
}

/**
 * Render & Manage Sidebar History Items
 */
function initializeHistory() {
  const historyList = document.getElementById('historyList');
  if (!historyList) return;

  renderHistoryItems(historyList);
}

function renderHistoryItems(container) {
  container.innerHTML = '';

  state.history.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'history-item';
    li.dataset.query = item.query;

    li.innerHTML = `
      <div class="history-main">
        <i data-lucide="clock" class="history-icon"></i>
        <span class="history-text">${escapeHtml(item.query)}</span>
      </div>
      <div class="history-meta">
        <span class="history-time">${item.time}</span>
        <!-- Changed icon from "more-vertical" to "trash-2" -->
        <button class="history-menu-btn" aria-label="Delete History Item" data-id="${item.id}">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `;

    // Click handler to populate main search or delete item
    li.addEventListener('click', (e) => {
      if (e.target.closest('.history-menu-btn')) {
        e.stopPropagation();
        handleHistoryMenuClick(e, item.id);
        return;
      }
      
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.value = item.query;
        searchInput.focus();
        triggerDemoSearch(item.query);
      }
    });

    container.appendChild(li);
  });

  initializeIcons();
}

function handleHistoryMenuClick(event, id) {
  const confirmDelete = confirm('Remove item from search history?');
  if (confirmDelete) {
    state.history = state.history.filter(h => h.id !== id);
    renderHistoryItems(document.getElementById('historyList'));
  }
}

/**
 * Render Reel Cards & Bind Interactive Hover Behaviors
 */
function initializeReels() {
  const container = document.getElementById('reelsContainer');
  if (!container) return;

  container.innerHTML = '';

  REELS_DATA.forEach(reel => {
    const card = document.createElement('article');
    card.className = 'reel-card';
    card.dataset.category = reel.category;

    card.innerHTML = `
      <div class="reel-image-wrapper" style="background: ${reel.fallbackBg}">
        <img 
          src="${reel.image}" 
          alt="${escapeHtml(reel.title)}" 
          class="reel-image"
          loading="lazy"
          onerror="this.style.display='none'"
        />
        <div class="play-indicator">
          <i data-lucide="play"></i>
        </div>
        <div class="reel-overlay">
          <div class="duration-badge">
            <i data-lucide="play"></i>
            <span>${reel.duration}</span>
          </div>
          <div class="reel-details">
            <h3 class="reel-title">${escapeHtml(reel.title)}</h3>
            <div class="reel-creator">
              <span class="creator-avatar"></span>
              <span>${escapeHtml(reel.creator)}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      alert(`Playing reel: "${reel.title}"`);
    });

    container.appendChild(card);
  });

  initializeIcons();
  setupReelHoverInteraction();
}

/**
 * Handles Focus / Dim Interactive Hover Effects for Reel Cards
 */
function setupReelHoverInteraction() {
  const container = document.getElementById('reelsContainer');
  if (!container) return;

  // Use event delegation for maximum performance
  container.addEventListener('mouseover', (e) => {
    const hoveredCard = e.target.closest('.reel-card');
    if (!hoveredCard) return;

    const cards = container.querySelectorAll('.reel-card');
    cards.forEach(card => {
      if (card === hoveredCard) {
        card.classList.add('is-focused');
        card.classList.remove('is-dimmed');
      } else {
        card.classList.add('is-dimmed');
        card.classList.remove('is-focused');
      }
    });
  });

  container.addEventListener('mouseout', (e) => {
    const related = e.relatedTarget;
    // Reset all card states when mouse leaves the reel container
    if (!related || !container.contains(related)) {
      resetReelCardsState();
    }
  });
}

function resetReelCardsState() {
  const cards = document.querySelectorAll('.reel-card');
  cards.forEach(card => {
    card.classList.remove('is-focused', 'is-dimmed');
  });
}

/**
 * Search Submission & Interactive AI Feedback Simulation
 */
function initializeSearch() {
  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const micBtn = document.getElementById('micBtn');
  const newSearchBtn = document.getElementById('newSearchBtn');

  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = input.value.trim();
      if (query) {
        triggerDemoSearch(query);
      }
    });
  }

  if (micBtn) {
    micBtn.addEventListener('click', () => {
      alert('Voice search is not available in this demo mode.');
    });
  }

  if (newSearchBtn) {
    newSearchBtn.addEventListener('click', () => {
      if (input) {
        input.value = '';
        input.focus();
        const panel = document.getElementById('searchResultsPanel');
        if (panel) panel.hidden = true;
      }
    });
  }
}

/**
 * Search AI Engine with Frame Scanner & Recommendation Logic
 */
function triggerDemoSearch(query) {
  const panel = document.getElementById('searchResultsPanel');
  const scannerLoader = document.getElementById('aiScannerLoader');
  const body = document.getElementById('resultsBody');
  const scannerTag = document.getElementById('scannerTag');
  const scannerStatusText = document.getElementById('scannerStatusText');

  if (!panel || !scannerLoader || !body) return;

  panel.hidden = false;
  scannerLoader.hidden = false;
  body.hidden = true;

  // Frame Scanning Animation Sequential Text Steps
  const scanSteps = [
    { tag: 'Frame #012', text: 'Splitting video stream into keyframes...' },
    { tag: 'Frame #045', text: 'Analyzing visual context & text vectors...' },
    { tag: 'Frame #089', text: 'Matching query intent with video semantic insights...' },
    { tag: 'Frame #120', text: 'Generating smart recommendations...' }
  ];

  let stepIdx = 0;
  const scanInterval = setInterval(() => {
    if (stepIdx < scanSteps.length) {
      if (scannerTag) scannerTag.innerText = scanSteps[stepIdx].tag;
      if (scannerStatusText) scannerStatusText.innerText = scanSteps[stepIdx].text;
      stepIdx++;
    } else {
      clearInterval(scanInterval);
    }
  }, 600);

  // Recent History Record Addition
  if (!state.history.some(h => h.query.toLowerCase() === query.toLowerCase())) {
    state.history.unshift({
      id: Date.now().toString(),
      query: query,
      time: 'Just now'
    });
    renderHistoryItems(document.getElementById('historyList'));
  }

  // Render Output after frame-processing animation completes
  setTimeout(() => {
    clearInterval(scanInterval);
    scannerLoader.hidden = true;
    body.hidden = false;

    body.innerHTML = `
      <div class="ai-recommendation-card">
        <h3>Top AI Match for "${escapeHtml(query)}"</h3>
        
        <!-- Toggle Buttons -->
        <div class="recommendation-actions">
          <button class="rec-tab-btn active" onclick="toggleRecTab(this, 'reason')">
            <i data-lucide="sparkles"></i> Why Recommended
          </button>
          <button class="rec-tab-btn" onclick="toggleRecTab(this, 'inside')">
            <i data-lucide="list"></i> What's Inside the Video
          </button>
        </div>

        <!-- Dynamic Content Area -->
        <div class="rec-info-content" id="recInfoContent">
          <strong>Why Recommended:</strong> Visual frames between 01:20 - 03:45 directly explain <em>"${escapeHtml(query)}"</em> with high confidence scores (98.4%).
        </div>
      </div>
    `;

    initializeIcons();
  }, 2600);
}

/**
 * Toggle between "Why Recommended" & "What's Inside"
 */
function toggleRecTab(btnElement, type) {
  const container = btnElement.closest('.ai-recommendation-card');
  const buttons = container.querySelectorAll('.rec-tab-btn');
  const contentBox = container.querySelector('#recInfoContent');

  buttons.forEach(b => b.classList.remove('active'));
  btnElement.classList.add('active');

  if (type === 'reason') {
    contentBox.innerHTML = `<strong>Why Recommended:</strong> Visual frames between 01:20 - 03:45 directly explain your query with high visual clarity and context relevance.`;
  } else if (type === 'inside') {
    contentBox.innerHTML = `
      <strong>What's Inside this Video:</strong>
      <ul style="margin-top: 6px; padding-left: 20px;">
        <li>00:00 - Core Concept Overview</li>
        <li>01:15 - Practical Frame Walkthrough</li>
        <li>04:30 - Summary & Best Practices</li>
      </ul>
    `;
  }
}

/**
 * Category Tab Filtering
 */
function initializeTabs() {
  const tabsContainer = document.getElementById('categoryTabs');
  if (!tabsContainer) return;

  const tabs = tabsContainer.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      state.activeCategory = tab.dataset.category;
      filterReels(state.activeCategory);
    });
  });
}

function filterReels(category) {
  resetReelCardsState();
  const cards = document.querySelectorAll('.reel-card');
  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

/**
 * Carousel Controls (Smooth Horizontal Scrolling)
 */
function initializeCarousel() {
  const container = document.getElementById('reelsContainer');
  const prevBtn = document.getElementById('carouselPrevBtn');
  const nextBtn = document.getElementById('carouselNextBtn');

  if (!container || !prevBtn || !nextBtn) return;

  const scrollAmount = 300;

  prevBtn.addEventListener('click', () => {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

/**
 * Header Popovers & Dropdown Toggles
 */
function initializeDropdowns() {
  setupDropdown('appsBtn', 'appsDropdown');
  setupDropdown('notificationBtn', 'notificationDropdown');

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-wrapper')) {
      closeAllDropdowns();
    }
  });
}

function setupDropdown(btnId, dropdownId) {
  const btn = document.getElementById(btnId);
  const dropdown = document.getElementById(dropdownId);

  if (!btn || !dropdown) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';

    closeAllDropdowns();

    if (!isExpanded) {
      btn.setAttribute('aria-expanded', 'true');
      dropdown.classList.add('show');
      dropdown.setAttribute('aria-hidden', 'false');
    }
  });
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.classList.remove('show');
    menu.setAttribute('aria-hidden', 'true');
  });
  document.querySelectorAll('.dropdown-wrapper button').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Mobile Drawer & Responsive Overlay
 */
function initializeMobileNavigation() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('sidebarCloseBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  }

  if (menuBtn) menuBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);
}

/**
 * Keyboard Shortcuts Handler (Command / Ctrl + K)
 */
function initializeShortcuts() {
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
  });
}

/**
 * Helper: XSS Security Sanitizer
 */
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}
// Dynamic Scanner Renderer based on Input Type
function runAiScanner(query, type = 'text') {
  const searchResultsPanel = document.getElementById('searchResultsPanel');
  const aiScannerLoader = document.getElementById('aiScannerLoader');
  const resultsBody = document.getElementById('resultsBody');
  const scannerStatusText = document.querySelector('.scanner-status-text');
  const scannerVisualBox = document.querySelector('.scanner-visual-box');

  if (!searchResultsPanel || !aiScannerLoader || !resultsBody) return;

  searchResultsPanel.classList.remove('hidden');
  aiScannerLoader.classList.remove('hidden');
  resultsBody.classList.add('hidden');

  // Reset visual box classes
  if (scannerVisualBox) {
    scannerVisualBox.className = 'scanner-visual-box';
  }

  // 1. TEXT SEARCH ANIMATION (Word-by-word tokenizing effect)
  if (type === 'text') {
    if (scannerVisualBox) scannerVisualBox.classList.add('type-text');
    const words = query.split(' ');
    let wordIndex = 0;

    if (scannerStatusText) {
      scannerStatusText.innerHTML = `Tokenizing query: <span class="scanning-word">"${words[0] || ''}"</span>`;
    }

    const textInterval = setInterval(() => {
      wordIndex++;
      if (wordIndex < words.length) {
        if (scannerStatusText) {
          scannerStatusText.innerHTML = `Tokenizing query: <span class="scanning-word">"${words[wordIndex]}"</span>`;
        }
      } else {
        clearInterval(textInterval);
        if (scannerStatusText) {
          scannerStatusText.innerHTML = 'Extracting Semantic Text Vectors...';
        }
      }
    }, 400);
  }

  // 2. VIDEO SEARCH ANIMATION (Frame Sequence Grid)
  else if (type === 'video') {
    if (scannerVisualBox) scannerVisualBox.classList.add('type-video');
    let frameNum = 12;

    const videoInterval = setInterval(() => {
      frameNum += 18;
      if (frameNum <= 120) {
        if (scannerStatusText) {
          scannerStatusText.innerHTML = `Extracting keyframe sequence: <span class="scanner-tag">Frame #${frameNum}</span>`;
        }
      } else {
        clearInterval(videoInterval);
        if (scannerStatusText) {
          scannerStatusText.innerHTML = 'Matching visual similarity vectors...';
        }
      }
    }, 500);
  }

  // 3. AUDIO SEARCH ANIMATION (Audio Waveform Spectral Analysis)
  else if (type === 'audio') {
    if (scannerVisualBox) {
      scannerVisualBox.classList.add('type-audio');
      scannerVisualBox.innerHTML = `
        <div class="audio-wave">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      `;
    }
    if (scannerStatusText) {
      scannerStatusText.innerHTML = 'Analyzing spectrographic frequency data...';
    }
  }

  // Complete Scanning Simulation (~2.6 Seconds)
  setTimeout(() => {
    aiScannerLoader.classList.add('hidden');
    resultsBody.classList.remove('hidden');
  }, 2600);
}