import { useState, useEffect } from "react";
import { FaTimes, FaDownload, FaMobile } from "react-icons/fa";

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      window.navigator.standalone === true;
    setIsStandalone(standalone);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Check if user has dismissed the prompt before
      const dismissed = localStorage.getItem('pwa-prompt-dismissed');
      if (!dismissed && !standalone) {
        setTimeout(() => setShowPrompt(true), 3000); // Show after 3 seconds
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show manual install instructions
    if (iOS && !standalone) {
      const dismissed = localStorage.getItem('pwa-prompt-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt || isStandalone) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-20 left-4 right-4 z-50">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="bg-[#F7941D] p-2 rounded-lg flex-shrink-0">
            <FaMobile className="text-white" size={20} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Install Bharatronix App
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              {isIOS 
                ? "Tap the share button and select 'Add to Home Screen' for a better experience"
                : "Install our app for faster access and better experience"
              }
            </p>
            
            <div className="flex gap-2">
              {!isIOS && deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-1 px-3 py-2 bg-[#1E3473] text-white text-xs rounded-lg hover:bg-[#F7941D] transition-colors"
                >
                  <FaDownload size={12} />
                  Install
                </button>
              )}
              
              <button
                onClick={handleDismiss}
                className="px-3 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <FaTimes size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;