
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { UserSubscription } from '../types';
import { Crown, Zap, RefreshCcw, FileText, Shield } from 'lucide-react';
import { RevenueCatService } from '../services/revenueCatService';
import { Browser } from '@capacitor/browser';
import { CONFIG } from '../config';

interface SettingsProps {
  onBack: () => void;
  onClearData: () => void;
  subscription: UserSubscription;
  onOpenPaywall: () => void;
  onProStatusRestored: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  onBack, 
  onClearData, 
  subscription,
  onOpenPaywall,
  onProStatusRestored
}) => {
  const [cleared, setCleared] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const handleClear = () => {
    if(window.confirm("Delete all saved designs and data? This cannot be undone.")) {
      onClearData();
      setCleared(true);
      setTimeout(() => setCleared(false), 2000);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
        const isPro = await RevenueCatService.restorePurchases();
        if (isPro) {
            alert("Purchases restored successfully! You now have Pro access.");
            onProStatusRestored();
        } else {
            alert("No active subscriptions found to restore.");
        }
    } catch (e) {
        alert("Failed to connect to store.");
    } finally {
        setRestoring(false);
    }
  };

  const openUrl = async (url: string) => {
    await Browser.open({ url });
  };

  const remaining = Math.max(0, subscription.freeLimit - subscription.generationsUsed);

  return (
    <div className="h-full flex flex-col bg-brand-50">
      <Header title="Settings" onBack={onBack} />
      
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        
        {/* Subscription Card */}
        <section>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Membership</h3>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
             <div className="p-6 text-center">
                {subscription.isPro ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 mb-2">
                       <Crown size={24} fill="currentColor" />
                    </div>
                    <h2 className="text-xl font-bold text-brand-900">Pro Member</h2>
                    <p className="text-sm text-gray-500 mt-1">Unlimited Access Active</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                     <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 mb-2">
                       <Zap size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Free Plan</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {remaining} / {subscription.freeLimit} free designs remaining
                    </p>
                    <Button onClick={onOpenPaywall} className="mt-4 w-full" variant="primary">
                       Upgrade to Pro
                    </Button>
                    <button 
                        onClick={handleRestore}
                        disabled={restoring}
                        className="mt-3 text-xs text-gray-400 font-medium flex items-center gap-1 hover:text-brand-600"
                    >
                        {restoring ? 'Connecting...' : <><RefreshCcw size={10} /> Restore Purchases</>}
                    </button>
                  </div>
                )}
             </div>
          </div>
        </section>

        {/* Legal & Privacy */}
        <section>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Legal</h3>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm divide-y divide-gray-100">
             <button onClick={() => openUrl(CONFIG.URLS.PRIVACY_POLICY)} className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 text-left">
                <Shield size={18} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Privacy Policy</span>
             </button>
             <button onClick={() => openUrl(CONFIG.URLS.TERMS_OF_USE)} className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 text-left">
                <FileText size={18} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Terms of Use</span>
             </button>
          </div>
        </section>

        {/* Data Management */}
        <section>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Data Management</h3>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <p className="font-medium text-gray-800">Local Storage Only</p>
              <p className="text-xs text-gray-500 mt-1">
                Your photos and designs are stored directly on your device. We do not host your images.
              </p>
            </div>
            <div className="p-4">
              <Button variant="ghost" className="text-red-500 w-full justify-start pl-0 hover:bg-red-50" onClick={handleClear}>
                {cleared ? "Data Cleared" : "Delete All App Data"}
              </Button>
            </div>
          </div>
        </section>

        <section className="pb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">About</h3>
          <div className="text-center text-gray-400 text-sm">
            <p>AI Van Lifestyle v1.2</p>
            <p className="mt-2 text-xs">Built for iOS & Android</p>
          </div>
        </section>
      </div>
    </div>
  );
};
