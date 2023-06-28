/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import { wait } from './utils.js';

const API_KEY = 'b9b93b2bdbea482e88878d6a55eea271';
const MAX_RETRIES = 3;

async function callAzureChatCompletionAPI(conversation) {
  let retries = 0;
  console.log(`[azure-openai]Calling Azure Chat Completion API with conversation: ${JSON.stringify(conversation, null, 2)}`);
  const AZURE_CHAT_API = `https://gen-ai-experiments.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-03-15-preview&api-key=${API_KEY}`;

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const payload = {};
  payload.messages = conversation;
  requestOptions.body = JSON.stringify(payload);

  while (retries < MAX_RETRIES) {
    const response = await fetch(AZURE_CHAT_API, requestOptions);
    if (response.ok) {
      const data = await response.json();
      console.log(`[azure-openai]Here's the Azure Chat Completion API Response: ${JSON.stringify(data, null, 2)}`);
      return data.choices[0].message;
    }
    retries += 1;
    const delay = 1000;
    console.log(`Azure Chat Completion API Retrying in ${delay}ms...`);
    await wait(delay);
  }
  throw new Error('Azure Chat Completion API Max retries reached. Giving up!!');
}

async function initiateChat() {
  console.log('Initiating chat...');
  const conversation = [];

  const firstPrompt = `
  The json representation of the sentence "Create a travel website of Forts in Jaipur with concise text and vivid images in sepia tone"
  is {"topic": "Forts in Jaipur", "template": "website", "action": "create", "text_adjective":"concise", "image_adjective":"vivid", "image_tone":"sepia"}.
  Similarly, The json representation of the sentence "Build a poster on tourist places in Ladakh containing less words and bright pictures"
  is {"topic": "Tourist places in Ladakh", "template": "poster", "action": "build", "text_adjective":"less", "image_adjective":"bright", "image_tone" : null}
  Now, return the JSON for "Create a travel website of Forts in New Delhi having colourful pics and verbose text".`;
  conversation.push({
    role: 'system',
    content: firstPrompt,
  });
  const firstResponse = await callAzureChatCompletionAPI(conversation);
  conversation.push(firstResponse);

  console.log('Chat initiated.');
  return conversation;
}

async function initiateSynonymChat() {
  console.log('Preparing synonym chat');

  const conversation = [];

  const firstPrompt = `
  Consider concise_bucket = ["Succinct","Brief","Terse","Pithy","Compact","Short","Compendious","Laconic","Condensed","Abridged","Synoptic","Epigrammatic","Curt","Tersely","Clipped"]
  and
  verbose_bucket = ["Wordy","Long-winded","Prolix","Loquacious","Circumlocutory","Garrulous","Rambling","Verbose","Periphrastic","Pompous","Repetitive","Tautological","Rhetorical","Bombastic","Grandiloquent"]
  `;
  conversation.push({
    role: 'system',
    content: firstPrompt,
  });
  const firstResponse = await callAzureChatCompletionAPI(conversation);
  conversation.push(firstResponse);

  console.log('Synonym Chat initiated.');
  return conversation;
}

export { callAzureChatCompletionAPI, initiateChat, initiateSynonymChat };
