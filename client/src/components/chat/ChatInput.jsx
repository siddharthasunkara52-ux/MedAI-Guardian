import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

export default function ChatInput({ onSend, isLoading = false, disabled = false, isListening = false, onToggleVoice, t }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);
  const maxLength = 2000;

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
    }
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading || disabled) return;
    onSend(trimmed);
    setText('');
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-dark-border bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm p-4">
      {isListening && (
        <div className="flex items-center justify-center gap-1.5 py-2 mb-3 bg-danger-500/10 dark:bg-danger-500/20 border border-danger-500/20 rounded-xl max-w-4xl mx-auto animate-fade-in">
          <span className="text-xs font-semibold text-danger-600 dark:text-danger-400 mr-2 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-danger-500 rounded-full animate-ping" />
            {t.listening || 'Listening...'}
          </span>
          <div className="flex items-end gap-1 h-4">
            <span className="w-1 bg-danger-500 rounded-full animate-wave-slow origin-bottom"></span>
            <span className="w-1 bg-danger-500 rounded-full animate-wave-medium origin-bottom" style={{ animationDelay: '0.15s' }}></span>
            <span className="w-1 bg-danger-500 rounded-full animate-wave-fast origin-bottom" style={{ animationDelay: '0.3s' }}></span>
            <span className="w-1 bg-danger-500 rounded-full animate-wave-medium origin-bottom" style={{ animationDelay: '0.45s' }}></span>
            <span className="w-1 bg-danger-500 rounded-full animate-wave-slow origin-bottom" style={{ animationDelay: '0.6s' }}></span>
          </div>
        </div>
      )}

      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        {onToggleVoice && (
          <button
            type="button"
            onClick={onToggleVoice}
            disabled={isLoading || disabled}
            className={`p-3 rounded-xl border transition-all flex-shrink-0 cursor-pointer ${
              isListening
                ? 'bg-danger-500 text-white border-danger-500 shadow-lg shadow-danger-500/20'
                : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-200 hover:text-primary-500 hover:border-primary-400'
            }`}
            title={isListening ? t.stopListening : t.startListening}
            aria-label={isListening ? t.stopListening : t.startListening}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        )}

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, maxLength))}
            onKeyDown={handleKeyDown}
            placeholder={t.chatInputPlaceholder || 'Describe your symptoms...'}
            disabled={isLoading || disabled || isListening}
            rows={1}
            className="w-full resize-none rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card px-4 py-3 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all disabled:opacity-50"
          />
          <span className="absolute bottom-1.5 right-3 text-[10px] text-gray-300 dark:text-dark-muted">
            {text.length}/{maxLength}
          </span>
        </div>

        <button
          onClick={handleSend}
          disabled={!text.trim() || isLoading || disabled || isListening}
          className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:transform-none disabled:shadow-none cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <p className="text-[10px] text-gray-400 dark:text-dark-muted text-center mt-2">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
