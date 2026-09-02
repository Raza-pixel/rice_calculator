import { useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'riceBannerImage';

export function SettingsDrawer({ isOpen, onClose, onBannerChange }) {
  const drawerRef = useRef(null);
  const previousActiveElement = useRef(null);
  const fileInputRef = useRef(null);

  // Focus management and keyboard handling
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      // Focus the drawer for keyboard navigation
      setTimeout(() => drawerRef.current?.focus(), 0);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Return focus to hamburger button
      previousActiveElement.current?.focus?.();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
    // Trap focus inside drawer
    if (e.key === 'Tab') {
      const focusableElements = drawerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }, [onClose]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      localStorage.setItem(STORAGE_KEY, dataUrl);
      onBannerChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    localStorage.removeItem(STORAGE_KEY);
    onBannerChange(null);
  };

  return (
    <div
      id="settings-drawer"
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-xl animate-slide-in"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
            <h2 id="settings-title" className="text-lg font-medium text-stone-900">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors focus-ring"
              aria-label="Close settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-8">
            {/* Banner Image Section */}
            <section>
              <h3 className="text-sm font-medium text-stone-700 uppercase tracking-wider mb-4">
                Banner Image
              </h3>

              <div className="space-y-4">
                {/* Upload Button */}
                <label className="flex flex-col items-center justify-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                    id="banner-upload"
                    aria-label="Upload banner image"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-3 border-2 border-dashed border-stone-300 rounded-lg
                      text-stone-600 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50
                      transition-colors duration-150 focus-ring"
                  >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="text-sm font-medium">Choose Image</span>
                    <span className="text-xs text-stone-400">PNG, JPG, WebP, etc.</span>
                  </button>
                </label>

                {/* Remove Button */}
                <button
                  onClick={handleRemove}
                  className="w-full px-4 py-2 text-sm font-medium text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus-ring"
                >
                  Remove Banner
                </button>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-stone-200">
            <p className="text-xs text-stone-400 text-center">
              Images are stored locally in your browser
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsDrawer;