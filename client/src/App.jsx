import { useEffect, useMemo, useState, useRef } from 'react';
import { BrowserRouter, Link, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import {
  Activity,
  AlertTriangle,
  CalendarClock,
  Download,
  FileText,
  HeartPulse,
  Home,
  Image as ImageIcon,
  Languages,
  LogOut,
  Menu,
  Mic,
  Moon,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Sun,
  User,
  Volume2,
  X,
} from 'lucide-react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { chatAPI, imageAPI, reportAPI, userAPI } from './services/api';
import ChatInput from './components/chat/ChatInput';
import ChatWindow from './components/chat/ChatWindow';
import ReportUploader from './components/report/ReportUploader';
import ReportResults from './components/report/ReportResults';
import ImageUploader from './components/image/ImageUploader';
import ImageResults from './components/image/ImageResults';
import Card from './components/common/Card';
import Button from './components/common/Button';
import SafetyDisclaimer from './components/common/SafetyDisclaimer';
import { formatDate } from './utils/formatters';
const copy = {
  en: {
    dashboard: 'Dashboard',
    chat: 'AI Symptom Chat',
    reports: 'Report Analyzer',
    images: 'Image Analyzer',
    history: 'Health Timeline',
    profile: 'Profile',
    settings: 'Settings',
    totalChats: 'Total Chats',
    reportsAnalyzed: 'Reports Analyzed',
    imagesProcessed: 'Images Processed',
    riskAlerts: 'Risk Alerts',
    
    // Dashboard Page
    dashboardTitle: 'Clinical-Grade AI Health Workspace',
    dashboardSub: 'Premium Dashboard',
    activityTimeline: 'Activity Timeline',
    healthRiskScore: 'AI Health Risk Score',
    educationScore: 'education score',
    exportSummary: 'Export summary',
    loadingActivity: 'Loading your latest health activity...',
    noActivityTitle: 'No activity yet',
    noActivityText: 'Start a symptom chat or upload a report/image to build your health timeline.',
    
    // Symptom Chat Page
    chatTitle: 'AI Symptom Chat',
    chatSub: 'Structured, safety-aware medical education',
    startConversationTitle: 'Start a Conversation',
    startConversationSub: 'Describe your symptoms below and our AI assistant will help you understand what they might mean. Remember, this is for educational purposes only.',
    searchPlaceholder: 'Search messages in this chat...',
    chatInputPlaceholder: 'Describe your symptoms (e.g., dull headache, slight fever)...',
    listening: 'Listening...',
    startListening: 'Start Voice Input',
    stopListening: 'Stop Listening',
    voiceInput: 'Voice input',
    readResponse: 'Read response',
    copyResponse: 'Copy Response',
    regenerate: 'Regenerate',
    stopGeneration: 'Stop Generation',
    copied: 'Copied to clipboard',
    emergencyWarning: 'Emergency Warning',
    
    // Report Page
    reportTitle: 'Advanced Medical Report Analyzer',
    reportSub: 'PDF and text interpretation',
    analyzeAnother: 'Analyze Another Report',
    noReportTitle: 'No report analyzed yet',
    noReportSub: 'Upload a PDF or text report to generate an executive summary, abnormal values, key findings, and doctor questions.',
    cancelAnalysis: 'Cancel Analysis',
    downloadReport: 'Download Report Summary',
    analyzingReport: 'Analyzing report text... Please wait.',
    
    // Image Page
    imageTitle: 'Advanced Medical Image Analyzer',
    imageSub: 'Visual observations with clear limitations',
    noImageTitle: 'No image analyzed yet',
    noImageSub: 'Upload a skin, wound, scan, or health-related image for educational visual observations and consultation guidance.',
    analyzingImage: 'Analyzing image... Please wait.',
    confidenceLevel: 'Confidence Level',
    riskLevel: 'Risk Level',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    emergency: 'Emergency',
    
    // Timeline & Profile Pages
    timelineTitle: 'Health Timeline',
    timelineSub: 'Chats, reports, images, and alerts',
    profileTitle: 'User Profile',
    profileSub: 'Personal account details',
    fullName: 'Full name',
    email: 'Email',
    saveProfile: 'Save profile',
    
    // Settings Page
    settingsTitle: 'Settings',
    settingsSub: 'Preferences and privacy controls',
    experience: 'Experience',
    darkMode: 'Dark mode',
    dataControls: 'Data Controls',
    clearHistory: 'Clear all history',
    historyCleared: 'History cleared',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    chat: 'AI लक्षण चैट',
    reports: 'रिपोर्ट विश्लेषक',
    images: 'इमेज विश्लेषक',
    history: 'स्वास्थ्य टाइमलाइन',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्स',
    totalChats: 'कुल चैट',
    reportsAnalyzed: 'रिपोर्ट विश्लेषण',
    imagesProcessed: 'इमेज प्रोसेस्ड',
    riskAlerts: 'जोखिम अलर्ट',
    
    // Dashboard Page
    dashboardTitle: 'क्लिनिकल-ग्रेड एआई हेल्थ वर्कस्पेस',
    dashboardSub: 'प्रीमियम डैशबोर्ड',
    activityTimeline: 'गतिविधि टाइमलाइन',
    healthRiskScore: 'एआई स्वास्थ्य जोखिम स्कोर',
    educationScore: 'शिक्षा स्कोर',
    exportSummary: 'सारांश निर्यात करें',
    loadingActivity: 'आपकी नवीनतम स्वास्थ्य गतिविधि लोड हो रही है...',
    noActivityTitle: 'अभी तक कोई गतिविधि नहीं',
    noActivityText: 'अपनी स्वास्थ्य टाइमलाइन बनाने के लिए लक्षण चैट शुरू करें या रिपोर्ट/इमेज अपलोड करें।',
    
    // Symptom Chat Page
    chatTitle: 'एआई लक्षण चैट',
    chatSub: 'संरचित, सुरक्षा-जागरूक चिकित्सा शिक्षा',
    startConversationTitle: 'बातचीत शुरू करें',
    startConversationSub: 'नीचे अपने लक्षणों का वर्णन करें और हमारा एआई सहायक आपको यह समझने में मदद करेगा कि उनका क्या अर्थ हो सकता है। याद रखें, यह केवल शैक्षिक उद्देश्यों के लिए है।',
    searchPlaceholder: 'इस चैट में संदेश खोजें...',
    chatInputPlaceholder: 'अपने लक्षणों का वर्णन करें (उदा. हल्का सिरदर्द, हल्का बुखार)...',
    listening: 'सुन रहा है...',
    startListening: 'आवाज इनपुट शुरू करें',
    stopListening: 'सुनना बंद करें',
    voiceInput: 'आवाज इनपुट',
    readResponse: 'जवाब पढ़ें',
    copyResponse: 'जवाब कॉपी करें',
    regenerate: 'पुनः उत्पन्न करें',
    stopGeneration: 'उत्पादन रोकें',
    copied: 'क्लिपबोर्ड पर कॉपी किया गया',
    emergencyWarning: 'आपातकालीन चेतावनी',
    
    // Report Page
    reportTitle: 'उन्नत चिकित्सा रिपोर्ट विश्लेषक',
    reportSub: 'पीडीएफ और पाठ व्याख्या',
    analyzeAnother: 'अन्य रिपोर्ट का विश्लेषण करें',
    noReportTitle: 'अभी तक किसी रिपोर्ट का विश्लेषण नहीं किया गया',
    noReportSub: 'एक कार्यकारी सारांश, असामान्य मूल्य, मुख्य निष्कर्ष और डॉक्टर के प्रश्न उत्पन्न करने के लिए एक पीडीएफ या पाठ रिपोर्ट अपलोड करें।',
    cancelAnalysis: 'विश्लेषण रद्द करें',
    downloadReport: 'रिपोर्ट सारांश डाउनलोड करें',
    analyzingReport: 'रिपोर्ट पाठ का विश्लेषण किया जा रहा है... कृपया प्रतीक्षा करें।',
    
    // Image Page
    imageTitle: 'उन्नत चिकित्सा इमेज विश्लेषक',
    imageSub: 'स्पष्ट सीमाओं के साथ दृश्य अवलोकन',
    noImageTitle: 'अभी तक किसी इमेज का विश्लेषण नहीं किया गया',
    noImageSub: 'शैक्षिक दृश्य अवलोकन और परामर्श मार्गदर्शन के लिए त्वचा, घाव, स्कैन या स्वास्थ्य से संबंधित इमेज अपलोड करें।',
    analyzingImage: 'इमेज का विश्लेषण किया जा रहा है... कृपया प्रतीक्षा करें।',
    confidenceLevel: 'विश्वास स्तर',
    riskLevel: 'जोखिम स्तर',
    low: 'कम',
    medium: 'मध्यम',
    high: 'उच्च',
    emergency: 'आपातकालीन',
    
    // Timeline & Profile Pages
    timelineTitle: 'स्वास्थ्य टाइमलाइन',
    timelineSub: 'चैट, रिपोर्ट, इमेज और अलर्ट',
    profileTitle: 'उपयोगकर्ता प्रोफाइल',
    profileSub: 'व्यक्तिगत खाता विवरण',
    fullName: 'पूरा नाम',
    email: 'ईमेल',
    saveProfile: 'प्रोफाइल सहेजें',
    
    // Settings Page
    settingsTitle: 'सेटिंग्स',
    settingsSub: 'प्राथमिकताएं और गोपनीयता नियंत्रण',
    experience: 'अनुभव',
    darkMode: 'डार्क मोड',
    dataControls: 'डेटा नियंत्रण',
    clearHistory: 'सभी इतिहास मिटाएं',
    historyCleared: 'इतिहास मिटा दिया गया',
  },
  te: {
    dashboard: 'డాష్‌బోర్డ్',
    chat: 'AI లక్షణాల చాట్',
    reports: 'రిపోర్ట్ విశ్లేషణ',
    images: 'ఇమేజ్ విశ్లేషణ',
    history: 'ఆరోగ్య టైమ్‌లైన్',
    profile: 'ప్రొఫైల్',
    settings: 'సెట్టింగ్స్',
    totalChats: 'మొత్తం చాట్స్',
    reportsAnalyzed: 'రిపోర్ట్స్ విశ్లేషణ',
    imagesProcessed: 'ఇమేజెస్ ప్రాసెస్',
    riskAlerts: 'రిస్క్ అలర్ట్స్',
    
    // Dashboard Page
    dashboardTitle: 'క్లినికల్-గ్రేడ్ AI హెల్త్ వర్క్‌స్పేస్',
    dashboardSub: 'ప్రీమియం డాష్‌బోర్డ్',
    activityTimeline: 'కార్యకలాపాల టైమ్‌లైన్',
    healthRiskScore: 'AI హెల్త్ రిస్క్ స్కోర్',
    educationScore: 'విద్యా స్కోర్',
    exportSummary: 'సారాంశాన్ని ఎగుమతి చేయి',
    loadingActivity: 'మీ తాజా ఆరోగ్య కార్యకలాపాలు లోడ్ అవుతున్నాయి...',
    noActivityTitle: 'ఇంకా ఎటువంటి కార్యకలాపాలు లేవు',
    noActivityText: 'మీ ఆరోగ్య టైమ్‌లైన్‌ను రూపొందించడానికి ఒక లక్షణాల చాట్‌ను ప్రారంభించండి లేదా ఒక రిపోర్ట్/ఇమేజ్‌ని అప్‌లోడ్ చేయండి.',
    
    // Symptom Chat Page
    chatTitle: 'AI లక్షణాల చాట్',
    chatSub: 'నిర్మాణాత్మక, భభద్రతా-అవగాహన వైద్య విద్య',
    startConversationTitle: 'సంభాషణను ప్రారంభించండి',
    startConversationSub: 'క్రింద మీ లక్షణాలను వివరించండి మరియు మా AI సహాయకుడు అవి ఏమిటో అర్థం చేసుకోవడానికి మీకు సహాయం చేస్తుంది. గుర్తుంచుకోండి, ఇది విద్యా ప్రయోజనాల కోసం మాత్రమే.',
    searchPlaceholder: 'ఈ చాట్‌లోని సందేశాలను శోధించండి...',
    chatInputPlaceholder: 'మీ లక్షణాలను వివరించండి (ఉదా. తలనొప్పి, స్వల్ప జ్వరం)...',
    listening: 'వింటున్నది...',
    startListening: 'వాయిస్ ఇన్‌పుట్ ప్రారంభించండి',
    stopListening: 'వినడం ఆపివేయి',
    voiceInput: 'వాయిస్ ఇన్‌పుట్',
    readResponse: 'సమాధానం చదవండి',
    copyResponse: 'సమాధానం కాపీ చేయి',
    regenerate: 'మళ్లీ రూపొందించు',
    stopGeneration: 'రూపకల్పన ఆపివేయి',
    copied: 'క్లిప్‌బోర్డ్‌కు కాపీ చేయబడింది',
    emergencyWarning: 'అత్యవసర హెచ్చరిక',
    
    // Report Page
    reportTitle: 'అధునాతన వైద్య నివేదిక విశ్లేషణ',
    reportSub: 'PDF మరియు టెక్స్ట్ వ్యాఖ్యానం',
    analyzeAnother: 'మరొక నివేదికను విశ్లేషించు',
    noReportTitle: 'ఇంకా ఏ నివేదిక విశ్లేషించబడలేదు',
    noReportSub: 'సారాంశం, అసాధారణ విలువలు, కీలక ఫలితాలు మరియు డాక్టర్ ప్రశ్నలను రూపొందించడానికి PDF లేదా టెక్స్ట్ నివేదికను అప్‌లోడ్ చేయండి.',
    cancelAnalysis: 'విశ్లేషణను రద్దు చేయి',
    downloadReport: 'నివేదిక సారాంశాన్ని డౌన్‌లోడ్ చేయి',
    analyzingReport: 'నివేదిక టెక్స్ట్‌ను విశ్లేషిస్తోంది... దయచేసి వేచి ఉండండి.',
    
    // Image Page
    imageTitle: 'అధునాతన వైద్య చిత్ర విశ్లేషక',
    imageSub: 'స్పష్టమైన పరిమితులతో దృశ్య పరిశీలనలు',
    noImageTitle: 'ఇంకా ఏ చిత్రం విశ్లేషించబడలేదు',
    noImageSub: 'విద్యా దృశ్య పరిశీలనలు మరియు సంప్రదింపు మార్గదర్శకత్వం కోసం చర్మం, గాయం, స్కాన్ లేదా ఆరోగ్యానికి సంబంధించిన చిత్రాన్ని అప్‌లోడ్ చేయండి.',
    analyzingImage: 'చిత్రాన్ని విశ్లేషిస్తోంది... దయచేసి వేచి ఉండండి.',
    confidenceLevel: 'విశ్వాస స్థాయి',
    riskLevel: 'ప్రమాద స్థాయి',
    low: 'తక్కువ',
    medium: 'మధ్యస్థం',
    high: 'ఎక్కువ',
    emergency: 'అత్యవసరం',
    
    // Timeline & Profile Pages
    timelineTitle: 'ఆరోగ్య టైమ్‌లైన్',
    timelineSub: 'చాట్‌లు, నివేదికలు, చిత్రాలు మరియు హెచ్చరికలు',
    profileTitle: 'వినియోగదారు ప్రొఫైల్',
    profileSub: 'వ్యక్తిగత ఖాతా వివరాలు',
    fullName: 'పూర్తి పేరు',
    email: 'ఇమెయిల్',
    saveProfile: 'ప్రొఫైల్ సేవ్ చేయి',
    
    // Settings Page
    settingsTitle: 'సెట్టింగ్స్',
    settingsSub: 'ప్రాధాన్యతలు మరియు గోప్యతా నియంత్రణలు',
    experience: 'అనుభవం',
    darkMode: 'డార్క్ మోడ్',
    dataControls: 'డేటా నియంత్రణలు',
    clearHistory: 'చరిత్ర మొత్తాన్ని తొలగించు',
    historyCleared: 'చరిత్ర తొలగించబడింది',
  }
};

const emergencyPatterns = [
  /chest pain|heart attack|pressure in my chest/i,
  /stroke|face droop|slurred speech|weakness on one side/i,
  /breathing difficulty|can't breathe|shortness of breath/i,
  /severe bleeding|bleeding won't stop/i,
  /overdose|took too many|poison/i,
  /suicide|kill myself|self harm|end my life/i,
  /seizure|unconscious|anaphylaxis/i,
];

function isEmergencyText(text = '') {
  return emergencyPatterns.some((pattern) => pattern.test(text));
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

function AppProviders() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <AppShell />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppShell() {
  const [language, setLanguage] = useState(localStorage.getItem('medai-language') || 'en');
  const t = useMemo(() => copy[language] || copy.en, [language]);

  useEffect(() => {
    localStorage.setItem('medai-language', language);
  }, [language]);

  return (
    <Routes>
      <Route element={<PublicLayout language={language} setLanguage={setLanguage} />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout t={t} language={language} setLanguage={setLanguage} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function PublicLayout({ language, setLanguage }) {
  return (
    <>
      <TopNav language={language} setLanguage={setLanguage} />
      <Outlet />
    </>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen gradient-hero flex items-center justify-center"><div className="skeleton w-72 h-24" /></div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function TopNav({ language, setLanguage }) {
  const { isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/75 dark:bg-dark-bg/75 backdrop-blur-xl border-b border-white/40 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 font-black text-gray-900 dark:text-white">
          <span className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center"><HeartPulse className="w-5 h-5 text-white" /></span>
          MedAI Guardian
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSelect language={language} setLanguage={setLanguage} />
          <IconButton label="Toggle theme" onClick={toggleTheme} icon={isDark ? Sun : Moon} />
          {isAuthenticated ? (
            <button onClick={logout} className="btn-secondary"><LogOut className="w-4 h-4" /> Logout</button>
          ) : (
            <Link to="/login" className="btn-secondary">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}

function AuthenticatedLayout({ t, language, setLanguage }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const nav = [
    { to: '/dashboard', label: t.dashboard, icon: Home },
    { to: '/symptom-checker', label: t.chat, icon: Stethoscope },
    { to: '/report-analyzer', label: t.reports, icon: FileText },
    { to: '/image-analyzer', label: t.images, icon: ImageIcon },
    { to: '/history', label: t.history, icon: CalendarClock },
    { to: '/profile', label: t.profile, icon: User },
    { to: '/settings', label: t.settings, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-dark-bg">
      <TopNav language={language} setLanguage={setLanguage} />
      <div className="flex">
        <aside className={`${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-16 z-30 h-[calc(100vh-4rem)] w-72 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-r border-white/50 dark:border-dark-border p-4 transition-transform`}>
          <nav className="space-y-2">
            {nav.map((item) => <NavItem key={item.to} item={item} active={pathname === item.to} onClick={() => setOpen(false)} />)}
          </nav>
          <SafetyDisclaimer compact className="mt-6" />
        </aside>
        <button className="lg:hidden fixed bottom-5 right-5 z-40 p-3 rounded-full gradient-primary text-white shadow-xl" onClick={() => setOpen((value) => !value)}>
          {open ? <X /> : <Menu />}
        </button>
        <main className="flex-1 min-w-0">
          <Routes>
            <Route path="/dashboard" element={<Dashboard t={t} />} />
            <Route path="/symptom-checker" element={<SymptomChat t={t} />} />
            <Route path="/report-analyzer" element={<ReportAnalyzer t={t} />} />
            <Route path="/image-analyzer" element={<ImageAnalyzer t={t} />} />
            <Route path="/history" element={<Timeline t={t} />} />
            <Route path="/profile" element={<Profile t={t} />} />
            <Route path="/settings" element={<SettingsPage t={t} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function NavItem({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active ? 'gradient-primary text-white shadow-lg shadow-primary-500/20' : 'text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-500/10'}`}
    >
      <Icon className="w-5 h-5" />
      {item.label}
    </Link>
  );
}

function Page({ title, eyebrow, action, children }) {
  return (
    <section className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-bold text-primary-600 dark:text-primary-400">{eyebrow}</p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">{title}</h1>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Dashboard({ t }) {
  const data = useHealthData();
  const score = useMemo(() => {
    const recentAlerts = data.chats.filter((chat) => chat.isEmergency).length;
    return Math.min(100, 18 + data.chats.length * 4 + data.reports.length * 6 + data.images.length * 6 + recentAlerts * 18);
  }, [data]);
  const metrics = [
    { label: t.totalChats, value: data.chats.length, icon: Stethoscope, tone: 'primary' },
    { label: t.reportsAnalyzed, value: data.reports.length, icon: FileText, tone: 'accent' },
    { label: t.imagesProcessed, value: data.images.length, icon: ImageIcon, tone: 'success' },
    { label: t.riskAlerts, value: data.chats.filter((chat) => chat.isEmergency).length, icon: ShieldAlert, tone: 'danger' },
  ];

  return (
    <Page title="Clinical-Grade AI Health Workspace" eyebrow="Premium Dashboard" action={<ExportButton data={data} />}>
      {data.error && <StatusNotice type="error" message={data.error} />}
      {data.loading && <StatusNotice type="loading" message="Loading your latest health activity..." />}
      <EmergencyBanner data={data} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-black text-gray-900 dark:text-white">Activity Timeline</h2>
            <Activity className="w-5 h-5 text-primary-500" />
          </div>
          <TimelineList items={data.timeline.slice(0, 6)} />
        </Card>
        <Card>
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-5">AI Health Risk Score</h2>
          <div className="relative w-44 h-44 mx-auto mb-6 rounded-full grid place-items-center" style={{ background: `conic-gradient(#0ea5e9 ${score}%, #e2e8f0 0)` }}>
            <div className="w-32 h-32 rounded-full bg-white dark:bg-dark-card grid place-items-center">
              <div className="text-center">
                <p className="text-4xl font-black text-gray-900 dark:text-white">{score}</p>
                <p className="text-xs text-gray-500 dark:text-dark-muted">education score</p>
              </div>
            </div>
          </div>
          <InsightList score={score} data={data} />
        </Card>
      </div>
    </Page>
  );
}

function SymptomChat({ t }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [emergency, setEmergency] = useState(null);

  const abortControllerRef = useRef(null);
  const streamingTimerRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (streamingTimerRef.current) {
        clearInterval(streamingTimerRef.current);
      }
    };
  }, []);

  const send = async (text, isRegenerate = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (streamingTimerRef.current) {
      clearInterval(streamingTimerRef.current);
    }

    let currentMessages = messages;
    if (isRegenerate) {
      currentMessages = messages.filter((_, idx) => idx !== messages.length - 1);
    } else {
      const userMessage = { role: 'user', content: text, timestamp: new Date().toISOString() };
      currentMessages = [...messages, userMessage];
    }
    
    setMessages(currentMessages);
    if (isEmergencyText(text)) setEmergency(text);
    setLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const { data } = await chatAPI.sendSymptoms(text, {
        signal: abortControllerRef.current.signal
      });
      
      const fullResponse = data.chat.aiResponse;
      if (data.isEmergency) setEmergency(text);

      simulateStreaming(fullResponse, data.chat.timestamp, currentMessages);
    } catch (error) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        setLoading(false);
        return;
      }
      const diagnostic = error.response?.data?.code
        ? `${error.response.data.message} (${error.response.data.code})`
        : error.response?.data?.message;
      toast.error(diagnostic || 'Backend unavailable or unable to analyze symptoms');
      setLoading(false);
    }
  };

  const simulateStreaming = (fullContent, timestamp, currentMsgs) => {
    setLoading(false);
    
    setMessages([...currentMsgs, { role: 'assistant', content: '', timestamp, isStreaming: true }]);

    const words = fullContent.split(/(\s+)/);
    let wordIndex = 0;
    let currentContent = '';

    streamingTimerRef.current = setInterval(() => {
      if (wordIndex < words.length) {
        currentContent += words[wordIndex];
        wordIndex++;
        
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg && lastMsg.role === 'assistant') {
            lastMsg.content = currentContent;
          }
          return updated;
        });
      } else {
        clearInterval(streamingTimerRef.current);
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg && lastMsg.role === 'assistant') {
            lastMsg.isStreaming = false;
          }
          return updated;
        });
        abortControllerRef.current = null;
      }
    }, 25);
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (streamingTimerRef.current) {
      clearInterval(streamingTimerRef.current);
      streamingTimerRef.current = null;
    }
    setMessages((prev) => {
      const updated = [...prev];
      const lastMsg = updated[updated.length - 1];
      if (lastMsg && lastMsg.role === 'assistant') {
        lastMsg.isStreaming = false;
        if (!lastMsg.content) {
          lastMsg.content = 'Generation stopped by user.';
        }
      }
      return updated;
    });
    setLoading(false);
  };

  const regenerateResponse = () => {
    const lastUserMsg = [...messages].reverse().find(msg => msg.role === 'user');
    if (!lastUserMsg) return;
    send(lastUserMsg.content, true);
  };

  const speak = () => {
    const last = [...messages].reverse().find((message) => message.role === 'assistant');
    if (!last || !window.speechSynthesis) return toast.error('Voice output is not supported in this browser');
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(last.content.replace(/[#*_`-]/g, ' ')));
  };

  const toggleVoice = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return toast.error('Voice input is not supported in this browser');

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        const rec = new SpeechRecognition();
        recognitionRef.current = rec;
        const lang = localStorage.getItem('medai-language') || 'en';
        rec.lang = lang === 'hi' ? 'hi-IN' : lang === 'te' ? 'te-IN' : 'en-US';
        rec.continuous = false;
        rec.interimResults = false;

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        rec.onerror = (event) => {
          console.error(event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            toast.error('Microphone permission denied. Enable it in your browser settings.');
          } else {
            toast.error('Voice input error: ' + event.error);
          }
        };

        rec.onresult = (event) => {
          const text = event.results[0][0].transcript;
          if (text.trim()) {
            send(text);
          }
        };

        rec.start();
      })
      .catch((err) => {
        console.error(err);
        toast.error('Could not access microphone. Check permissions.');
      });
  };

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase();
    return messages.filter(msg => msg.content.toLowerCase().includes(q));
  }, [messages, searchQuery]);

  return (
    <Page
      title={t.chatTitle}
      eyebrow={t.chatSub}
      action={
        <div className="flex gap-2">
          <IconButton label={t.voiceInput} icon={Mic} onClick={toggleVoice} className={isListening ? 'bg-danger-500/20 text-danger-500' : ''} />
          <IconButton label={t.readResponse} icon={Volume2} onClick={speak} />
        </div>
      }
    >
      {emergency && <LargeEmergencyWarning text={emergency} onClose={() => setEmergency(null)} />}
      
      {messages.length > 0 && (
        <div className="mb-4 max-w-4xl mx-auto relative animate-fade-in">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder || 'Search messages in this chat...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              Clear
            </button>
          )}
        </div>
      )}

      <Card className="h-[72vh] flex flex-col overflow-hidden p-0 max-w-4xl mx-auto relative">
        <ChatWindow messages={filteredMessages} isLoading={loading} onRegenerate={regenerateResponse} t={t} />
        
        {(loading || messages.some(msg => msg.isStreaming)) && (
          <div className="absolute bottom-24 left-0 right-0 flex justify-center z-10">
            <button
              onClick={stopGeneration}
              className="bg-white dark:bg-dark-card border border-danger-200 dark:border-danger-900/40 text-danger-500 hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-950/20 shadow-lg rounded-full px-5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
              {t.stopGeneration || 'Stop Generation'}
            </button>
          </div>
        )}

        <ChatInput onSend={send} isLoading={loading} isListening={isListening} onToggleVoice={toggleVoice} t={t} />
      </Card>
    </Page>
  );
}

