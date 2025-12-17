
// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

export const CONFIG = {
  // GOOGLE GEMINI AI
  // 1. Get key from https://aistudio.google.com/
  // 2. IMPORTANT: Restrict this key in Google Cloud Console to your Android/iOS Bundle IDs
  GEMINI_API_KEY: "YOUR_GEMINI_API_KEY_HERE",

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
