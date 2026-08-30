import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  mockMessagingConversations,
  mockContacts,
  Conversation,
  Message,
  Contact,
  Attachment,
} from '@/data/mockData';

interface MessagingContextType {
  conversations: Conversation[];
  messages: Message[];
  contacts: Contact[];
  unreadCount: number;
  sendMessage: (conversationId: string, text: string, attachments?: Attachment[]) => void;
  markConversationAsRead: (conversationId: string) => void;
  createConversation: (params: {
    participantId: string;
    conversationType: 'general' | 'issue_linked';
    linkedRequestId?: string | null;
    linkedRequestTitle?: string | null;
    messageText: string;
  }) => string;
  getConversationById: (id: string) => Conversation | undefined;
  getMessagesByConversationId: (conversationId: string) => Message[];
}

const MessagingContext = createContext<MessagingContextType>({
  conversations: [],
  messages: [],
  contacts: [],
  unreadCount: 0,
  sendMessage: () => {},
  markConversationAsRead: () => {},
  createConversation: () => '',
  getConversationById: () => undefined,
  getMessagesByConversationId: () => [],
});

export function MessagingProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(mockMessagingConversations);
  const [messages, setMessages] = useState<Message[]>(() =>
    mockMessagingConversations.flatMap((c) => c.messages),
  );

  const unreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const sendMessage = useCallback((conversationId: string, text: string, attachments: Attachment[] = []) => {
    const now = new Date();
    const timestamp = now.toLocaleString('en-IN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    }).replace(',', '');
    const isoNow = now.toISOString();

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: 'tenant_001',
      senderRole: 'tenant',
      senderName: 'You',
      text,
      timestamp,
      createdAt: isoNow,
      isRead: false,
      status: 'sent',
      attachments,
    };

    // TODO: Send message through backend mutation and real-time subscription.
    setMessages((prev) => [...prev, newMsg]);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: text, lastMessageTime: timestamp, lastMessageAt: isoNow }
          : c,
      ),
    );
  }, []);

  const markConversationAsRead = useCallback((conversationId: string) => {
    // TODO: Replace local mock messages with backend query.
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c,
      ),
    );
    setMessages((prev) =>
      prev.map((m) =>
        m.conversationId === conversationId && m.senderId !== 'tenant_001'
          ? { ...m, isRead: true, status: 'read' }
          : m,
      ),
    );
  }, []);

  const createConversation = useCallback((params: {
    participantId: string;
    conversationType: 'general' | 'issue_linked';
    linkedRequestId?: string | null;
    linkedRequestTitle?: string | null;
    messageText: string;
  }): string => {
    const contact = mockContacts.find((c) => c.id === params.participantId);
    if (!contact) return '';

    // Check for existing conversation with same participant and linked request
    const existing = conversations.find(
      (c) =>
        c.participantId === params.participantId &&
        c.linkedRequestId === (params.linkedRequestId || null),
    );
    if (existing) {
      sendMessage(existing.id, params.messageText);
      return existing.id;
    }

    const convId = `conv_${Date.now()}`;
    const now = new Date();
    const timestamp = now.toLocaleString('en-IN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    }).replace(',', '');
    const isoNow = now.toISOString();

    const firstMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId: convId,
      senderId: 'tenant_001',
      senderRole: 'tenant',
      senderName: 'You',
      text: params.messageText,
      timestamp,
      createdAt: isoNow,
      isRead: false,
      status: 'sent',
      attachments: [],
    };

    const newConv: Conversation = {
      id: convId,
      propertyId: 'prop_001',
      participantId: params.participantId,
      participantName: contact.name,
      participantRole: contact.role,
      linkedRequestId: params.linkedRequestId || null,
      linkedRequestTitle: params.linkedRequestTitle || null,
      conversationType: params.conversationType,
      lastMessage: params.messageText,
      lastMessageTime: timestamp,
      lastMessageAt: isoNow,
      unreadCount: 0,
      status: 'active',
      messages: [firstMsg],
    };

    setConversations((prev) => [newConv, ...prev]);
    setMessages((prev) => [...prev, firstMsg]);

    // TODO: Trigger push notifications for new messages.
    return convId;
  }, [conversations, sendMessage]);

  const getConversationById = useCallback(
    (id: string) => conversations.find((c) => c.id === id),
    [conversations],
  );

  const getMessagesByConversationId = useCallback(
    (conversationId: string) => messages.filter((m) => m.conversationId === conversationId),
    [messages],
  );

  return (
    <MessagingContext.Provider
      value={{
        conversations,
        messages,
        contacts: mockContacts,
        unreadCount,
        sendMessage,
        markConversationAsRead,
        createConversation,
        getConversationById,
        getMessagesByConversationId,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  return useContext(MessagingContext);
}
