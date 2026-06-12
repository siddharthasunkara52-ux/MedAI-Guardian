import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  FileText,
  ScanEye,
  ShieldAlert,
  Stethoscope,
  ArrowRight,
  Clock,
  Activity,
  Download,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { chatAPI, reportAPI, imageAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { formatDate, truncateText } from '../utils/formatters';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [reportHistory, setReportHistory] = useState([]);
  const [imageHistory, setImageHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [chats, reports, images] = await Promise.allSettled([
          chatAPI.getHistory(),
          reportAPI.getHistory(),
          imageAPI.getHistory(),
        ]);
        if (chats.status === 'fulfilled') setChatHistory(chats.value.data?.chats || chats.value.data || []);
        if (reports.status === 'fulfilled') setReportHistory(reports.value.data?.reports || reports.value.data || []);
        if (images.status === 'fulfilled') setImageHistory(images.value.data?.images || images.value.data || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const emergencyCount = Array.isArray(chatHistory)
    ? chatHistory.filter((c) => c.isEmergency).length
    : 0;

  const statCards = [
    {
      icon: MessageSquare,
      value: Array.isArray(chatHistory) ? chatHistory.length : 0,
      label: 'Total Conversations',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
    },
    {
      icon: FileText,
      value: Array.isArray(reportHistory) ? reportHistory.length : 0,
      label: 'Reports Analyzed',
      color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400',
    },
    {
      icon: ScanEye,
      value: Array.isArray(imageHistory) ? imageHistory.length : 0,
      label: 'Images Analyzed',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
    },
    {
      icon: ShieldAlert,
      value: emergencyCount,
      label: 'Risk Alerts',
      color: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
    },
  ];

  const quickActions = [
    {
      icon: Stethoscope,
      title: 'Symptom Checker',
      desc: 'Chat with AI about your symptoms',
      to: '/symptom-checker',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
    },
    {
      icon: FileText,
      title: 'Report Analyzer',
      desc: 'Upload and analyze medical reports',
      to: '/report-analyzer',
      color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400',
    },
    {
      icon: ScanEye,
      title: 'Image Analyzer',
      desc: 'Analyze medical images with AI',
      to: '/image-analyzer',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
    },
  ];

  // Build recent activity from all sources
  const recentActivity = [
    ...((Array.isArray(chatHistory) ? chatHistory : []).map((c) => ({
      type: 'chat',
      title: truncateText(c.symptoms || c.userMessage || 'Symptom check', 60),
      date: c.createdAt || c.date,
      icon: MessageSquare,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400',
      isEmergency: c.isEmergency,
    }))),
    ...((Array.isArray(reportHistory) ? reportHistory : []).map((r) => ({
      type: 'report',
      title: truncateText(r.fileName || r.originalName || 'Report analysis', 60),
      date: r.createdAt || r.date,
      icon: FileText,
      color: 'text-teal-600 bg-teal-100 dark:bg-teal-900/40 dark:text-teal-400',
    }))),
    ...((Array.isArray(imageHistory) ? imageHistory : []).map((img) => ({
      type: 'image',
      title: truncateText(img.fileName || img.originalName || 'Image analysis', 60),
      date: img.createdAt || img.date,
      icon: ScanEye,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-400',
    }))),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  // Health score (cosmetic)
  const totalActivities =
    (Array.isArray(chatHistory) ? chatHistory.length : 0) +
    (Array.isArray(reportHistory) ? reportHistory.length : 0) +
    (Array.isArray(imageHistory) ? imageHistory.length : 0);
  const healthScore = Math.min(100, totalActivities * 5 + 40);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={fadeUp} custom={0} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name || 'User'} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's an overview of your health activity
          </p>
        </div>
        <Button variant="outline" size="sm" icon={Download}>
          Export Summary
        </Button>
      </motion.div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => (
            <motion.div key={stat.label} variants={fadeUp} custom={idx}>
              <Card>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Quick Actions + Health Score */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div variants={fadeUp} className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link key={action.to} to={action.to}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm h-full"
                >
                  <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${action.color} mb-3`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{action.desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-blue-600 dark:text-blue-400 text-sm font-medium">
                    Get started <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Health Score */}
        <motion.div variants={fadeUp}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            AI Health Insight
          </h2>
          <Card className="flex flex-col items-center justify-center text-center">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-gray-100 dark:text-gray-700"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                  animate={{
                    strokeDashoffset: 2 * Math.PI * 52 * (1 - healthScore / 100),
                  }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{healthScore}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Score</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Based on your engagement and health monitoring activity
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={fadeUp}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recentActivity.length === 0 ? (
          <Card className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No activity yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Start by checking your symptoms or uploading a report
            </p>
          </Card>
        ) : (
          <Card padding="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {recentActivity.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-400">{formatDate(item.date)}</p>
                    </div>
                  </div>
                  {item.isEmergency && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 rounded-full">
                      Emergency
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
}