function ReportAnalyzer({ t }) {
  const [result, setResult] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  const upload = async (file) => {
    const formData = new FormData();
    formData.append('report', file);
    setName(file.name);
    setLoading(true);
    setResult(null);

    abortControllerRef.current = new AbortController();

    try {
      const { data } = await reportAPI.analyzeReport(formData, {
        signal: abortControllerRef.current.signal
      });
      setResult(data.analysis.aiResponse);
      toast.success(t.reportsAnalyzed || 'Report analyzed');
    } catch (error) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        toast.error('Analysis cancelled');
        setName('');
        return;
      }
      toast.error(error.response?.data?.message || 'Unable to analyze report');
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const cancelAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <Page title={t.reportTitle} eyebrow={t.reportSub}>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-4 space-y-4">
          <Card>
            <ReportUploader onUpload={upload} isLoading={loading} />
          </Card>
          
          {loading && (
            <Card className="border border-primary-100 dark:border-primary-900/40 bg-primary-50/10 dark:bg-primary-950/5 p-5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-ping"></div>
                <p className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                  {t.analyzingReport || 'Analyzing report...'}
                </p>
              </div>
              <div className="w-full bg-gray-100 dark:bg-dark-border h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-primary-500 h-full rounded-full animate-[shimmer_1.5s_infinite]" style={{ width: '70%', backgroundSize: '200% 100%' }}></div>
              </div>
              <button
                onClick={cancelAnalysis}
                className="mt-4 w-full py-2 px-4 rounded-xl border border-danger-200 dark:border-danger-900/40 text-danger-500 hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-950/20 text-xs font-semibold transition-colors cursor-pointer"
              >
                {t.cancelAnalysis || 'Cancel Analysis'}
              </button>
            </Card>
          )}
        </div>

        <div className="xl:col-span-8">
          {loading ? (
            <div className="space-y-4">
              <Card className="animate-pulse">
                <div className="h-4 w-1/4 bg-gray-200 dark:bg-dark-border rounded mb-3"></div>
                <div className="h-3 w-3/4 bg-gray-100 dark:bg-dark-border rounded mb-2"></div>
                <div className="h-3 w-5/6 bg-gray-100 dark:bg-dark-border rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-gray-100 dark:bg-dark-border rounded"></div>
              </Card>
              <Card className="animate-pulse">
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-dark-border rounded mb-3"></div>
                <div className="h-3 w-full bg-gray-100 dark:bg-dark-border rounded mb-2"></div>
                <div className="h-3 w-2/3 bg-gray-100 dark:bg-dark-border rounded"></div>
              </Card>
            </div>
          ) : result ? (
            <ReportResults results={result} reportName={name} />
          ) : (
            <EmptyState
              icon={FileText}
              title={t.noReportTitle}
              text={t.noReportSub}
            />
          )}
        </div>
      </div>
    </Page>
  );
}

