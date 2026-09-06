import { useState, useRef } from 'react';
import Calculator from './components/Calculator';
import { SettingsDrawer } from './components/SettingsDrawer';

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [bannerImage, setBannerImage] = useState(null);
  const [locationLink, setLocationLink] = useState(
    localStorage.getItem('riceLocationLink') || ''
  );
  const hamburgerRef = useRef(null);

  return (
    <>
      {/* Hamburger Button */}
      <button
        ref={hamburgerRef}
        onClick={() => setIsDrawerOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors focus-ring"
        aria-label="Open settings"
        aria-expanded={isDrawerOpen}
        aria-controls="settings-drawer"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Main Calculator */}
      <Calculator
        onBannerChange={setBannerImage}
        bannerImage={bannerImage}
        locationLink={locationLink}
      />

      {/* Settings Drawer */}
      <SettingsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onBannerChange={setBannerImage}
        locationLink={locationLink}
        onLocationChange={setLocationLink}
      />
    </>
  );
}

export default App;