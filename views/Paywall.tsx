
import React, { useState, useEffect } from 'react';
import { X, Check, Crown, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '../components/Button';
import { RevenueCatService } from '../services/revenueCatService';
import { PurchasesPackage } from '@revenuecat/purchases-capacitor';
import { Browser } from '@capacitor/browser';
import { CONFIG } from '../config';

interface PaywallProps {
  onClose: () => void;
  onSubscribeSuccess: () => void;
}

export const Paywall: React.FC<PaywallProps> = ({ onClose, onSubscribeSuccess }) => {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real products from Store
  useEffect(() => {
    const loadOfferings = async () => {
      try {
        const offerings = await RevenueCatService.getOfferings();
        if (offerings && offerings.current && offerings.current.availablePackages.length > 0) {
          setPackages(offerings.current.availablePackages);
          // Default to annual if available, otherwise first one
          const annual = offerings.current.availablePackages.find(p => p.packageType === 'ANNUAL');
          setSelectedPackage(annual || offerings.current.availablePackages[0]);
        } else {
          // Fallback for Web/Dev (Simulated)
          console.warn("No offerings found (Web mode or invalid keys)");
        }
      } catch (e) {
        console.error("Failed to load offerings", e);
      } finally {
        setInitializing(false);
      }
    };
    loadOfferings();
  }, []);

  const handleSubscribe = async () => {
    if (!selectedPackage) return;
    
    setLoading(true);
    setError(null);
    try {
      const isSuccess = await RevenueCatService.purchasePackage(selectedPackage);
      if (isSuccess) {
        onSubscribeSuccess();
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        setError("Transaction failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
        const isPro = await RevenueCatService.restorePurchases();
        if (isPro) {
            alert("Purchases restored successfully!");
            onSubscribeSuccess();
        } else {
            alert("No active subscriptions found to restore.");
        }
    } catch (e) {
        alert("Failed to restore purchases.");
    } finally {
        setLoading(false);
    }
  };

  const openLegal = async (type: 'terms' | 'privacy') => {
    const url = type === 'terms' ? CONFIG.URLS.TERMS_OF_USE : CONFIG.URLS.PRIVACY_POLICY;
    await Browser.open({ url });
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom duration-300 font-sans">
      {/* Header Image Area */}
      <div className="relative h-1/3 bg-brand-950 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-brand-900">
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        </div>
        
        <img 
          src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80" 
          alt="Premium interior" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white pt-[env(safe-area-inset-top)] mt-4 mr-2 hover:bg-black/60 transition-colors z-20"
        >
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 -mt-16 relative z-10 overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-600 rounded-2xl shadow-xl shadow-brand-600/30 mb-4 text-white ring-4 ring-white">
            <Crown size={36} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-black text-brand-900 mb-2 uppercase tracking-tight italic">Pro Edition</h1>
          <p className="text-gray-500 font-medium">Upgrade your garage. Build without limits.</p>
        </div>

        {/* Benefits */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 p-3 bg-brand-50 rounded-xl border border-brand-100">
            <div className="bg-brand-100 p-1.5 rounded-lg text-brand-600"><Check size={18} strokeWidth={3} /></div>
            <span className="font-bold text-brand-900">Unlimited AI Renderings</span>
          </div>
          <div className="flex items-center gap-3 px-3">
             <div className="bg-gray-100 p-1 rounded-full text-gray-600"><Check size={14} strokeWidth={3} /></div>
             <span className="font-medium text-gray-600">4K High-Res Downloads</span>
          </div>
        </div>

        {/* Loading State */}
        {initializing ? (
             <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                <Loader2 className="animate-spin" />
                <span className="text-xs uppercase tracking-widest">Loading Store...</span>
             </div>
        ) : packages.length > 0 ? (
            /* Real Store Packages */
            <div className="grid grid-cols-1 gap-4 mb-6">
              {packages.map((pkg) => (
                <button
                    key={pkg.identifier}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`relative p-4 rounded-xl border-2 transition-all text-left group ${
                    selectedPackage?.identifier === pkg.identifier
                    ? 'border-brand-600 bg-brand-50 shadow-md' 
                    : 'border-gray-100 bg-white hover:border-gray-300'
                    }`}
                >
                    {pkg.packageType === 'ANNUAL' && (
                        <div className="absolute -top-3 left-6 bg-brand-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        Best Value
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <div>
                            <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${selectedPackage?.identifier === pkg.identifier ? 'text-brand-600' : 'text-gray-400'}`}>
                                {pkg.packageType === 'ANNUAL' ? 'Yearly Access' : 'Monthly Access'}
                            </div>
                            <div className="font-black text-2xl text-brand-900">
                                {pkg.product.priceString}
                            </div>
                            <div className="text-xs text-gray-400 font-medium">
                                {pkg.packageType === 'ANNUAL' ? 'Billed once a year' : 'Billed monthly'}
                            </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPackage?.identifier === pkg.identifier ? 'border-brand-600 bg-brand-600 text-white' : 'border-gray-300'}`}>
                            {selectedPackage?.identifier === pkg.identifier && <Check size={14} strokeWidth={4} />}
                        </div>
                    </div>
                </button>
              ))}
            </div>
        ) : (
            /* Fallback/Dev UI when no packages found */
            <div className="mb-6 p-4 border border-yellow-200 bg-yellow-50 rounded-xl flex gap-3 text-yellow-800 text-sm">
                 <AlertTriangle className="shrink-0" />
                 <div>
                    <span className="font-bold block">Store Unavailable</span>
                    Could not connect to App Store. If you are in development mode, ensure RevenueCat keys are configured.
                 </div>
            </div>
        )}

        {/* Action */}
        <div className="mt-auto">
            {error && <p className="text-red-500 text-center text-sm mb-3">{error}</p>}
            
            <Button 
            fullWidth 
            onClick={handleSubscribe} 
            disabled={loading || !selectedPackage}
            className="mb-4 text-base shadow-xl shadow-brand-500/20"
            >
            {loading ? 'Processing...' : `Subscribe`}
            </Button>

            <div className="flex justify-center gap-6 text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                <button onClick={handleRestore} className="hover:text-brand-600 transition-colors">Restore Purchases</button>
                <button onClick={() => openLegal('terms')} className="hover:text-brand-600 transition-colors">Terms</button>
                <button onClick={() => openLegal('privacy')} className="hover:text-brand-600 transition-colors">Privacy</button>
            </div>
        </div>
      </div>
    </div>
  );
};
