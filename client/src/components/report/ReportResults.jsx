import Markdown from 'react-markdown';
import {
  FileText,
  Search,
  AlertTriangle,
  Brain,
  ClipboardList,
  Stethoscope,
  Download
} from 'lucide-react';
import Card from '../common/Card';

const sectionConfig = [
  { key: 'summary', title: 'Summary', icon: FileText, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-500/10' },
  { key: 'key findings', title: 'Key Findings', icon: Search, color: 'text-accent-500', bg: 'bg-accent-400/10 dark:bg-accent-500/10' },
  { key: 'abnormal', title: 'Abnormal Values', icon: AlertTriangle, color: 'text-danger-500', bg: 'bg-danger-50 dark:bg-danger-950/20' },
  { key: 'possible meaning', title: 'Possible Meaning', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
  { key: 'recommendation', title: 'Recommendations', icon: ClipboardList, color: 'text-success-500', bg: 'bg-success-400/10 dark:bg-success-500/10' },
  { key: 'doctor', title: 'Doctor Consultation Advice', icon: Stethoscope, color: 'text-danger-500', bg: 'bg-danger-400/10 dark:bg-danger-500/10' },
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
      icon: FileText,
      color: 'text-primary-500',
      bg: 'bg-primary-50 dark:bg-primary-500/10',
    }
  );
}

export default function ReportResults({ results, reportName }) {
  const sections = parseSections(results);

  if (!results) return null;

  const handleDownload = () => {
    const title = reportName ? `Analysis of ${reportName}` : 'Medical Report Analysis';
    const bodyContent = sections.map(sec => `
      <div style="margin-bottom: 25px; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <h2 style="margin-top: 0; color: #1e3a8a; font-family: sans-serif; font-size: 1.25rem; border-bottom: 2px solid #eff6ff; padding-bottom: 8px;">${sec.title}</h2>
        <div style="color: #334155; font-family: sans-serif; line-height: 1.6; font-size: 0.95rem;">
          ${sec.content.replace(/\n/g, '<br/>')}
        </div>
      </div>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #0f172a; max-width: 800px; margin: 0 auto; }
          h1 { text-align: center; color: #1e3a8a; margin-bottom: 30px; }
          .disclaimer { background-color: #fffbeb; border: 1px solid #fef3c7; color: #b45309; padding: 15px; border-radius: 12px; margin-bottom: 35px; font-size: 0.875rem; text-align: center; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="disclaimer">
          <strong>Disclaimer:</strong> This summary is for educational and informational purposes only. It is NOT a medical diagnosis or treatment plan. Always consult a qualified clinician regarding your health.
        </div>
        ${bodyContent}
      </body>
      </html>
    `;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = reportName ? `analysis-${reportName.replace(/\.[^/.]+$/, '')}.html` : 'report-analysis.html';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
        {reportName && (
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              Results for: <span className="text-primary-600 dark:text-primary-400">{reportName}</span>
            </h2>
          </div>
        )}
        <button
          onClick={handleDownload}
          className="py-2 px-4 text-xs font-semibold flex items-center gap-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-primary-500/10 cursor-pointer shadow-sm text-gray-700 dark:text-gray-200 transition-colors"
        >
          <Download className="w-4 h-4 text-primary-500" />
          Export Analysis
        </button>
      </div>

      {sections.length > 0 ? (
        sections.map((section, i) => {
          const config = getSectionConfig(section.title);
          const Icon = config.icon;
          const isAbnormal = config.key === 'abnormal';
          return (
            <Card
              key={i}
              className={`animate-slide-up ${
                isAbnormal
                  ? 'border-2 border-danger-200 dark:border-danger-900/40 bg-danger-50/10 dark:bg-danger-950/5'
                  : ''
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isAbnormal ? 'bg-danger-100 dark:bg-danger-900/35' : config.bg}`}>
                    <Icon className={`w-5 h-5 ${isAbnormal ? 'text-danger-500' : config.color}`} />
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    {section.title}
                  </h3>
                </div>
                {isAbnormal && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400 animate-pulse">
                    Action Required
                  </span>
                )}
              </div>
              <div className="prose-medical text-gray-700 dark:text-gray-300">
                <Markdown>{section.content.trim()}</Markdown>
              </div>
            </Card>
          );
        })
      ) : (
        <Card>
          <div className="prose-medical text-gray-700 dark:text-gray-300">
            <Markdown>{results}</Markdown>
          </div>
        </Card>
      )}
    </div>
  );
}
