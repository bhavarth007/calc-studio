import React, { useState, useEffect } from 'react';
import { Smartphone, Share, PlusSquare, X, Check, Monitor, Download, Tablet, Sparkles } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onTriggerInstall: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onTriggerInstall,
}) => {
  const [activeTab, setActiveTab] = useState<'apple' | 'android' | 'desktop'>('apple');

  useEffect(() => {
    // Detect iOS / iPadOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS) {
      setActiveTab('apple');
    } else if (/Android/i.test(navigator.userAgent)) {
      setActiveTab('android');
    } else {
      setActiveTab('desktop');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon">
              <Smartphone size={22} />
            </div>
            <div>
              <h3 className="modal-title">Add Calc Studio to Home Screen</h3>
              <p className="modal-subtitle">Direct app shortcut for iPad, iPhone, Android & Desktop</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </header>

        {deferredPrompt && (
          <div className="install-banner">
            <div className="install-banner-text">
              <strong>Quick 1-Click Install Available</strong>
              <span>Install Calc Studio directly as an app on this device.</span>
            </div>
            <button className="btn btn-success install-btn" onClick={onTriggerInstall}>
              <Download size={16} /> Install Now
            </button>
          </div>
        )}

        {/* Device Selector Tabs */}
        <div className="modal-tabs">
          <button
            className={`modal-tab ${activeTab === 'apple' ? 'active' : ''}`}
            onClick={() => setActiveTab('apple')}
          >
            <Tablet size={16} /> Apple (iPad / iPhone)
          </button>
          <button
            className={`modal-tab ${activeTab === 'android' ? 'active' : ''}`}
            onClick={() => setActiveTab('android')}
          >
            <Smartphone size={16} /> Android Mobile / Tab
          </button>
          <button
            className={`modal-tab ${activeTab === 'desktop' ? 'active' : ''}`}
            onClick={() => setActiveTab('desktop')}
          >
            <Monitor size={16} /> Windows / Mac / PC
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'apple' && (
            <div className="instruction-card">
              <div className="card-badge">Apple iPad & iPhone (Safari)</div>
              <ol className="step-list">
                <li className="step-item">
                  <span className="step-num">1</span>
                  <div className="step-content">
                    <p>Tap the <strong>Share button</strong> <Share size={16} className="inline-icon" /> at the top or bottom toolbar in Safari.</p>
                  </div>
                </li>
                <li className="step-item">
                  <span className="step-num">2</span>
                  <div className="step-content">
                    <p>Scroll down the options menu and select <strong>"Add to Home Screen"</strong> <PlusSquare size={16} className="inline-icon" />.</p>
                  </div>
                </li>
                <li className="step-item">
                  <span className="step-num">3</span>
                  <div className="step-content">
                    <p>Tap <strong>"Add"</strong> in the upper right corner to confirm.</p>
                  </div>
                </li>
              </ol>
              <div className="pro-tip-note">
                <Sparkles size={16} className="pro-tip-icon" /> 
                <div className="pro-tip-text">
                  <strong>Native Fullscreen App:</strong> The Calc Studio app icon will be added to your home screen and opens directly in full-screen mode!
                </div>
              </div>
            </div>
          )}

          {activeTab === 'android' && (
            <div className="instruction-card">
              <div className="card-badge">Android Mobile & Tablet (Chrome)</div>
              <ol className="step-list">
                <li className="step-item">
                  <span className="step-num">1</span>
                  <div className="step-content">
                    <p>Tap the <strong>3-dots menu</strong> (<code>⋮</code>) in the top right corner of Chrome.</p>
                  </div>
                </li>
                <li className="step-item">
                  <span className="step-num">2</span>
                  <div className="step-content">
                    <p>Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.</p>
                  </div>
                </li>
                <li className="step-item">
                  <span className="step-num">3</span>
                  <div className="step-content">
                    <p>Tap <strong>"Add" / "Install"</strong> to confirm.</p>
                  </div>
                </li>
              </ol>
              <div className="pro-tip-note">
                <Sparkles size={16} className="pro-tip-icon" /> 
                <div className="pro-tip-text">
                  <strong>Instant Launcher:</strong> Tap the app icon anytime to open Calc Studio instantly from your home screen.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'desktop' && (
            <div className="instruction-card">
              <div className="card-badge">Desktop (Chrome, Edge, Brave)</div>
              <ol className="step-list">
                <li className="step-item">
                  <span className="step-num">1</span>
                  <div className="step-content">
                    <p>Click the <strong>Install icon</strong> <Download size={16} className="inline-icon" /> on the right side of the browser address bar.</p>
                  </div>
                </li>
                <li className="step-item">
                  <span className="step-num">2</span>
                  <div className="step-content">
                    <p>Click <strong>"Install Calc Studio"</strong> to pin the app to your Desktop or Taskbar.</p>
                  </div>
                </li>
              </ol>
              <div className="pro-tip-note">
                <Sparkles size={16} className="pro-tip-icon" /> 
                <div className="pro-tip-text">
                  <strong>Desktop App:</strong> Opens in a clean, standalone desktop window.
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Got it
          </button>
        </footer>
      </div>
    </div>
  );
};
