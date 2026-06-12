import { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { MessageSquare, Bot } from 'lucide-react';

export default function ChatWindow({ messages = [], isLoading = false, onRegenerate = null, t = {} }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="w-20 h-20 rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mb-6 animate-float">
          <MessageSquare className="w-10 h-10 text-primary-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          {t.startConversationTitle || 'Start a Conversation'}
        </h3>
        <p className="text-sm text-gray-500 dark:text-dark-muted max-w-md leading-relaxed">
          {t.startConversationSub || 'Describe your symptoms below...'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
      {messages.map((msg, i) => (
        <ChatMessage 
          key={i} 
          message={msg} 
          onRegenerate={i === messages.length - 1 && msg.role === 'assistant' ? onRegenerate : null}
          t={t}
        />
      ))}
      {isLoading && (
        <div className="flex justify-start animate-fade-in">
          <div className="flex gap-3 flex-row">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-accent-500 to-accent-600">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="glass-card rounded-2xl rounded-tl-none px-5 py-3.5 border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-400 dark:bg-dark-muted rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
              <span className="w-2 h-2 bg-gray-400 dark:bg-dark-muted rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
              <span className="w-2 h-2 bg-gray-400 dark:bg-dark-muted rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
