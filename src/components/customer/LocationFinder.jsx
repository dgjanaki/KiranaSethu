import React, { useState, useCallback } from 'react';
import { MapPin, Navigation, AlertCircle, CheckCircle2, RefreshCw, Loader } from 'lucide-react';

/**
 * LocationFinder — obtains the customer's real browser GPS location.
 *
 * RULES:
 * - Uses navigator.geolocation.getCurrentPosition() only.
 * - Never falls back to hardcoded coordinates (no Delhi, no default lat/lng).
 * - On permission denied: shows a clear message + "Try Again" — nothing else.
 * - Coordinates displayed are the real values from the browser.
 */
export default function LocationFinder({ onLocationObtained }) {
  // idle | requesting | success | denied | unavailable | timeout | error
  const [locationState, setLocationState] = useState('idle');
  const [userLocation, setUserLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState('error');
      setErrorMessage(
        'Your browser does not support location services. Please use a modern browser such as Chrome, Firefox, or Safari.'
      );
      return;
    }

    setLocationState('requesting');
    setErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const location = { lat: latitude, lng: longitude, accuracy };
        setUserLocation(location);
        setLocationState('success');
        onLocationObtained(location);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationState('denied');
            setErrorMessage(
              'Location access is required to find nearby Kirana shops. Please allow location permission in your browser settings and try again.'
            );
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationState('unavailable');
            setErrorMessage(
              'Unable to detect your current location. Please ensure location services are enabled on your device and try again.'
            );
            break;
          case err.TIMEOUT:
            setLocationState('timeout');
            setErrorMessage(
              'Location detection timed out. Please check your connection, enable GPS, and try again.'
            );
            break;
          default:
            setLocationState('error');
            setErrorMessage(
              'An unexpected error occurred while detecting your location. Please try again.'
            );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0  // always fresh — no cached position
      }
    );
  }, [onLocationObtained]);

  const resetToIdle = useCallback(() => {
    setLocationState('idle');
    setUserLocation(null);
    setErrorMessage('');
  }, []);

  return (
    <div className="location-finder-section">
      {/* Header */}
      <div className="location-finder-header">
        <div className="location-header-icon">
          <MapPin size={28} color="var(--primary)" />
        </div>
        <div>
          <h2 className="location-section-title">Find Kirana Shops Near You</h2>
          <p className="location-section-subtitle">
            Share your current location to discover trusted Kirana shops nearby
          </p>
        </div>
      </div>

      {/* ── IDLE ─────────────────────────────────────────────────── */}
      {locationState === 'idle' && (
        <div className="location-cta-box">
          <div className="location-illustration">
            <div className="location-pulse-ring">
              <div className="location-pulse-dot">
                <MapPin size={24} color="var(--primary)" />
              </div>
            </div>
          </div>

          <div className="location-cta-text">
            <h3>Discover shops within 2 km of you</h3>
            <p>
              KiranaSetu uses your GPS location only to find nearby shops and calculate
              distances. Your precise location is never stored permanently.
            </p>
          </div>

          <button
            className="btn btn-primary btn-lg location-cta-btn"
            onClick={requestLocation}
          >
            <Navigation size={18} />
            Use My Location
          </button>

          <p className="location-privacy-note">
            🔒 Your location is used only to find shops and will not be tracked in the background.
          </p>
        </div>
      )}

      {/* ── REQUESTING ───────────────────────────────────────────── */}
      {locationState === 'requesting' && (
        <div className="location-loading-state">
          <div className="location-spinner-wrap">
            <Loader size={36} className="location-spin-icon" color="var(--primary)" />
          </div>
          <h3>Detecting your location…</h3>
          <p>Please allow location access when your browser asks.</p>
          <div className="location-permission-hint">
            <AlertCircle size={14} color="var(--text-muted)" />
            <span>Look for a permission prompt at the top of your browser window</span>
          </div>
        </div>
      )}

      {/* ── SUCCESS ──────────────────────────────────────────────── */}
      {locationState === 'success' && userLocation && (
        <div className="location-success-state">
          <div className="location-detected-banner">
            <div className="detected-icon-wrap">
              <CheckCircle2 size={22} color="var(--primary)" />
            </div>
            <div className="detected-text">
              <span className="detected-label">📍 Your current location</span>
              <strong className="detected-value">Location detected</strong>
              <span className="detected-coords">
                {userLocation.lat.toFixed(5)}°N, {userLocation.lng.toFixed(5)}°E
                {userLocation.accuracy
                  ? ` · ±${Math.round(userLocation.accuracy)} m accuracy`
                  : ''}
              </span>
            </div>
            <button
              className="btn btn-outline btn-sm change-location-btn"
              onClick={resetToIdle}
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* ── PERMISSION DENIED ────────────────────────────────────── */}
      {locationState === 'denied' && (
        <div className="location-error-state">
          <div className="location-error-card denied">
            <div className="error-icon-wrap">
              <AlertCircle size={22} color="#dc2626" />
            </div>
            <div className="error-message-content">
              <h4>Location Access Denied</h4>
              <p>{errorMessage}</p>
              <div className="location-help-steps">
                <strong>How to enable:</strong>
                <ul>
                  <li>Chrome: Click the 🔒 lock icon in the address bar → Site settings → Location → Allow</li>
                  <li>Firefox: Click the shield icon → Permissions → Access Your Location → Allow</li>
                  <li>Safari: Preferences → Websites → Location → Allow</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="location-fallback-actions">
            <button className="btn btn-primary" onClick={requestLocation}>
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* ── UNAVAILABLE / TIMEOUT / ERROR ────────────────────────── */}
      {(locationState === 'unavailable' || locationState === 'timeout' || locationState === 'error') && (
        <div className="location-error-state">
          <div className="location-error-card">
            <div className="error-icon-wrap">
              <AlertCircle size={22} color="#d97706" />
            </div>
            <div className="error-message-content">
              <h4>
                {locationState === 'timeout'
                  ? 'Location Request Timed Out'
                  : 'Unable to Detect Location'}
              </h4>
              <p>{errorMessage}</p>
            </div>
          </div>
          <div className="location-fallback-actions">
            <button className="btn btn-primary" onClick={requestLocation}>
              <RefreshCw size={16} />
              Try Again
            </button>
            <button className="btn btn-outline" onClick={resetToIdle}>
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
