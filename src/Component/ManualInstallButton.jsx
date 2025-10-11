import { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";

const ManualInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      // Install result handled
      setDeferredPrompt(null);
      setShowButton(false);
    }
  };

  if (!showButton) {
    return null;
  }

  return (
    <div className="md:hidden fixed top-20 right-4 z-50">
      <button
        onClick={handleInstall}
        className="bg-[#1E3473] text-white px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:bg-[#F7941D] transition-colors"
      >
        <FaDownload size={16} />
        Install App
      </button>
    </div>
  );
};

export default ManualInstallButton;