# Phase 7.1: AI Chat Component Implementation Plan

## Objective
Integrate an AI-powered assistant that can answer questions about the course content, summarize lessons, and help students learn.

## 1. UI Component (✅ Implemented)
- [x] **Route**: `app/api/ai/chat/route.ts` (Implemented).
- [x] **Component**: `components/features/ai/AIChatBox.tsx`.
- [x] **Features**:
  - Floating or Panel interface.
  - Chat history view.
  - "Ask about this lesson" context toggle.
  - Streaming responses (using Vercel AI SDK or standard streams).

## 2. Integration
- [x] **Global Access**: Add to `app/(dashboard)/layout.tsx` (Floating Action Button).
- [ ] **Context Injection**: Pass current lesson transcript/summary to the AI system prompt.

## File Structure
```
app/api/ai/chat/route.ts      # API endpoint (Streaming)
components/features/ai/
  AIChatWidget.tsx
  ChatMessage.tsx
lib/ai/
  openai.ts                   # Client configuration
```
