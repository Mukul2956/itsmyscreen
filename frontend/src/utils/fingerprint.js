// Generate a browser fingerprint for anti-abuse tracking
export async function getFingerprint() {
  // Check if we already have a fingerprint stored
  let fingerprint = localStorage.getItem('poll_fingerprint');
  
  if (!fingerprint) {
    // Generate a new fingerprint based on browser characteristics
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 'unknown',
      navigator.deviceMemory || 'unknown',
    ];
    
    // Add canvas fingerprint for better uniqueness
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Poll Fingerprint', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Canvas FP', 4, 17);
    components.push(canvas.toDataURL());
    
    // Create a hash-like fingerprint
    const str = components.join('|');
    fingerprint = await hashString(str);
    
    // Store in localStorage
    localStorage.setItem('poll_fingerprint', fingerprint);
  }
  
  return fingerprint;
}

// Simple hash function
async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  
  if (window.crypto && window.crypto.subtle) {
    try {
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      // Fallback if crypto.subtle is not available
      return simplehash(str);
    }
  }
  
  return simplehash(str);
}

// Fallback simple hash
function simplehash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
