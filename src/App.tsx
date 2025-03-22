import React from 'react';
import { Globe, Mail } from 'lucide-react';
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
    removeAllWebsites
  } = useWebsites();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
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
        </div>
      </div>
      <footer className="mt-16 border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">About</h3>
              <p className="text-sm text-gray-500">
                Built by CA2 Data Vision using advanced AI technology. This tool helps you monitor SSL certificates
                across multiple websites with real-time status updates and expiration notifications.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <Mail className="w-4 h-4" />
                <a href="mailto:ionut@ca2datavision.ro" className="hover:text-blue-500">
                  ionut@ca2datavision.ro
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Open Source</h3>
              <p className="text-sm text-gray-500">
                This project is open source and available on GitHub. Feel free to contribute, report issues,
                or fork the repository for your own use.
              </p>
              <div className="mt-4">
                <a
                  href="https://github.com/ca2datavision/ssl-checker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600"
                >
                  View on GitHub
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Disclaimer</h3>
              <p className="text-sm text-gray-500">
                This tool provides SSL certificate monitoring capabilities but does not guarantee complete security
                assessment. Users should perform comprehensive security audits and maintain proper security practices.
                All website data is stored locally in your browser's storage.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Share This Tool</h3>
              <p className="text-sm text-gray-500 mb-4">
                Help others discover this SSL certificate monitoring tool by sharing it on your favorite platform.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this SSL Certificate Monitoring tool - helps you track SSL certificates across multiple websites!')}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors"
                >
                  Share on Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#094ea0] transition-colors"
                >
                  Share on LinkedIn
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent('SSL Certificate Monitoring Tool')}&body=${encodeURIComponent('Check out this useful tool for monitoring SSL certificates across multiple websites: ' + window.location.href)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Share via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
