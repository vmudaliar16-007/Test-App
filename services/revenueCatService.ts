
// MOCK REVENUE CAT SERVICE FOR WEB
// This replaces the actual RevenueCat SDK calls with local simulation
// to avoid build errors on Netlify/Web.

export interface MockPackage {
  identifier: string;
  packageType: 'ANNUAL' | 'MONTHLY';
  product: {
    priceString: string;
    title: string;
  };
}

export class RevenueCatService {
  
  static async initialize() {
    console.log("Mock Store Initialized (Web Mode)");
  }

  static async getOfferings(): Promise<{ current: { availablePackages: MockPackage[] } } | null> {
    // Return fake products for the paywall
    return {
      current: {
        availablePackages: [
          {
            identifier: 'pro_yearly_fake',
            packageType: 'ANNUAL',
            product: {
              priceString: '$29.99/yr',
              title: 'Pro Annual'
            }
          },
          {
            identifier: 'pro_monthly_fake',
            packageType: 'MONTHLY',
            product: {
              priceString: '$4.99/mo',
              title: 'Pro Monthly'
            }
          }
        ]
      }
    };
  }

  static async purchasePackage(rcPackage: any): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Set local flag
    localStorage.setItem('vanvision_is_pro', 'true');
    return true;
  }

  static async restorePurchases(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const isPro = localStorage.getItem('vanvision_is_pro') === 'true';
    return isPro;
  }

  static async checkSubscriptionStatus(): Promise<boolean> {
    const isPro = localStorage.getItem('vanvision_is_pro') === 'true';
    return isPro;
  }
}
