import { useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'riceBannerImage';
const LOCATION_STORAGE_KEY = 'riceLocationLink';
const BUTTONS_STORAGE_KEY = 'riceActionButtons';



export function SettingsDrawer({ isOpen, onClose, onBannerChange, locationLink, onLocationChange, buttons, onButtonsChange}) {
  const drawerRef = useRef(null);
  const previousActiveElement = useRef(null);
  const fileInputRef = useRef(null);

  const handleButtonChange = (index, field, value) => {
    const updatedButtons = buttons.map((button, i) =>
      i === index
        ? { ...button, [field]: value }
        : button
    );

    localStorage.setItem(
      BUTTONS_STORAGE_KEY,
      JSON.stringify(updatedButtons)
    );

    onButtonsChange(updatedButtons);
  };

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

  const handleLocationChange = (e) => {
    const value = e.target.value.trim();

    localStorage.setItem(LOCATION_STORAGE_KEY, value);
    onLocationChange(value);
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

                {/* Location Link */}
                <div className="pt-4 border-t border-stone-200">
                  <label
                    htmlFor="location-link"
                    className="block text-sm font-medium text-stone-700 uppercase tracking-wider mb-3"
                  >
                    Location Link
                  </label>

                  <input
                    id="location-link"
                    type="url"
                    value={locationLink}
                    onChange={handleLocationChange}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-4 py-3 text-sm text-stone-900 bg-white border border-stone-300 rounded-lg
                      placeholder:text-stone-400
                      focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20
                      transition-colors duration-150 focus-ring"
                  />

                  <p className="mt-2 text-xs text-stone-500">
                    This link will open when the banner is clicked.
                  </p>
                </div>

              </div>
            </section>

            {/* Action Buttons Section */}
            <section>
              <h3 className="text-sm font-medium text-stone-700 uppercase tracking-wider mb-4">
                Action Buttons
              </h3>

              <div className="space-y-6">
                {buttons.map((button, index) => (
                  <div
                    key={index}
                    className="space-y-3 pt-4 border-t border-stone-200 first:border-t-0 first:pt-0"
                  >
                    <p className="text-sm font-medium text-stone-700">
                      Button {index + 1}
                    </p>

                    {/* Button Name */}
                    <div>
                      <label
                        htmlFor={`button-name-${index}`}
                        className="block text-xs font-medium text-stone-600 mb-1"
                      >
                        Button Name
                      </label>

                      <input
                        id={`button-name-${index}`}
                        type="text"
                        value={button.name}
                        onChange={(e) =>
                          handleButtonChange(index, 'name', e.target.value)
                        }
                        placeholder={`Button ${index + 1}`}
                        className="w-full px-4 py-2.5 text-sm text-stone-900 bg-white border border-stone-300 rounded-lg
                          placeholder:text-stone-400
                          focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20
                          transition-colors duration-150 focus-ring"
                      />
                    </div>

                    {/* Button Link */}
                    <div>
                      <label
                        htmlFor={`button-link-${index}`}
                        className="block text-xs font-medium text-stone-600 mb-1"
                      >
                        Button Link
                      </label>

                      <input
                        id={`button-link-${index}`}
                        type="url"
                        value={button.link}
                        onChange={(e) =>
                          handleButtonChange(index, 'link', e.target.value)
                        }
                        placeholder="https://example.com"
                        className="w-full px-4 py-2.5 text-sm text-stone-900 bg-white border border-stone-300 rounded-lg
                          placeholder:text-stone-400
                          focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20
                          transition-colors duration-150 focus-ring"
                      />
                    </div>
                  </div>
                ))}
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