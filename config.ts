
// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

export const CONFIG = {
  // GOOGLE GEMINI AI
  // The API key is automatically injected from the environment variable API_KEY
  GEMINI_API_KEY: process.env.API_KEY,

  // REVENUECAT (IN-APP PURCHASES)
  // Get these keys from https://app.revenuecat.com/
  REVENUECAT: {
    IOS_KEY: "appl_YOUR_IOS_KEY_HERE",
    ANDROID_KEY: "goog_YOUR_ANDROID_KEY_HERE",
    ENTITLEMENT_ID: "pro_access" // The permission name you created in RevenueCat
  },

  // LEGAL & SUPPORT
  // These are required for App Store approval. 
  // You can link to a Notion page, a simple website, or a Google Doc.
  URLS: {
    PRIVACY_POLICY: "https://www.google.com/policies/privacy/", // Replace with yours
    TERMS_OF_USE: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/", // Replace with yours
    SUPPORT_EMAIL: "support@yourdomain.com"
  }
};
