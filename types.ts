
export enum AppView {
  SPLASH = 'SPLASH',
  HOME = 'HOME',
  UPLOAD = 'UPLOAD',
  CONFIGURE = 'CONFIGURE',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS',
  SAVED = 'SAVED',
  SETTINGS = 'SETTINGS',
  PAYWALL = 'PAYWALL',
}

export enum DesignMode {
  FULL = 'Full Remodel',
  EMPTY = 'Empty Remodel',
  PARTIAL = 'Partial Remodel',
}

export enum VanType {
  CAMPING = 'Camping Van',
  TRAVEL = 'Travel/Touring',
  LIVING = 'Full-time Living',
  SPRINTER = 'Sprinter/High Roof',
  VINTAGE = 'Vintage/Bus',
}

export enum InteriorStyle {
  MINIMAL = 'Minimalist',
  MODERN = 'Modern Clean',
  BOHO = 'Boho Chic',
  RUSTIC = 'Rustic Cabin',
  LUXURY = 'High-End Luxury',
}

export interface DesignState {
  originalImage: string | null; // Base64
  mode: DesignMode | null;
  vanType: VanType | null;
  style: InteriorStyle | null;
  generatedImages: string[]; // Array of Base64 strings
}

export interface SavedDesign {
  id: string;
  date: number;
  originalImage: string;
  generatedImage: string;
  style: InteriorStyle;
  mode: DesignMode;
}

export interface UserSubscription {
  isPro: boolean;
  generationsUsed: number;
  freeLimit: number;
}
