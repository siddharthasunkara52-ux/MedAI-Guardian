import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X } from 'lucide-react';

export default function SafetyDisclaimer({ compact = false, className = '' }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 ${className}`}
      >
        <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
          For educational purposes only. Not a substitute for professional medical advice.
        </p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`relative flex items-start gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 ${className}`}
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-800 shrink-0">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 pr-8">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
            Medical Disclaimer
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
            This AI Medical Assistant is intended for educational and informational purposes only. It
            does not provide medical diagnosis, treatment, or professional healthcare advice. Always
            consult a qualified healthcare professional for medical concerns.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 p-1 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
