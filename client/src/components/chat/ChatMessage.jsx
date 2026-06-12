import { useState } from 'react';
import { User, Bot, Copy, Check, RotateCcw } from 'lucide-react';
import Markdown from 'react-markdown';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function ChatMessage({ message, onRegenerate = null, t = {} }) {
  const { role, content, timestamp, isStreaming } = message;
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content)
      .then(() => {
        setCopied(true);
        toast.success(t.copied || 'Copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy');
      });
  };

  return (
    <div
      className={`flex gap-3 animate-fade-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-primary-500 to-primary-600'
            : 'bg-gradient-to-br from-accent-500 to-accent-600'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`relative group max-w-[82%] sm:max-w-[75%] lg:max-w-[65%] break-words ${
          isUser
            ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-sm'
            : 'glass-card rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card'
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose-medical text-gray-800 dark:text-gray-200">
            <Markdown>{content || '...'}</Markdown>
          </div>
        )}
        
        <div className="flex items-center justify-between gap-4 mt-2">
          {timestamp && (
            <p
              className={`text-[10px] ${
                isUser ? 'text-primary-100' : 'text-gray-400 dark:text-dark-muted'
              }`}
            >
              {formatDate(timestamp)}
            </p>
          )}

          {!isUser && !isStreaming && content && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleCopy}
                className="p-1 rounded text-gray-400 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-primary-500/10 transition-colors"
                title={t.copyResponse || 'Copy Response'}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-success-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="p-1 rounded text-gray-400 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-primary-500/10 transition-colors"
                  title={t.regenerate || 'Regenerate'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