function ImageAnalyzer({ t }) {
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const upload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    setName(file.name);
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
    setResult(null);
    setLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const { data } = await imageAPI.analyzeImage(formData, {
        signal: abortControllerRef.current.signal
      });
      setResult(data.analysis.aiResponse);
      toast.success(t.imagesProcessed || 'Image analyzed');
    } catch (error) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        toast.error('Analysis cancelled');
        setName('');
        setPreview(null);
        return;
      }
      toast.error(error.response?.data?.message || 'Unable to analyze image');
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const cancelAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <Page title={t.imageTitle} eyebrow={t.imageSub}>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-4 space-y-4">
          <Card>
            <ImageUploader onUpload={upload} isLoading={loading} />
          </Card>

          {loading && (
            <Card className="border border-primary-100 dark:border-primary-900/40 bg-primary-50/10 dark:bg-primary-950/5 p-5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-ping"></div>
                <p className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                  {t.analyzingImage || 'Analyzing image...'}
                </p>
              </div>
              <div className="w-full bg-gray-100 dark:bg-dark-border h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-primary-500 h-full rounded-full animate-[shimmer_1.5s_infinite]" style={{ width: '70%', backgroundSize: '200% 100%' }}></div>
              </div>
              <button
                onClick={cancelAnalysis}
                className="mt-4 w-full py-2 px-4 rounded-xl border border-danger-200 dark:border-danger-900/40 text-danger-500 hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-950/20 text-xs font-semibold transition-colors cursor-pointer"
              >
                {t.cancelAnalysis || 'Cancel Analysis'}
              </button>
            </Card>
          )}
        </div>

        <div className="xl:col-span-8">
          {loading ? (
            <div className="space-y-4">
              <Card className="animate-pulse">
                <div className="h-4 w-1/4 bg-gray-200 dark:bg-dark-border rounded mb-3"></div>
                <div className="h-3 w-3/4 bg-gray-100 dark:bg-dark-border rounded mb-2"></div>
                <div className="h-3 w-5/6 bg-gray-100 dark:bg-dark-border rounded mb-2"></div>
              </Card>
            </div>
          ) : result ? (
            <ImageResults results={result} imageUrl={preview} t={t} />
          ) : (
            <EmptyState
              icon={ImageIcon}
              title={t.noImageTitle}
              text={t.noImageSub}
            />
          )}
        </div>
      </div>
    </Page>
  );
}

