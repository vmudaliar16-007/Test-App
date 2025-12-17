
import { Purchases, PurchasesOfferings, PurchasesPackage, CustomerInfo, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';
import { CONFIG } from '../config';

export class RevenueCatService {
  
  static async initialize() {
    if (Capacitor.getPlatform() === 'web') return;

    const apiKey = Capacitor.getPlatform() === 'ios' ? CONFIG.REVENUECAT.IOS_KEY : CONFIG.REVENUECAT.ANDROID_KEY;
    
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
    await Purchases.configure({ apiKey });
  }

  static async getOfferings(): Promise<PurchasesOfferings | null> {
    if (Capacitor.getPlatform() === 'web') return null;
    try {
      const offerings = await Purchases.getOfferings();
      return offerings;
    } catch (error) {
      console.error("Error fetching offerings", error);
      return null;
    }
  }

  static async purchasePackage(rcPackage: PurchasesPackage): Promise<boolean> {
    try {
      const { customerInfo } = await Purchases.purchasePackage({ aPackage: rcPackage });
      return this.isPro(customerInfo);
    } catch (error: any) {
      if (error.userCancelled) {
        // User cancelled, do nothing
        return false;
      }
      console.error("Purchase error", error);
      throw error;
    }
  }

  static async restorePurchases(): Promise<boolean> {
    if (Capacitor.getPlatform() === 'web') return false;
    try {
      const { customerInfo } = await Purchases.restorePurchases();
      return this.isPro(customerInfo);
    } catch (error) {
      console.error("Restore error", error);
      return false;
    }
  }

  static async checkSubscriptionStatus(): Promise<boolean> {
    if (Capacitor.getPlatform() === 'web') return false;
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return this.isPro(customerInfo);
    } catch (error) {
      return false;
    }
  }

  // Helper to parse the entitlement from RevenueCat info object
  private static isPro(info: CustomerInfo): boolean {
    const entitlement = info.entitlements.active[CONFIG.REVENUECAT.ENTITLEMENT_ID];
    return entitlement !== undefined;
  }
}
