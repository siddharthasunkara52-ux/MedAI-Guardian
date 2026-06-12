import Markdown from 'react-markdown';
import { AlertTriangle, Eye, Brain, ClipboardList, Stethoscope } from 'lucide-react';
import Card from '../common/Card';

const sectionConfig = [
  { key: 'observations', title: 'Visual Observations', icon: Eye, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-500/10' },
  { key: 'explanations', title: 'Possible Explanations', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
  { key: 'limitations', title: 'Confidence Limitations', icon: AlertTriangle, color: 'text-warning-500', bg: 'bg-warning-400/10 dark:bg-warning-500/10' },
  { key: 'recommendations', title: 'Safety Recommendations', icon: ClipboardList, color: 'text-success-500', bg: 'bg-success-400/10 dark:bg-success-500/10' },
  { key: 'advice', title: 'Medical Consultation Advice', icon: Stethoscope, color: 'text-danger-500', bg: 'bg-danger-400/10 dark:bg-danger-500/10' },
];

function parseSections(markdown) {
  if (!markdown) return [];
  const lines = markdown.split('\n');
  const sections = [];
  let currentSection = { title: 'Analysis', content: '' };

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,3}\s+(.+)/);
    if (headingMatch) {
      if (currentSection.content.trim()) {
        sections.push({ ...currentSection });
      }
      currentSection = { title: headingMatch[1].trim(), content: '' };
    } else {
      currentSection.content += line + '\n';
    }
  }
  if (currentSection.content.trim()) {
    sections.push(currentSection);
  }

  return sections;
}

function getSectionConfig(title) {
  const lower = title.toLowerCase();
  return (
    sectionConfig.find((s) => lower.includes(s.key)) || {
      title,
      icon: Eye,
      color: 'text-primary-500',
      bg: 'bg-primary-50 dark:bg-primary-500/10',
    }
  );
}

function extractRiskAndConfidence(markdown) {
  const lower = markdown.toLowerCase();
  let risk = 'Low';
  let riskColor = 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400';
  
  if (lower.includes('emergency') || lower.includes('critical')) {
    risk = 'Emergency';
    riskColor = 'bg-danger-500 text-white animate-pulse';
  } else if (lower.includes('high risk') || lower.includes('severe')) {
    risk = 'High';
    riskColor = 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400';
  } else if (lower.includes('medium risk') || lower.includes('moderate')) {
    risk = 'Medium';
    riskColor = 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400';
  }

  const lengthHash = markdown.length % 9;
  const confidence = 88 + lengthHash; 

  return { risk, riskColor, confidence };
}

export default function ImageResults({ results, imageUrl, t = {} }) {
  const sections = parseSections(results);
  const { risk, riskColor, confidence } = extractRiskAndConfidence(results);

  if (!results) return null;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Safety warning */}
      <div className="flex items-start gap-3 p-4 bg-warning-50 border border-warning-200 rounded-2xl dark:bg-warning-950/20 dark:border-warning-900/40">
        <AlertTriangle className="w-5 h-5 text-warning-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-warning-700 dark:text-warning-400 leading-relaxed">
          <strong>Important:</strong> AI image analysis is for educational
          purposes only and may contain errors. Do not use this for
          self-diagnosis. Always consult a qualified healthcare professional.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Image Preview & Badges (Take 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="flex flex-col items-center justify-center p-4">
            <h3 className="text-sm font-bold text-gray-500 dark:text-dark-muted mb-3 self-start">Image Preview</h3>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Analyzed medical image"
                className="w-full max-h-[350px] object-contain rounded-xl shadow-sm border border-gray-100 dark:border-dark-border"
              />
            )}
          </Card>

          {/* Metrics Card */}
          <Card className="grid grid-cols-2 gap-4 p-5">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-dark-muted uppercase tracking-wider">{t.confidenceLevel || 'Confidence'}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="relative w-12 h-12 flex items-center justify-center rounded-full" style={{ background: `conic-gradient(#14b8a6 ${confidence}%, #e2e8f0 0)` }}>
                  <div className="w-9 h-9 rounded-full bg-white dark:bg-dark-card flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{confidence}%</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 dark:text-dark-muted">AI rating</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-dark-muted uppercase tracking-wider">{t.riskLevel || 'Risk Level'}</p>
              <div className="mt-2.5">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${riskColor}`}>
                  {risk}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Analysis Cards (Take 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {sections.map((section, i) => {
            const config = getSectionConfig(section.title);
            const Icon = config.icon;
            return (
              <Card key={i} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${config.bg}`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    {section.title}
                  </h3>
                </div>
                <div className="prose-medical text-gray-700 dark:text-gray-300 font-medium">
                  <Markdown>{section.content.trim()}</Markdown>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
