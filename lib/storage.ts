import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'inbox.json');

export interface InboxMessage {
  id: string;
  sender: string;
  subject: string;
  body: string;
  received_at: string;
  status: 'unread' | 'read' | 'archived';
  ai_summary?: string;
  ai_response?: string;
}

export interface InboxData {
  messages: InboxMessage[];
  created_at: string;
  version: string;
}

export async function readInbox(): Promise<InboxData> {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create default
    const defaultData: InboxData = {
      messages: [],
      created_at: new Date().toISOString(),
      version: "1.0"
    };
    await writeInbox(defaultData);
    return defaultData;
  }
}

export async function writeInbox(data: InboxData): Promise<void> {
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function addMessage(message: Omit<InboxMessage, 'id' | 'received_at' | 'status'>): Promise<InboxMessage> {
  const inbox = await readInbox();
  const newMessage: InboxMessage = {
    ...message,
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    received_at: new Date().toISOString(),
    status: 'unread'
  };
  inbox.messages.unshift(newMessage); // Add to beginning
  await writeInbox(inbox);
  return newMessage;
}

export async function resetInbox(): Promise<void> {
  const emptyInbox: InboxData = {
    messages: [],
    created_at: new Date().toISOString(),
    version: "1.0"
  };
  await writeInbox(emptyInbox);
}

export async function updateMessage(id: string, updates: Partial<InboxMessage>): Promise<InboxMessage | null> {
  const inbox = await readInbox();
  const index = inbox.messages.findIndex(m => m.id === id);
  if (index === -1) return null;

  inbox.messages[index] = { ...inbox.messages[index], ...updates };
  await writeInbox(inbox);
  return inbox.messages[index];
}
