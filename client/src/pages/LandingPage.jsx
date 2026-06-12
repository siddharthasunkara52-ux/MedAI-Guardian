import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartPulse,
  Stethoscope,
  FileText,
  ScanEye,
  ShieldAlert,
  Pill,
  BookOpen,
  Brain,
  Shield,
  Activity,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  Sparkles,
  Globe,
  Mail,
  Share2,
  MessageSquare,
  Upload,
  Zap,
} from 'lucide-react';
import Button from '../components/common/Button';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const features = [
  {
    icon: Stethoscope,
    title: 'Symptom Checker',
    desc: 'Chat-based medical assistance with intelligent follow-up questions and detailed insights.',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  },
  {
    icon: FileText,
    title: 'Medical Report Analyzer',
    desc: 'Upload PDF reports and get AI-powered plain-language explanations of complex medical data.',
    color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400',
  },
  {
    icon: ScanEye,
    title: 'Medical Image Analysis',
    desc: 'Upload medical images for AI interpretation, observations, and educational commentary.',
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
  },
  {
    icon: ShieldAlert,
    title: 'Emergency Alert Detection',
    desc: 'Automatic detection of red-flag symptoms with immediate warnings and safety guidance.',
    color: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
  },
  {
    icon: Pill,
    title: 'Medicine Information',
    desc: 'Get information about medications, usage, side effects, interactions, and precautions.',
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
  },
  {
    icon: BookOpen,
    title: 'Health Education',
    desc: 'Preventive healthcare guidance, wellness tips, and health literacy resources.',
    color: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400',
  },
];

const stats = [
  { value: '50K+', label: 'Reports Analyzed' },
  { value: '100K+', label: 'Symptoms Checked' },
  { value: '99.2%', label: 'Response Accuracy' },
  { value: '25K+', label: 'Active Users' },
];

const steps = [
  {
    num: '01',
    title: 'Describe Symptoms',
    desc: 'Tell our AI about your symptoms or upload medical documents for analysis.',
    icon: MessageSquare,
  },
  {
    num: '02',
    title: 'AI Analysis',
    desc: 'Our AI processes your input using advanced medical knowledge bases.',
    icon: Brain,
  },
  {
    num: '03',
    title: 'Get Insights',
    desc: 'Receive educational insights and know when to consult a doctor.',
    icon: Sparkles,
  },
];

const floatingIcons = [
  { Icon: HeartPulse, x: 60, y: 40, size: 48, delay: 0, color: 'text-red-400' },
  { Icon: Brain, x: 200, y: 80, size: 40, delay: 0.3, color: 'text-purple-400' },
  { Icon: Stethoscope, x: 40, y: 200, size: 36, delay: 0.6, color: 'text-blue-400' },
  { Icon: Shield, x: 240, y: 220, size: 32, delay: 0.9, color: 'text-teal-400' },
  { Icon: Activity, x: 150, y: 300, size: 44, delay: 1.2, color: 'text-green-400' },
  { Icon: Pill, x: 280, y: 140, size: 30, delay: 0.5, color: 'text-amber-400' },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 bg-blue-600 rounded-xl">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                MedAI <span className="text-blue-600">Guardian</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                How It Works
              </a>
              <a
                href="#safety"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Safety
              </a>
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" icon={ArrowRight}>
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800"
          >
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Features
              </a>
              <a href="#how-it-works" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                How It Works
              </a>
              <a href="#safety" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Safety
              </a>
              <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <Link to="/login" className="flex-1">
                  <Button variant="outline" size="sm" fullWidth>
                    Log In
                  </Button>
                </Link>
                <Link to="/register" className="flex-1">
                  <Button size="sm" fullWidth>
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
        {/* Subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white to-teal-50/40 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
              <motion.div variants={fadeUp} custom={0}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered Healthcare Assistant
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight"
              >
                Your Personal{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  AI Medical
                </span>{' '}
                Assistant
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl"
              >
                Analyze symptoms, understand medical reports, and get healthcare guidance powered by
                advanced AI. Your health companion for informed decisions.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" icon={MessageSquare}>
                    Start Consultation
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg" icon={Upload}>
                    Upload Medical Report
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={4}
                className="flex items-center gap-6 pt-2"
              >
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  HIPAA Compliant
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  256-bit Encryption
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Free to Use
                </div>
              </motion.div>
            </motion.div>

            {/* Right – floating icons illustration */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden lg:block relative h-[420px]"
            >
              {/* Background circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 dark:from-blue-900/20 dark:to-teal-900/20 opacity-60" />
              </div>

              {/* Floating icons */}
              {floatingIcons.map(({ Icon, x, y, size, delay, color }, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + delay, type: 'spring', stiffness: 200 }}
                  className="absolute"
                  style={{ left: x, top: y }}
                >
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{
                      duration: 3 + idx * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50"
                  >
                    <Icon className={`${color}`} style={{ width: size * 0.5, height: size * 0.5 }} />
                  </motion.div>
                </motion.div>
              ))}

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="flex items-center justify-center w-24 h-24 bg-blue-600 rounded-3xl shadow-xl shadow-blue-600/30"
                >
                  <HeartPulse className="w-12 h-12 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium"
            >
              <Zap className="w-4 h-4" />
              Features
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white"
            >
              Everything You Need for Health Insights
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              Comprehensive AI-powered tools designed to help you understand your health better.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}
                className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-shadow"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white"
            >
              How It Works
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-lg text-gray-600 dark:text-gray-400"
            >
              Three simple steps to get started with your health insights.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8 relative"
          >
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-teal-400 dark:from-blue-800 dark:via-blue-600 dark:to-teal-600" />

            {steps.map((step, idx) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                custom={idx}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30 mb-6">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest mb-2">
                  STEP {step.num}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Safety Section ── */}
      <section id="safety" className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeUp}
            className="relative p-8 sm:p-12 bg-gradient-to-br from-blue-50 to-blue-100/60 dark:from-blue-900/20 dark:to-blue-900/10 rounded-3xl border border-blue-200 dark:border-blue-800"
          >
            <div className="flex flex-col items-center text-center gap-6">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-2xl">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Your Safety Is Our Priority
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                MedAI Guardian is designed for educational and informational purposes only. It does
                not replace professional medical advice, diagnosis, or treatment. Always consult a
                qualified healthcare professional for any medical concerns. In case of a medical
                emergency, call your local emergency number immediately.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  End-to-end encrypted
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  No data sharing
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Privacy focused
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                  <HeartPulse className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  MedAI Guardian
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
                AI-powered healthcare assistant providing educational health insights, symptom
                analysis, and medical report interpretation.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {['Features', 'How It Works', 'Safety', 'Contact'].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service', 'Disclaimer'].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} MedAI Guardian. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {[Globe, Mail, Share2].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
