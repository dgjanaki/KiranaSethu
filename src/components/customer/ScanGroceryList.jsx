import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle2, RefreshCw, Sparkles, ArrowRight, X, AlertCircle } from 'lucide-react';
import { SIMULATED_AI_RECOGNITION, KIRANA_PRODUCTS } from '../../data/products';

// Sample demo paper grocery list SVG image data URL so the user can test photo scanning immediately if camera isn't attached
const SAMPLE_PAPER_LIST_DATA = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="600" viewBox="0 0 500 600"><rect width="500" height="600" fill="%23fffef7" rx="12"/><line x1="60" y1="0" x2="60" y2="600" stroke="%23fca5a5" stroke-width="2"/><line x1="0" y1="80" x2="500" y2="80" stroke="%23cbd5e1" stroke-width="1"/><line x1="0" y1="130" x2="500" y2="130" stroke="%23cbd5e1" stroke-width="1"/><line x1="0" y1="180" x2="500" y2="180" stroke="%23cbd5e1" stroke-width="1"/><line x1="0" y1="230" x2="500" y2="230" stroke="%23cbd5e1" stroke-width="1"/><line x1="0" y1="280" x2="500" y2="280" stroke="%23cbd5e1" stroke-width="1"/><line x1="0" y1="330" x2="500" y2="330" stroke="%23cbd5e1" stroke-width="1"/><line x1="0" y1="380" x2="500" y2="380" stroke="%23cbd5e1" stroke-width="1"/><line x1="0" y1="430" x2="500" y2="430" stroke="%23cbd5e1" stroke-width="1"/><line x1="0" y1="480" x2="500" y2="480" stroke="%23cbd5e1" stroke-width="1"/><text x="80" y="60" font-family="cursive, sans-serif" font-size="28" font-weight="bold" fill="%230f172a">Weekly Kirana Grocery List 📝</text><text x="80" y="115" font-family="cursive, sans-serif" font-size="22" fill="%231e293b">1. Rice - 5kg</text><text x="80" y="165" font-family="cursive, sans-serif" font-size="22" fill="%231e293b">2. Atta - 5kg</text><text x="80" y="215" font-family="cursive, sans-serif" font-size="22" fill="%231e293b">3. Toor Dal - 1kg</text><text x="80" y="265" font-family="cursive, sans-serif" font-size="22" fill="%231e293b">4. Cooking Oil - 1 Ltr</text><text x="80" y="315" font-family="cursive, sans-serif" font-size="22" fill="%231e293b">5. Sugar - 1kg</text><text x="80" y="365" font-family="cursive, sans-serif" font-size="22" fill="%231e293b">6. Tata Tea - 500g</text><text x="80" y="415" font-family="cursive, sans-serif" font-size="22" fill="%231e293b">7. Biscuits - 2 packs</text><text x="80" y="465" font-family="cursive, sans-serif" font-size="22" fill="%231e293b">8. Dettol Soap - 3 pack</text><text x="80" y="515" font-family="cursive, sans-serif" font-size="22" fill="%231e293b">9. Surf Excel Powder - 1kg</text></svg>`;

export default function ScanGroceryList({ onBulkAddAIProducts, onGoToCart, onBackToMethods }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [scanState, setScanState] = useState('idle'); // 'idle' | 'scanning' | 'completed'
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const loadingMessages = [
    "Reading your grocery list...",
    "Identifying products...",
    "Preparing your cart..."
  ];

  // Start live browser camera using getUserMedia API
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported on this browser context.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      mediaStreamRef.current = stream;
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera access error:", err);
      setCameraError("Camera permission unavailable or denied. Please upload a photo instead.");
      setIsCameraActive(false);
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Capture frame from live video feed
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setImagePreview(dataUrl);
      stopCamera();
    }
  };

  // File upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Load sample paper list image for immediate testing
  const useSampleImage = () => {
    setImagePreview(SAMPLE_PAPER_LIST_DATA);
    setCameraError(null);
  };

  // Trigger simulated AI recognition sequence
  const handleScanList = () => {
    setScanState('scanning');
    setLoadingMessageIndex(0);

    // Sequence timer: Step 1 -> Step 2 -> Step 3 -> Finish
    setTimeout(() => {
      setLoadingMessageIndex(1);
    }, 1000);

    setTimeout(() => {
      setLoadingMessageIndex(2);
    }, 2000);

    setTimeout(() => {
      setScanState('completed');
      // AUTOMATICALLY add the 9 AI recognized products into the shared cart!
      onBulkAddAIProducts(SIMULATED_AI_RECOGNITION);
    }, 3200);
  };

  const handleRetake = () => {
    setImagePreview(null);
    setScanState('idle');
  };

  const recognizedProducts = SIMULATED_AI_RECOGNITION.map(id => 
    KIRANA_PRODUCTS.find(p => p.id === id)
  ).filter(Boolean);

  return (
    <div className="flow-container">
      <div className="flow-top-bar">
        <button className="btn-back" onClick={onBackToMethods}>
          ← Back to Options
        </button>
        <div className="flow-title-wrap">
          <h2>Scan Your Grocery List</h2>
          <p>Write your grocery list, take a photo, and let KiranaSetu identify the products.</p>
        </div>
      </div>

      <div className="scan-card-container">
        {scanState === 'idle' && (
          <div className="scan-main-card">
            {!imagePreview && !isCameraActive && (
              <div className="upload-options-box">
                <div className="camera-icon-circle">
                  <Camera size={36} />
                </div>
                <h3>Take a Photo of Your Paper Grocery List</h3>
                <p className="card-desc">
                  Write your grocery list on paper, snap a photo using your camera or upload an image.
                </p>

                {cameraError && (
                  <div className="alert-box alert-warning">
                    <AlertCircle size={18} />
                    <span>{cameraError}</span>
                  </div>
                )}

                <div className="action-buttons-group">
                  <button className="btn btn-primary btn-lg" onClick={startCamera}>
                    <Camera size={20} />
                    Use Camera
                  </button>

                  <button className="btn btn-outline btn-lg" onClick={() => fileInputRef.current?.click()}>
                    <Upload size={20} />
                    Upload Photo
                  </button>

                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleFileUpload}
                  />
                </div>

                <div className="demo-sample-row">
                  <span>No paper list nearby?</span>
                  <button className="btn-link" onClick={useSampleImage}>
                    Try Demo Handwritten List
                  </button>
                </div>
              </div>
            )}

            {/* Live Camera Viewfinder Modal / View */}
            {isCameraActive && (
              <div className="camera-viewfinder-box">
                <div className="viewfinder-header">
                  <span>Align your paper grocery list inside frame</span>
                  <button className="btn-icon" onClick={stopCamera}>
                    <X size={20} />
                  </button>
                </div>
                
                <video ref={videoRef} autoPlay playsInline className="live-video-feed" />
                <canvas ref={canvasRef} style={{ display: 'none' }} />

                <div className="viewfinder-actions">
                  <button className="btn btn-primary btn-lg" onClick={capturePhoto}>
                    <Camera size={20} /> Snap Photo
                  </button>
                </div>
              </div>
            )}

            {/* Image Preview & Scan List Button */}
            {imagePreview && !isCameraActive && (
              <div className="image-preview-container">
                <div className="preview-header">
                  <span className="badge badge-neutral">Photo Captured</span>
                  <button className="btn btn-outline btn-sm" onClick={handleRetake}>
                    <RefreshCw size={14} /> Retake / Choose Different Photo
                  </button>
                </div>

                <div className="preview-image-wrapper">
                  <img src={imagePreview} alt="Grocery List Preview" className="preview-img" />
                </div>

                <div className="scan-cta-box">
                  <div className="scan-ai-note">
                    <Sparkles size={18} color="var(--primary)" />
                    <span>KiranaSetu Vision Engine will scan handwriting and add items to your cart automatically.</span>
                  </div>

                  <button className="btn btn-primary btn-lg btn-full" onClick={handleScanList}>
                    <Sparkles size={20} />
                    Scan List & Auto-Build Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Multi-stage AI Loading state */}
        {scanState === 'scanning' && (
          <div className="scanning-progress-card text-center">
            <div className="spinner-wrap">
              <RefreshCw size={44} className="spin-icon" color="var(--primary)" />
            </div>

            <div className="scanning-steps">
              <h3 className="pulse-text">{loadingMessages[loadingMessageIndex]}</h3>
              <p>Analyzing paper list image with KiranaSetu local demo recognition...</p>
            </div>

            <div className="progress-bar-track">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${((loadingMessageIndex + 1) / 3) * 100}%` }} 
              />
            </div>
          </div>
        )}

        {/* Completion & Automatic Cart Addition Confirmation */}
        {scanState === 'completed' && (
          <div className="scan-success-card">
            <div className="success-banner">
              <CheckCircle2 size={32} color="var(--primary)" />
              <div>
                <h3>9 items added to your cart ✓</h3>
                <p>All identified items have been automatically placed into your shopping cart.</p>
              </div>
            </div>

            <div className="recognized-items-list">
              <h4>Recognized Products ({recognizedProducts.length})</h4>
              <div className="recognized-grid">
                {recognizedProducts.map(p => (
                  <div key={p.id} className="recognized-item-chip">
                    <span className="chip-icon">{p.imageIcon}</span>
                    <div className="chip-details">
                      <strong>{p.name}</strong>
                      <span>{p.unitSize} • ₹{p.price}</span>
                    </div>
                    <CheckCircle2 size={16} className="chip-check" />
                  </div>
                ))}
              </div>
            </div>

            <div className="scan-next-actions">
              <button className="btn btn-primary btn-lg btn-full" onClick={onGoToCart}>
                Review Cart ({recognizedProducts.length} items) & Find Shops
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
