import { Link } from 'react-router-dom';
import { Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/60 backdrop-blur-md border-t border-gray-200 dark:bg-dark-bg/80 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                MedAI Guardian
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-dark-muted leading-relaxed">
              Your AI-powered medical education assistant, helping you understand symptoms, reports, and medical images.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/symptom-checker', label: 'Symptom Checker' },
                { to: '/report-analyzer', label: 'Report Analyzer' },
                { to: '/image-analyzer', label: 'Image Analyzer' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-500 hover:text-primary-600 dark:text-dark-muted dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'HIPAA Compliance'].map(
                (label) => (
                  <li key={label}>
                    <span className="text-sm text-gray-500 dark:text-dark-muted cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {label}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Safety */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
              Safety
            </h4>
            <div className="flex items-start gap-2 p-3 bg-primary-50 rounded-xl dark:bg-primary-500/10">
              <ShieldCheck className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-primary-700 dark:text-primary-300 leading-relaxed">
                This tool is for educational purposes only. Always consult a
                qualified healthcare professional for medical advice.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-dark-muted">
            © {currentYear} MedAI Guardian. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-dark-muted">
            Built with ❤️ for better health education
          </p>
        </div>
      </div>
    </footer>
  );
}
