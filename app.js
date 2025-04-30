import { API_KEY as configApiKey } from './config.js';

// DOM Elements
const postForm = document.getElementById('post-form');
const factsContainer = document.getElementById('facts-container');
const addFactBtn = document.getElementById('add-fact');
const resultSection = document.getElementById('result-section');
const postContent = document.getElementById('post-content');
const copyBtn = document.getElementById('copy-btn');
const loadingEl = document.getElementById('loading');

// Constants
const MAX_FACTS = 5;
const MIN_FACTS = 3;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.0-flash-exp:free';
const STORAGE_KEY = 'storysell_api_key';

// Get API key from localStorage or config
let API_KEY = localStorage.getItem(STORAGE_KEY) || configApiKey;

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);

/**
 * Initialize the application
 */
function initializeApp() {
  postForm.addEventListener('submit', handleFormSubmit);
  addFactBtn.addEventListener('click', addNewFactInput);
  copyBtn.addEventListener('click', copyToClipboard);
  factsContainer.addEventListener('click', handleFactButtonClick);
  
  // Initialize fact inputs validation
  updateFactInputsState();
  
  // Initialize API key management
  initApiKeyManager();
}

/**
 * Handle form submission
 * @param {Event} e - Form submission event
 */
async function handleFormSubmit(e) {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  showLoading(true);
  
  try {
    const formData = getFormData();
    const generatedPost = await generatePost(formData);
    
    displayResult(generatedPost);
  } catch (error) {
    console.error('Error generating post:', error);
    alert('Failed to generate post. Please try again.');
  } finally {
    showLoading(false);
  }
}

/**
 * Validate the form
 * @returns {boolean} - Whether the form is valid
 */
function validateForm() {
  const factInputs = [...document.querySelectorAll('.fact-input')];
  const allFactsValid = factInputs.every(input => input.value.trim() !== '');
  
  if (!allFactsValid) {
    alert('Please fill in all fact fields.');
    return false;
  }
  
  if (factInputs.length < MIN_FACTS) {
    alert(`Please provide at least ${MIN_FACTS} facts.`);
    return false;
  }
  
  return true;
}

/**
 * Get form data
 * @returns {Object} - Form data object
 */
function getFormData() {
  const platform = document.getElementById('platform').value;
  const topic = document.getElementById('topic').value;
  const language = document.getElementById('language').value;
  const factInputs = [...document.querySelectorAll('.fact-input')];
  const facts = factInputs.map(input => input.value.trim()).filter(fact => fact !== '');
  
  return {
    platform,
    topic,
    language,
    facts
  };
}

/**
 * Generate post using the OpenRouter API
 * @param {Object} formData - Form data
 * @returns {string} - Generated post content
 */
async function generatePost(formData) {
  const { platform, topic, language, facts } = formData;
  
  // Check if API key is set
  if (!API_KEY || API_KEY === 'your_openrouter_api_key_here' || API_KEY === 'replace_with_your_openrouter_api_key') {
    throw new Error('Please set your OpenRouter API key first.');
  }
  
  // Create facts bullet points
  const factsText = facts.map(fact => `• ${fact}`).join('\n');
  
  // Create prompt
  const prompt = `Generate a very subtle and non-promotional social media post for ${platform} in ${language}. 

Topic: ${topic}
Facts:
${factsText}

IMPORTANT GUIDELINES:
- Create a natural, conversational story that seamlessly incorporates these facts
- Focus on providing value, inspiration, or relatability to the reader
- Avoid any direct sales language, calls-to-action, or promotional tone
- The reader should not feel they're being sold to at all
- The mention of the topic/product should feel incidental, not the focus
- Remember: "Facts tell, stories sell" - but the "selling" should be invisible

Create an authentic post that someone would genuinely want to share because it's helpful or interesting, not because it's promoting something.`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'HTTP-Referer': window.location.href
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'API request failed');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Display the generated post result
 * @param {string} content - Generated post content
 */
function displayResult(content) {
  postContent.textContent = content;
  resultSection.classList.remove('hidden');
  
  // Scroll to results
  resultSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Add new fact input field
 */
function addNewFactInput() {
  const factInputs = document.querySelectorAll('.fact-item');
  
  if (factInputs.length >= MAX_FACTS) {
    alert(`Maximum ${MAX_FACTS} facts allowed.`);
    return;
  }
  
  const newFactItem = document.createElement('div');
  newFactItem.className = 'fact-item';
  newFactItem.innerHTML = `
    <input type="text" class="form-input fact-input" placeholder="Enter a key fact" required>
    <button type="button" class="btn btn-small btn-remove">✕</button>
  `;
  
  factsContainer.appendChild(newFactItem);
  updateFactInputsState();
  
  // Focus the new input
  const newInput = newFactItem.querySelector('input');
  newInput.focus();
}

/**
 * Handle fact remove button click
 * @param {Event} e - Click event
 */
function handleFactButtonClick(e) {
  if (!e.target.matches('.btn-remove')) return;
  
  const factItem = e.target.closest('.fact-item');
  if (factItem) {
    factItem.remove();
    updateFactInputsState();
  }
}

/**
 * Update fact inputs state (disable remove buttons if only minimum facts remain)
 */
function updateFactInputsState() {
  const factItems = document.querySelectorAll('.fact-item');
  const removeButtons = document.querySelectorAll('.btn-remove');
  
  if (factItems.length <= MIN_FACTS) {
    removeButtons.forEach(btn => btn.disabled = true);
  } else {
    removeButtons.forEach(btn => btn.disabled = false);
  }
  
  addFactBtn.disabled = factItems.length >= MAX_FACTS;
}

/**
 * Copy post content to clipboard
 */
function copyToClipboard() {
  const text = postContent.textContent;
  navigator.clipboard.writeText(text)
    .then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    })
    .catch(err => {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text to clipboard.');
    });
}

