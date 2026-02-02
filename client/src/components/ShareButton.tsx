import React, { useState } from 'react';

const ShareButton = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'Shoxped',
      text: 'Cek harga termurah Shopee vs TikTok Shop di sini! Anti boncos.',
      url: 'https://shoxped.com', 
    };

    // Cek support browser untuk fitur share native
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback copy link
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2">
      {copied && (
        <div className="bg-black text-white text-xs py-1 px-3 rounded-lg shadow-lg mb-1 animate-fade-in">
          Link Disalin!
        </div>
      )}

      <button
        onClick={handleShare}
        className="bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-white"
        aria-label="Share Application"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      </button>
    </div>
  );
};

export default ShareButton;