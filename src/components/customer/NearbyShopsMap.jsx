import React, { useState } from 'react';
import { MapPin, Store, Navigation } from 'lucide-react';

/**
 * Pure CSS/SVG interactive map visual showing customer location & nearby shop markers.
 * No external map library required — works offline, fully controllable.
 */
export default function NearbyShopsMap({ shops, customerLocation, selectedShopId, onShopMarkerClick }) {
  const [hoveredShopId, setHoveredShopId] = useState(null);

  if (!shops || shops.length === 0) return null;

  // Build a bounding box from all shop coordinates + customer location
  const allLats = shops.map(s => s.lat);
  const allLngs = shops.map(s => s.lng);

  if (customerLocation) {
    allLats.push(customerLocation.lat);
    allLngs.push(customerLocation.lng);
  }

  const minLat = Math.min(...allLats);
  const maxLat = Math.max(...allLats);
  const minLng = Math.min(...allLngs);
  const maxLng = Math.max(...allLngs);

  // Padding for the bounding box (in degrees)
  const latPad = (maxLat - minLat) * 0.3 + 0.003;
  const lngPad = (maxLng - minLng) * 0.3 + 0.003;

  const viewMinLat = minLat - latPad;
  const viewMaxLat = maxLat + latPad;
  const viewMinLng = minLng - lngPad;
  const viewMaxLng = maxLng + lngPad;

  // Project lat/lng to SVG canvas coordinates (SVG is 100x60 units)
  const W = 100;
  const H = 60;

  const project = (lat, lng) => {
    const x = ((lng - viewMinLng) / (viewMaxLng - viewMinLng)) * W;
    const y = H - ((lat - viewMinLat) / (viewMaxLat - viewMinLat)) * H;
    return { x: Math.max(3, Math.min(W - 3, x)), y: Math.max(3, Math.min(H - 3, y)) };
  };

  const customerPos = customerLocation ? project(customerLocation.lat, customerLocation.lng) : null;

  // Draw connection lines from customer to each shop
  const connectionLines = customerPos
    ? shops.map(shop => {
        const shopPos = project(shop.lat, shop.lng);
        return { shopId: shop.id, x1: customerPos.x, y1: customerPos.y, x2: shopPos.x, y2: shopPos.y };
      })
    : [];

  return (
    <div className="map-canvas-container">
      {/* Map Header */}
      <div className="map-canvas-header">
        <div className="map-legend-row">
          <span className="map-legend-item">
            <span className="legend-dot legend-customer" />
            You
          </span>
          {shops.map(shop => (
            <span key={shop.id} className="map-legend-item">
              <span
                className="legend-dot"
                style={{ backgroundColor: shop.mapMarkerColor || 'var(--primary)' }}
              />
              {shop.name.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="map-svg-wrapper">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="map-svg-canvas"
          style={{ width: '100%', height: '100%' }}
          aria-label="Map showing nearby Kirana shops"
        >
          {/* Background grid lines */}
          <defs>
            <pattern id="mapGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e8f0eb" strokeWidth="0.3" />
            </pattern>
            <filter id="shopGlow">
              <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width={W} height={H} fill="url(#mapGrid)" />

          {/* Map street-like background lines */}
          <line x1="20" y1="0" x2="20" y2={H} stroke="#dde8e2" strokeWidth="0.5" strokeDasharray="2,4" />
          <line x1="50" y1="0" x2="50" y2={H} stroke="#dde8e2" strokeWidth="0.5" strokeDasharray="2,4" />
          <line x1="80" y1="0" x2="80" y2={H} stroke="#dde8e2" strokeWidth="0.5" strokeDasharray="2,4" />
          <line x1="0" y1="20" x2={W} y2="20" stroke="#dde8e2" strokeWidth="0.5" strokeDasharray="2,4" />
          <line x1="0" y1="40" x2={W} y2="40" stroke="#dde8e2" strokeWidth="0.5" strokeDasharray="2,4" />

          {/* Connection lines from customer to shops */}
          {connectionLines.map(({ shopId, x1, y1, x2, y2 }) => {
            const shop = shops.find(s => s.id === shopId);
            const isHighlighted = shopId === selectedShopId || shopId === hoveredShopId;
            return (
              <line
                key={shopId}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isHighlighted ? (shop?.mapMarkerColor || 'var(--primary)') : '#c6e6d5'}
                strokeWidth={isHighlighted ? '0.8' : '0.4'}
                strokeDasharray={isHighlighted ? 'none' : '1.5,1.5'}
                opacity={isHighlighted ? 0.9 : 0.5}
              />
            );
          })}

          {/* Shop markers */}
          {shops.map(shop => {
            const pos = project(shop.lat, shop.lng);
            const isSelected = shop.id === selectedShopId;
            const isHovered = shop.id === hoveredShopId;
            const isActive = isSelected || isHovered;
            const markerColor = shop.mapMarkerColor || '#104e35';

            return (
              <g
                key={shop.id}
                onClick={() => onShopMarkerClick && onShopMarkerClick(shop)}
                onMouseEnter={() => setHoveredShopId(shop.id)}
                onMouseLeave={() => setHoveredShopId(null)}
                style={{ cursor: 'pointer' }}
                filter={isActive ? 'url(#shopGlow)' : undefined}
              >
                {/* Outer pulse ring for selected */}
                {isSelected && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="4"
                    fill="none"
                    stroke={markerColor}
                    strokeWidth="0.5"
                    opacity="0.4"
                  />
                )}
                {/* Marker circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isActive ? '3.5' : '2.5'}
                  fill={markerColor}
                  stroke="white"
                  strokeWidth="0.7"
                />
                {/* Open/Closed indicator */}
                {!shop.isOpen && (
                  <circle
                    cx={pos.x + 2.5}
                    cy={pos.y - 2.5}
                    r="1.2"
                    fill="#dc2626"
                    stroke="white"
                    strokeWidth="0.4"
                  />
                )}
                {/* Shop label */}
                <text
                  x={pos.x}
                  y={pos.y + 5.5}
                  textAnchor="middle"
                  fontSize="2.2"
                  fontWeight={isActive ? '700' : '600'}
                  fill={isActive ? markerColor : '#475569'}
                  fontFamily="system-ui, sans-serif"
                >
                  {shop.name.split(' ')[0]}
                </text>
                {/* Distance label */}
                <text
                  x={pos.x}
                  y={pos.y + 7.5}
                  textAnchor="middle"
                  fontSize="1.8"
                  fill="#64748b"
                  fontFamily="system-ui, sans-serif"
                >
                  {shop.distance}
                </text>
              </g>
            );
          })}

          {/* Customer location marker */}
          {customerPos && (
            <g>
              {/* Accuracy circle */}
              <circle
                cx={customerPos.x}
                cy={customerPos.y}
                r="5"
                fill="rgba(16, 78, 53, 0.08)"
                stroke="rgba(16, 78, 53, 0.2)"
                strokeWidth="0.4"
              />
              {/* Main dot */}
              <circle
                cx={customerPos.x}
                cy={customerPos.y}
                r="2.5"
                fill="#104e35"
                stroke="white"
                strokeWidth="0.8"
              />
              {/* Pulse ring animation */}
              <circle
                cx={customerPos.x}
                cy={customerPos.y}
                r="2"
                fill="none"
                stroke="#104e35"
                strokeWidth="0.6"
                opacity="0.5"
              />
              <text
                x={customerPos.x}
                y={customerPos.y - 4}
                textAnchor="middle"
                fontSize="2.5"
                fontWeight="700"
                fill="#104e35"
                fontFamily="system-ui, sans-serif"
              >
                📍 You
              </text>
            </g>
          )}
        </svg>

        {/* Map overlay label */}
        <div className="map-overlay-label">
          <Navigation size={12} color="var(--primary)" />
          <span>Live proximity map</span>
        </div>
      </div>

      {/* Map footer note */}
      <div className="map-footer-note">
        Click a shop marker to highlight it on the list below
      </div>
    </div>
  );
}
