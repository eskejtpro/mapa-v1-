/**
 * AppBridge Contract & PySide6 WebChannel integration helper
 */

import { IAppBridge } from '../types';
import { MockBridge } from './MockBridge';

// Extend window object for optional PySide6 QWebChannel integration
declare global {
  interface Window {
    pyBridge?: IAppBridge;
    qt?: {
      webChannelTransport: unknown;
    };
  }
}

/**
 * Singleton factory returning either the active PySide6 bridge
 * or the built-in deterministic MockBridge.
 */
let bridgeInstance: IAppBridge | null = null;

export function getAppBridge(): IAppBridge {
  if (bridgeInstance) {
    return bridgeInstance;
  }

  // If running inside PySide6 QWebEngine with injected pyBridge
  if (typeof window !== 'undefined' && window.pyBridge) {
    console.info('[AppBridge] Using native PySide6 Python Bridge');
    bridgeInstance = window.pyBridge;
    return bridgeInstance;
  }

  // Fallback to rich MockBridge for standalone frontend dev/demo
  console.info('[AppBridge] Using local in-memory MockBridge');
  bridgeInstance = new MockBridge();
  return bridgeInstance;
}