function Timeline({ t }) {
  const data = useHealthData();
  return (
    <Page title={t.timelineTitle} eyebrow={t.timelineSub}>
      {data.error && <StatusNotice type="error" message={data.error} />}
      <Card>
        {data.loading ? <TimelineSkeleton /> : <TimelineList items={data.timeline} />}
      </Card>
    </Page>
  );
}

function Profile({ t }) {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [loading, setLoading] = useState(false);

  const save = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await userAPI.updateProfile(form);
      updateUser(data.user);
      toast.success(t.profileTitle + ' updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title={t.profileTitle} eyebrow={t.profileSub}>
      <Card className="max-w-2xl">
        <form onSubmit={save} className="space-y-4">
          <Field label={t.fullName} value={form.name} onChange={(value) => setForm((state) => ({ ...state, name: value }))} />
          <Field label={t.email} type="email" value={form.email} onChange={(value) => setForm((state) => ({ ...state, email: value }))} />
          <Button type="submit" isLoading={loading}>{t.saveProfile}</Button>
        </form>
      </Card>
    </Page>
  );
}

function SettingsPage({ t }) {
  const { isDark, toggleTheme } = useTheme();
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const clearHistory = async () => {
    if (!confirm(t.clearHistory + '?')) return;
    try {
      await userAPI.clearHistory();
      toast.success(t.historyCleared);
      navigate('/dashboard');
    } catch {
      toast.error('Unable to clear history');
    }
  };

  const syncTheme = async () => {
    toggleTheme();
    try {
      const { data } = await userAPI.updateSettings({ darkMode: !isDark });
      updateUser({ settings: data.settings });
    } catch {
      toast.error('Theme saved locally, but server sync failed');
    }
  };

  return (
    <Page title={t.settingsTitle} eyebrow={t.settingsSub}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-black text-gray-900 dark:text-white mb-4">{t.experience}</h2>
          <button onClick={syncTheme} className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card">
            <span className="font-semibold text-gray-700 dark:text-gray-200">{t.darkMode}</span>
            {isDark ? <Moon className="text-primary-500" /> : <Sun className="text-warning-500" />}
          </button>
        </Card>
        <Card>
          <h2 className="font-black text-gray-900 dark:text-white mb-4">{t.dataControls}</h2>
          <Button variant="danger" onClick={clearHistory} icon={AlertTriangle}>{t.clearHistory}</Button>
        </Card>
      </div>
    </Page>
  );
}

