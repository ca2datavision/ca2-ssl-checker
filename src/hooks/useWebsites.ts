import { useState, useEffect } from 'react';
import { Website } from '../types';

async function checkSSL(url: string): Promise<{ status: Website['status']; expiryDate: string; lastChecked: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch('/ssl/api/check-ssl', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const result = await response.json();
    return result;
  } catch (error) {
    return {
      status: 'error',
      lastChecked: new Date().toISOString(),
    };
  }
}

const STORAGE_KEY = 'ssl-checker-websites';

export function useWebsites() {
  const [websites, setWebsites] = useState<Website[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(websites));
  }, [websites]);

  const addWebsite = (url: string) => {
    const formattedUrl = url.toLowerCase().trim();
    if (!formattedUrl.startsWith('http')) {
      url = `https://${formattedUrl}`;
    }

    const newWebsite: Website = {
      id: crypto.randomUUID(),
      url,
      lastChecked: new Date().toISOString(),
      status: 'error',
    };
    setWebsites(prev => [...prev, newWebsite]);

    // Check SSL after adding
    checkSSL(url).then(({ status, expiryDate, lastChecked }) => {
      setWebsites(prev =>
        prev.map(website =>
          website.id === newWebsite.id
            ? { ...website, status, expiryDate, lastChecked }
            : website
        )
      );
    });
  };

  const updateWebsite = (id: string, url: string) => {
    const formattedUrl = url.toLowerCase().trim();
    if (!formattedUrl.startsWith('http')) {
      url = `https://${formattedUrl}`;
    }

    setWebsites(prev =>
      prev.map(website =>
        website.id === id
          ? {
              ...website,
              url,
              lastChecked: new Date().toISOString(),
            }
          : website
      )
    );

    // Check SSL after updating
    checkSSL(url).then(({ status, expiryDate, lastChecked }) => {
      setWebsites(prev =>
        prev.map(website =>
          website.id === id
            ? { ...website, status, expiryDate, lastChecked }
            : website
        )
      );
    });
  };

  const removeWebsite = (id: string) => {
    setWebsites(prev => prev.filter(website => website.id !== id));
  };

  const removeAllWebsites = () => {
    setWebsites([]);
  };

  const exportWebsites = () => {
    const content = websites.map(w => w.url).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ssl-checker-websites.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importWebsites = async (file: File) => {
    const content = await file.text();
    const urls = content.split('\n').map(url => url.trim()).filter(Boolean);
    const existingUrls = new Set(websites.map(w => w.url));
    
    for (const url of urls) {
      if (!existingUrls.has(url)) {
        addWebsite(url);
      }
    }
  };

  const recheckAllWebsites = async () => {
    const results = await Promise.all(
      websites.map(async (website) => ({
        id: website.id,
        ...(await checkSSL(website.url))
      }))
    );

    setWebsites(prev =>
      prev.map(website => {
        const result = results.find(r => r.id === website.id);
        return result
          ? {
              ...website,
              lastChecked: new Date().toISOString(),
              status: result.status,
              expiryDate: result.expiryDate,
            }
          : website;
      })
    );
  };

  const recheckWebsite = async (id: string) => {
    const website = websites.find(w => w.id === id);
    if (!website) return;

    const { status, expiryDate, lastChecked } = await checkSSL(website.url);

    setWebsites(prev =>
      prev.map(website =>
        website.id === id
          ? {
              ...website,
              lastChecked,
              status,
              expiryDate,
            }
          : website
      )
    );
  };

  return {
    websites,
    addWebsite,
    updateWebsite,
    removeWebsite,
    removeAllWebsites,
    exportWebsites,
    importWebsites,
    recheckWebsite,
    recheckAllWebsites,
    setWebsites,
  };
}
