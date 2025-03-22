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
        <div className="flex items-center gap-3 mb-8">
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
          <div className="grid md:grid-cols-2 gap-8">
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Disclaimer</h3>
              <p className="text-sm text-gray-500">
                This tool provides SSL certificate monitoring capabilities but does not guarantee complete security
                assessment. Users should perform comprehensive security audits and maintain proper security practices.
                All website data is stored locally in your browser's storage.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