function useHealthData() {
  const [state, setState] = useState({ chats: [], reports: [], images: [], timeline: [], loading: true, error: '' });

  useEffect(() => {
    let alive = true;
    Promise.allSettled([chatAPI.getHistory(), reportAPI.getHistory(), imageAPI.getHistory()]).then((results) => {
      if (!alive) return;
      const failures = results.filter((result) => result.status === 'rejected').length;
      const chats = results[0].value?.data?.chats || [];
      const reports = results[1].value?.data?.analyses || [];
      const images = results[2].value?.data?.analyses || [];
      const timeline = [
        ...chats.map((item) => ({ ...item, kind: item.isEmergency ? 'Risk Alert' : 'Symptom Chat', title: item.userMessage })),
        ...reports.map((item) => ({ ...item, kind: 'Report', title: item.originalName })),
        ...images.map((item) => ({ ...item, kind: 'Image', title: item.originalName })),
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setState({
        chats,
        reports,
        images,
        timeline,
        loading: false,
        error: failures ? 'Some health activity could not be loaded. Please refresh or try again later.' : '',
      });
    });
    return () => { alive = false; };
  }, []);

  return state;
}

function StatusNotice({ type, message }) {
  const isError = type === 'error';
  return (
    <div className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium ${
      isError
        ? 'border-danger-200 bg-danger-50 text-danger-700 dark:border-danger-900/60 dark:bg-danger-950/30 dark:text-danger-200'
        : 'border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-900/60 dark:bg-primary-950/30 dark:text-primary-200'
    }`}>
      {message}
    </div>
  );
}

function TimelineSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex gap-3 p-3 rounded-xl bg-primary-50/70 dark:bg-dark-bg/50">
          <div className="skeleton w-10 h-10 rounded-xl" />
          <div className="flex-1 space-y-2 py-1">
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-3 w-56 max-w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MetricCard({ metric }) {
  const Icon = metric.icon;
  return (
    <Card hover>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-dark-muted">{metric.label}</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{metric.value}</p>
        </div>
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center"><Icon className="w-6 h-6 text-white" /></div>
      </div>
    </Card>
  );
}

function TimelineList({ items }) {
  if (!items.length) return <EmptyState icon={CalendarClock} title="No activity yet" text="Start a symptom chat or upload a report/image to build your health timeline." />;
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={`${item.kind}-${item.id}`} className="flex gap-3 p-3 rounded-xl bg-primary-50/70 dark:bg-dark-bg/50">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.kind === 'Risk Alert' ? 'bg-danger-500' : 'bg-primary-500'}`}>
            {item.kind === 'Report' ? <FileText className="text-white w-5 h-5" /> : item.kind === 'Image' ? <ImageIcon className="text-white w-5 h-5" /> : <Activity className="text-white w-5 h-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-900 dark:text-white truncate">{item.kind}</p>
            <p className="text-sm text-gray-500 dark:text-dark-muted truncate">{item.title}</p>
            <p className="text-xs text-gray-400 dark:text-dark-muted">{formatDate(item.timestamp)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmergencyBanner({ data }) {
  const alert = data.chats.find((chat) => chat.isEmergency);
  if (!alert) return null;
  return <LargeEmergencyWarning text={alert.userMessage} compact />;
}

function LargeEmergencyWarning({ text, onClose, compact = false }) {
  return (
    <div className={`mb-6 rounded-2xl border border-danger-400/40 bg-danger-500 text-white shadow-xl shadow-danger-500/20 ${compact ? 'p-5' : 'p-6'}`}>
      <div className="flex items-start gap-4">
        <ShieldAlert className="w-9 h-9 flex-shrink-0" />
        <div className="flex-1">
          <h2 className="text-2xl font-black">Emergency Warning</h2>
          <p className="mt-2 text-danger-50">Your message may describe a medical emergency: "{text}". Call local emergency services now or go to the nearest emergency department. In the US, call 911. For suicide or self-harm crisis support in the US, call or text 988.</p>
        </div>
        {onClose && <button onClick={onClose}><X className="w-5 h-5" /></button>}
      </div>
    </div>
  );
}

function InsightList({ score, data }) {
  const insights = [
    data.chats.length ? 'Prepare a concise symptom timeline before your doctor visit.' : 'Start a symptom chat to build your first health insight.',
    data.reports.length ? 'Report summaries are ready for doctor visit preparation.' : 'Upload lab reports to extract abnormal values and doctor questions.',
    score > 70 ? 'Several risk signals exist. Prioritize professional medical review.' : 'Current activity suggests routine education-focused follow-up.',
  ];
  return <ul className="space-y-3">{insights.map((item) => <li key={item} className="flex gap-2 text-sm text-gray-600 dark:text-gray-300"><Sparkles className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" />{item}</li>)}</ul>;
}

function ExportButton({ data }) {
  const exportReport = () => {
    const recentActivity = data.timeline
      .slice(0, 10)
      .map((item) => `<p><strong>${escapeHtml(item.kind)}</strong>: ${escapeHtml(item.title)}</p>`)
      .join('');
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>MedAI Guardian Summary</title></head><body><h1>Doctor Visit Preparation Summary</h1><p>Total chats: ${data.chats.length}</p><p>Reports analyzed: ${data.reports.length}</p><p>Images processed: ${data.images.length}</p><h2>Recent Activity</h2>${recentActivity}<p>This summary is educational only and not a diagnosis.</p></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'medai-guardian-doctor-summary.html';
    link.click();
    URL.revokeObjectURL(url);
  };
  return <Button icon={Download} onClick={exportReport}>Export summary</Button>;
}

function LanguageSelect({ language, setLanguage }) {
  return (
    <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white/70 dark:bg-dark-card/70">
      <Languages className="w-4 h-4 text-primary-500" />
      <select value={language} onChange={(event) => setLanguage(event.target.value)} className="bg-transparent text-sm focus:outline-none">
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="te">Telugu</option>
      </select>
    </label>
  );
}

function IconButton({ label, icon: Icon, ...props }) {
  return <button title={label} aria-label={label} className="p-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white/70 dark:bg-dark-card/70 text-gray-700 dark:text-gray-200 hover:text-primary-500 transition-colors" {...props}><Icon className="w-5 h-5" /></button>;
}

function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="glass-card p-8 text-center">
      <Icon className="w-10 h-10 text-primary-500 mx-auto mb-3" />
      <h3 className="text-lg font-black text-gray-900 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-dark-muted mt-2 max-w-md mx-auto">{text}</p>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 dark:border-dark-border px-4 py-3 bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
    </label>
  );
}

export default AppProviders;