/**
 * Show/hide loading indicator
 * @param {boolean} show - Whether to show loading
 */
function showLoading(show) {
  if (show) {
    loadingEl.classList.remove('hidden');
  } else {
    loadingEl.classList.add('hidden');
  }
}

/**
 * Initialize API key manager functionality
 */
function initApiKeyManager() {
  // Create API key manager HTML
  const apiKeyManager = document.createElement('div');
  apiKeyManager.className = 'api-key-manager';
  apiKeyManager.innerHTML = `
    <div class="api-key-form">
      <div class="form-group">
        <label for="api-key" class="form-label">OpenRouter API Key</label>
        <div class="api-key-input-container">
          <input type="${API_KEY ? 'password' : 'text'}" id="api-key" class="form-input" 
            placeholder="Enter your OpenRouter API key" 
            value="${API_KEY !== 'your_openrouter_api_key_here' && API_KEY !== 'replace_with_your_openrouter_api_key' ? '••••••••••••••••••••••' : ''}">
          <button type="button" id="toggle-key-visibility" class="btn btn-small btn-secondary">
            ${API_KEY ? 'Show' : 'Hide'}
          </button>
        </div>
      </div>
      <div class="api-key-buttons">
        <button type="button" id="save-api-key" class="btn btn-small btn-primary">Save Key</button>
        <button type="button" id="reset-api-key" class="btn btn-small btn-secondary">Reset</button>
      </div>
      <p class="api-key-info">Your API key is stored locally in your browser and is not sent to our servers.</p>
    </div>
  `;
  
  // Insert API key manager before the form
  const formSection = document.querySelector('.form-section');
  formSection.parentNode.insertBefore(apiKeyManager, formSection);
  
  // Add event listeners
  const apiKeyInput = document.getElementById('api-key');
  const saveKeyBtn = document.getElementById('save-api-key');
  const resetKeyBtn = document.getElementById('reset-api-key');
  const toggleKeyBtn = document.getElementById('toggle-key-visibility');
  
  saveKeyBtn.addEventListener('click', () => saveApiKey(apiKeyInput.value));
  resetKeyBtn.addEventListener('click', resetApiKey);
  toggleKeyBtn.addEventListener('click', () => toggleApiKeyVisibility(apiKeyInput, toggleKeyBtn));
  
  // If API key is the default one, show the input in text mode
  if (API_KEY === 'your_openrouter_api_key_here' || API_KEY === 'replace_with_your_openrouter_api_key') {
    apiKeyInput.type = 'text';
    apiKeyInput.value = '';
    toggleKeyBtn.textContent = 'Hide';
  }
}

/**
 * Save API key to localStorage
 * @param {string} key - API key to save
 */
function saveApiKey(key) {
  if (!key) {
    alert('Please enter an API key');
    return;
  }
  
  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, key);
  API_KEY = key;
  
  // Update UI
  const apiKeyInput = document.getElementById('api-key');
  apiKeyInput.type = 'password';
  apiKeyInput.value = '••••••••••••••••••••••';
  
  const toggleKeyBtn = document.getElementById('toggle-key-visibility');
  toggleKeyBtn.textContent = 'Show';
  
  alert('API key saved successfully!');
}

/**
 * Reset API key (remove from localStorage)
 */
function resetApiKey() {
  // Remove from localStorage
  localStorage.removeItem(STORAGE_KEY);
  API_KEY = configApiKey;
  
  // Update UI
  const apiKeyInput = document.getElementById('api-key');
  apiKeyInput.type = 'text';
  apiKeyInput.value = '';
  
  const toggleKeyBtn = document.getElementById('toggle-key-visibility');
  toggleKeyBtn.textContent = 'Hide';
  
  alert('API key has been reset. Please enter a new key.');
}

/**
 * Toggle API key visibility
 * @param {HTMLElement} input - API key input element
 * @param {HTMLElement} button - Toggle button element
 */
function toggleApiKeyVisibility(input, button) {
  if (input.type === 'password') {
    input.type = 'text';
    if (input.value === '••••••••••••••••••••••') {
      input.value = API_KEY;
    }
    button.textContent = 'Hide';
  } else {
    input.type = 'password';
    if (API_KEY && input.value === API_KEY) {
      input.value = '••••••••••••••••••••••';
    }
    button.textContent = 'Show';
  }
} 