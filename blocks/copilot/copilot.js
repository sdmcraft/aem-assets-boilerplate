/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
import template from './copilot-template.js';
import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { wait } from './utils.js';
import { executePrompt } from './pipeline.js';
import { preGeneratedSequence } from './pre-generated.js';

let promptCounter = -1;

// Function to append a message to the chat history
function appendMessage(message, sender, chatHistory) {
  const messageElement = document.createElement('div');
  const senderSpan = document.createElement('span');
  senderSpan.classList.add('sender');
  if (sender.toLowerCase() === 'copilot') {
    senderSpan.innerHTML = '<i class="fa-solid fa-robot" style="color: #28c908;"></i> : ';
  } else {
    senderSpan.innerHTML = 'You : ';
  }

  const messageSpan = document.createElement('span');
  messageSpan.classList.add('message');
  messageSpan.textContent = message;
  messageElement.appendChild(senderSpan);
  messageElement.appendChild(messageSpan);
  chatHistory.appendChild(messageElement);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Function to send a user message
async function sendUserMessage(messageInput, chatHistory) {
  const message = messageInput.value.trim();

  if (message !== '') {
    appendMessage(message, 'You', chatHistory);
    await wait(500);
    appendMessage('Aye Aye Captain...', 'Copilot', chatHistory);
    // Handle the message (e.g., send it to an AI model for processing)
    // ... Your code here ...
    messageInput.value = '';
  }
}

// Function to send a user message
function sendSystemMessage(messageInput, chatHistory) {
  const message = messageInput.trim();
  if (message !== '') {
    appendMessage(message, 'Copilot', chatHistory);
  }
}

function showToast(message) {
  const toastContainer = document.getElementById('toast-container');
  toastContainer.textContent = message;
  toastContainer.style.display = 'block';

  // Automatically hide the toast after a certain duration
  setTimeout(() => {
    toastContainer.style.display = 'none';
  }, 3000); // Adjust the duration (in milliseconds) as needed
}

export default function decorate(block) {
  const linkTag = document.createElement('link');
  linkTag.setAttribute('rel', 'stylesheet');
  linkTag.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
  document.head.appendChild(linkTag);
  const cfg = readBlockConfig(block);
  let prompt = '';
  block.innerHTML = template();

  const chatHistory = block.querySelector('#chat-history');
  const messageInput = block.querySelector('#message-input');
  const sendButton = block.querySelector('#send-button');
  const previewStage = block.querySelector('.preview-stage');
  const resetButton = block.querySelector('#reset-button');
  const copyButton = block.querySelector('#copy-button');

  const queryString = window.location.search;
  // Create a new URLSearchParams object from the query string
  const params = new URLSearchParams(queryString);
  // Access individual query parameters by their names
  const preGen = params.get('pregen');

  sendButton.addEventListener('click', async () => {
    promptCounter += 1;
    prompt += ` ${messageInput.value.trim()}`;
    sendUserMessage(messageInput, chatHistory);
    previewStage.innerHTML = '';
    const placeholderAnimation = document.createElement('div');
    placeholderAnimation.classList.add('placeholder-animation');
    previewStage.appendChild(placeholderAnimation);
    let generatedBlocksMarkup;
    if (preGen && preGen === 'true') {
      await wait(3000);
      generatedBlocksMarkup = preGeneratedSequence[promptCounter];
      console.log(`[copilot]Using pre-generated markup ${generatedBlocksMarkup}`);
    } else {
      generatedBlocksMarkup = await executePrompt(prompt, cfg);
    }
    placeholderAnimation.remove();
    console.log(`[copilot]${generatedBlocksMarkup}`);
    previewStage.innerHTML = generatedBlocksMarkup;
    sendSystemMessage('Done! Please take a look.', chatHistory);
  });

  copyButton.addEventListener('click', async () => {
    const clipboardData = new Blob([previewStage.innerHTML], { type: 'text/html' });
    const data = [new ClipboardItem({ [clipboardData.type]: clipboardData })];
    navigator.clipboard.write(data);
    showToast('Copied to clipboard!');
  });

  resetButton.addEventListener('click', () => {
    window.location.reload();
  });
}
