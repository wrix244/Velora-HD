/**
 * Utility functions for client-side cookie management.
 */

/**
 * Set a cookie in the browser
 * @param {string} name - Name of the cookie
 * @param {string} value - Value of the cookie
 * @param {number} [days] - Number of days until expiry (session cookie if omitted)
 */
export const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  // For dev environment, we support both Secure and non-Secure. If we are on http, Secure might prevent the cookie from setting.
  // So let's check window.location.protocol.
  const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax${secureFlag}`;
};

/**
 * Get a cookie value by name
 * @param {string} name - Name of the cookie
 * @returns {string|null} - Decoded cookie value or null if not found
 */
export const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }
  return null;
};

/**
 * Erase a cookie by setting its expiry date to the past
 * @param {string} name - Name of the cookie
 */
export const eraseCookie = (name) => {
  const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax${secureFlag}`;
};
