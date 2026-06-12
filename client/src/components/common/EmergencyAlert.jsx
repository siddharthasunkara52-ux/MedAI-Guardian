import { motion } from 'framer-motion';
import { ShieldAlert, Phone } from 'lucide-react';
import Button from './Button';

export default function EmergencyAlert({ keywords = [], onAcknowledge }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl border-2 border-red-400 bg-red-50 dark:bg-red-900/30 dark:border-red-600 p-6"
    >
      {/* Pulsing border effect */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-2xl border-2 border-red-500 pointer-events-none"
      />

      <div className="relative flex flex-col items-center text-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-800"
        >
          <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
        </motion.div>

        <div>
          <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
            Potential Medical Emergency Detected
          </h3>
          <p className="text-red-700 dark:text-red-300 leading-relaxed max-w-lg mx-auto">
            Your symptoms may indicate a medical emergency. Please contact emergency services or
            visit a hospital immediately. Do not rely on this AI for emergency medical situations.
          </p>
        </div>

        {keywords.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {keywords.map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1 text-sm font-medium bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 px-5 py-3 bg-red-100 dark:bg-red-800/50 rounded-xl">
          <Phone className="w-5 h-5 text-red-700 dark:text-red-300" />
          <span className="text-lg font-bold text-red-800 dark:text-red-200">
            Call 911 (US) or your local emergency number
          </span>
        </div>

        <Button variant="danger" onClick={onAcknowledge} className="mt-2">
          I Understand — Continue Anyway
        </Button>
      </div>
    </motion.div>
  );
}
