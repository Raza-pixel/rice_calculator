import { useState, useCallback } from 'react';

export function Calculator({ bannerImage, locationLink }) {
  const [ricePrepared, setRicePrepared] = useState('');
  const [riceLeftOver, setRiceLeftOver] = useState('');

  // Calculate amount of raw rice to be reduced
  const rice_to_be_reduced = useCallback(() => {
    const leftOver = parseFloat(riceLeftOver);

    if (
      isNaN(leftOver)
    ) {
      return null;
    }

    const raw_rice_reduced = leftOver / 2.5;
    return raw_rice_reduced;
  }, [riceLeftOver]);

  
  // Calculate leftover percentage
  const leftoverPercentage = useCallback(() => {
    const prepared = parseFloat(ricePrepared);
    const leftOver = parseFloat(riceLeftOver);

    if (
      isNaN(prepared) ||
      isNaN(leftOver) ||
      prepared <= 0
    ) {
      return null;
    }

    const percentage = (leftOver / prepared) * 100;
    return percentage;
  }, [ricePrepared, riceLeftOver]);

  // Format percentage for display
  const formatPercentage = useCallback((value) => {
    if (value === null) return '—';

    // Use sensible decimal places
    if (Number.isInteger(value)) {
      return `${value}%`;
    }
    // Show up to 2 decimal places, trim trailing zeros
    return `${value.toFixed(2).replace(/\.?0+$/, '')}%`;
  }, []);

  // Validation states
  const hasNonNumericInput = () => {
    return (ricePrepared && isNaN(parseFloat(ricePrepared))) ||
           (riceLeftOver && isNaN(parseFloat(riceLeftOver)));
  };

  const isPreparedZero = () => {
    const prepared = parseFloat(ricePrepared);
    return !isNaN(prepared) && prepared === 0;
  };

  const isLeftOverGreater = () => {
    const prepared = parseFloat(ricePrepared);
    const leftOver = parseFloat(riceLeftOver);
    return !isNaN(prepared) && !isNaN(leftOver) && leftOver > prepared && prepared > 0;
  };

  const percentage = leftoverPercentage();
  const rice_reduction_amount = rice_to_be_reduced();

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 sm:py-16">
      {/* Location Button */}
      <button
        onClick={() => window.open(getValidUrl(locationLink), '_blank')}
        className="fixed top-5 right-6 w-10 h-10 flex items-center justify-center
          rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-900
          transition-colors duration-150"
        aria-label="Open location"
        title="Open location"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"
          />
          <circle
            cx="12"
            cy="10"
            r="2.5"
            strokeWidth={2}
          />
        </svg>
      </button>

      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-10 md:gap-16 items-start">

        {/* Calculator - Left Half */}
        <div className="w-full md:w-1/2 max-w-md mx-auto md:mx-0">
          {/* Title */}
          <h1 className="text-center text-2xl sm:text-3xl font-light text-stone-900 tracking-tight mb-10">
            Rice Leftover Calculator
          </h1>

          {/* Input Fields */}
          <div className="space-y-6">
            {/* Rice Prepared */}
            <div>
              <label
                htmlFor="rice-prepared"
                className="block text-sm font-medium text-stone-700 mb-2"
              >
                Rice Prepared - Uncooked (in Grams)
              </label>
              <input
                type="number"
                id="rice-prepared"
                step="0.1"
                min="0"
                value={ricePrepared}
                onChange={(e) => setRicePrepared(e.target.value)}
                placeholder="e.g., 500"
                className="w-full px-4 py-3 text-lg text-stone-900 bg-white border border-stone-300 rounded-lg
                  placeholder:text-stone-400
                  focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20
                  transition-colors duration-150
                  focus-ring"
                aria-describedby="rice-prepared-hint"
              />
              <p id="rice-prepared-hint" className="mt-1 text-xs text-stone-500">
                Enter the total amount of rice prepared (grams)
              </p>
            </div>

            {/* Rice Left Over */}
            <div>
              <label
                htmlFor="rice-leftover"
                className="block text-sm font-medium text-stone-700 mb-2"
              >
                Rice Left Over - Cooked
              </label>
              <input
                type="number"
                id="rice-leftover"
                step="0.1"
                min="0"
                value={riceLeftOver}
                onChange={(e) => setRiceLeftOver(e.target.value)}
                placeholder="e.g., 100"
                className={`w-full px-4 py-3 text-lg text-stone-900 bg-white border rounded-lg
                  placeholder:text-stone-400
                  transition-colors duration-150
                  focus-ring
                  ${isLeftOverGreater() ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500/20'
                    : 'border-stone-300 focus:border-teal-500 focus:ring-teal-500/20'}`}
                aria-describedby="rice-leftover-hint"
              />
              <p id="rice-leftover-hint" className="mt-1 text-xs text-stone-500">
                Enter the amount of rice left over 
              </p>
            </div>

            {/* Validation messages */}
            {hasNonNumericInput() && (
              <p className="text-sm text-rose-600" role="alert">
                Please enter valid numeric values
              </p>
            )}
            {isPreparedZero() && (
              <p className="text-sm text-amber-600" role="alert">
                Rice Prepared must be greater than 0 to calculate percentage
              </p>
            )}
            {isLeftOverGreater() && (
              <p className="text-sm text-amber-600" role="alert">
                Leftover is greater than prepared — please verify your values
              </p>
            )}
          </div>

          {/* Result Section */}
          <div className="mt-10 pt-8 border-t border-stone-200">
            <div className="text-center">
              <p className="text-sm font-medium text-stone-600 uppercase tracking-wider mb-2">
                For future purposes, reduce the cooking amount from {ricePrepared}g to 
              </p>
              <p className="text-5xl sm:text-6xl font-light text-stone-900 tabular-nums">
                {ricePrepared - rice_reduction_amount} grams
              </p>
              {percentage === null && ricePrepared && riceLeftOver && !hasNonNumericInput() && !isPreparedZero() && (
                <p className="mt-2 text-sm text-stone-500">
                  Enter values above to calculate
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Banner - Right Half */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <Banner image={bannerImage} locationLink={locationLink} />
          
        </div>

      </div>
    </div>
  );
}

function getValidUrl(url) {
  if (!url) return null;
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return null;
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }
  return `https://${trimmedUrl}`;
}

function Banner({ image, locationLink }) {
  const bannerContent = (
    <div className="relative rounded-xl overflow-hidden bg-stone-100">
      {image ? (
        <img
          src={image}
          alt="Banner"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-stone-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-12 w-full max-w-md">
      {locationLink ? (
        <a
          href={
            locationLink.startsWith('http://') ||
            locationLink.startsWith('https://')
              ? locationLink
              : `https://${locationLink}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="block cursor-pointer"
          aria-label="Open location"
        >
          {bannerContent}
        </a>
      ) : (
        bannerContent
      )}
    </div>
  );
}


export default Calculator;