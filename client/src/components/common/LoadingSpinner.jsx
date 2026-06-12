import { motion } from 'framer-motion';

const sizeMap = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-[3px]',
  lg: 'w-12 h-12 border-4',
};

export default function LoadingSpinner({ size = 'md', text = '' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`
          rounded-full border-blue-600 border-t-transparent
          ${sizeMap[size] || sizeMap.md}
        `}
      />
      {text && (
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {text}
        </p>
      )}
    </div>
  );
}
