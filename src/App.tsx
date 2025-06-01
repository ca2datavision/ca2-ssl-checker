import React from 'react';
import { Globe, Mail, Twitter, Linkedin, Copy, Share2, Github } from 'lucide-react';
import { WebsiteForm } from './components/WebsiteForm';
import { WebsiteList } from './components/WebsiteList';
import { useWebsites } from './hooks/useWebsites';

function App() {
  const {
    websites,
    setWebsites,
    addWebsite,
    updateWebsite,
    removeWebsite,
    recheckWebsite,
    recheckAllWebsites,
    exportWebsites,
    importWebsites,
    removeAllWebsites,
    toggleIgnore
  } = useWebsites();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8 text-center sm:text-left">
          <Globe className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900">SSL Certificate Checker</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Website</h2>
          <p className="text-sm text-gray-500 mb-4">
            Enter a website URL to check its SSL certificate status. Your list of websites is stored locally in your browser
            and will persist between visits.
          </p>
          <WebsiteForm onSubmit={({ url }) => addWebsite(url)} />
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Monitored Websites</h2>
          <WebsiteList
            onToggleIgnore={toggleIgnore}
            setWebsites={setWebsites}
            websites={websites}
            onUpdate={updateWebsite}
            onDelete={removeWebsite}
            onRecheck={recheckWebsite}
            onRecheckAll={recheckAllWebsites}
            onExport={exportWebsites}
            onImport={importWebsites}
            onDeleteAll={removeAllWebsites}
          />

          <div className="mt-12 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Share This Tool</h2>
              <p className="text-sm text-gray-500 mb-6">
                Help others discover this free SSL certificate monitoring tool. Share it with your network to help them manage their SSL certificates effectively.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this SSL Certificate Monitoring tool - helps you track SSL certificates across multiple websites!')}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors text-sm"
                >
                  <Twitter className="w-4 h-4" />
                  Share on Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#094ea0] transition-colors text-sm"
                >
                  <Linkedin className="w-4 h-4" />
                  Share on LinkedIn
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent('SSL Certificate Monitoring Tool')}&body=${encodeURIComponent('Check out this useful tool for monitoring SSL certificates across multiple websites: ' + window.location.href)}`}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  Share via Email
                </a>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </button>
                {'share' in navigator && (
                  <button
                    onClick={() => {
                      navigator.share({
                        title: 'SSL Certificate Checker',
                        text: 'Monitor SSL certificates across multiple websites with this free tool.',
                        url: window.location.href
                      });
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    Share...
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Open Source</h2>
              <p className="text-sm text-gray-500 mb-6">
                This project is open source and available on GitHub. Feel free to contribute, report issues,
                or fork the repository for your own use. We welcome community contributions!
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/ca2datavision/ssl-checker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                >
                  <Github className="w-4 h-4" />
                  View on GitHub
                </a>
                <a
                  href="https://github.com/ca2datavision/ssl-checker/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Report an Issue
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="mt-16 border-t border-gray-200 py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">About</h3>
              <p className="text-sm text-gray-500">
                Built by CA2 Data Vision using advanced AI technology. This tool helps you monitor SSL certificates
                across multiple websites with real-time status updates and expiration notifications.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:ionut@ca2datavision.ro"
                  className="text-sm text-gray-500 hover:text-blue-500 transition-colors"
                >
                  ionut@ca2datavision.ro
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Disclaimer</h3>
              <p className="text-sm text-gray-500 mb-2">
                This tool provides SSL certificate monitoring capabilities but does not guarantee complete security
                assessment. Users should perform comprehensive security audits and maintain proper security practices.
              </p>
              <p className="text-sm text-gray-500">
                All website data is stored locally in your browser's storage.
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} CA2 Data Vision. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
