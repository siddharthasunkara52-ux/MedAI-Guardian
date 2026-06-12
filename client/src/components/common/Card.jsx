import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'p-6',
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' } : {}}
      className={`
        bg-white dark:bg-gray-800 rounded-2xl shadow-sm
        border border-gray-100 dark:border-gray-700
        ${padding}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
