// logger.js
import { CONFIG } from './config';

export function log(...args) {
  if (CONFIG.DEBUG) {
    console.log(...args);
  }
}

export function error(...args) {
  if (CONFIG.DEBUG) {
    console.error(...args);
  }
}

export function warn(...args) {
  if (CONFIG.DEBUG) {
    console.warn(...args);
  }
}

