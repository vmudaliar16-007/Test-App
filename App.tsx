
import React, { useState, useEffect } from 'react';
import { AppView, DesignState, DesignMode, VanType, InteriorStyle, SavedDesign, UserSubscription } from './types';
import { Splash } from './views/Splash';
import { Home } from './views/Home';
import { Upload } from './views/Upload';
import { Configuration } from './views/Configuration';
import { Processing } from './views/Processing';
import { Results } from './views/Results';
import { SavedDesigns } from './views/SavedDesigns';
import { Settings } from './views/Settings';
import { Paywall } from './views/Paywall';
import { generateRedesign } from './services/geminiService';
import { RevenueCatService } from './services/revenueCatService';
import { FREE_GENERATION_LIMIT } from './constants';
import { 
  saveDesignToDB, 
  getAllDesignsFromDB, 
  deleteDesignFromDB, 
  clearDesignsFromDB 
} from './services/storageService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.SPLASH);
  
  // Design State
  const [currentDesign, setCurrentDesign] = useState<DesignState>({
    originalImage: null,
    mode: null,
    vanType: null,
    style: null,
    generatedImages: []
  });

  // Persisted State
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  
  // Subscription State
  const [subscription, setSubscription] = useState<UserSubscription>({
    isPro: false,
    generationsUsed: 0,
    freeLimit: FREE_GENERATION_LIMIT
  });

  // Load Data
  useEffect(() => {
    // 1. Initialize Mock Store
    const initApp = async () => {
       await RevenueCatService.initialize();
       const isPro = await RevenueCatService.checkSubscriptionStatus();
       setSubscription(prev => ({ ...prev, isPro }));
    };
    initApp();

    // 2. Load designs from IndexedDB
    const loadDesigns = async () => {
      try {
        const designs = await getAllDesignsFromDB();
        setSavedDesigns(designs);
      } catch (e) {
        console.error("Failed to load saved designs from DB", e);
      }
    };
    loadDesigns();

    // 3. Load subscription usage (local tracking for free tier)
    const loadedSub = localStorage.getItem('vanvision_sub');
    if (loadedSub) {
      try {
        const parsed = JSON.parse(loadedSub);
        setSubscription(prev => ({
          ...prev,
          generationsUsed: parsed.generationsUsed || 0
        }));
      } catch (e) { console.error("Failed to load subscription"); }
    }
  }, []);

  const updateSubscription = (newSub: UserSubscription) => {
    setSubscription(newSub);
    try {
      localStorage.setItem('vanvision_sub', JSON.stringify(newSub));
    } catch (e) {
      console.warn("Could not save subscription status", e);
    }
  };

  const handleClearData = async () => {
    try {
      await clearDesignsFromDB();
      setSavedDesigns([]);
      
      updateSubscription({
        isPro: subscription.isPro, // Keep pro status if it exists
        generationsUsed: 0,
        freeLimit: FREE_GENERATION_LIMIT
      });
      
      setCurrentDesign({
        originalImage: null,
        mode: null,
        vanType: null,
        style: null,
        generatedImages: []
      });
      
      setView(AppView.HOME);
    } catch (e) {
      alert("Failed to clear data.");
    }
  };

  const handleStartProject = () => {
    // Reset state for new project
    setCurrentDesign({
      originalImage: null,
      mode: null,
      vanType: null,
      style: null,
      generatedImages: []
    });
    setView(AppView.UPLOAD);
  };

  const handleGenerate = async (mode: DesignMode, type: VanType, style: InteriorStyle) => {
    if (!currentDesign.originalImage) return;

    if (!subscription.isPro && subscription.generationsUsed >= subscription.freeLimit) {
      setView(AppView.PAYWALL);
      return;
    }

    setCurrentDesign(prev => ({ ...prev, mode, vanType: type, style }));
    setView(AppView.PROCESSING);

    try {
      const images = await generateRedesign(
        currentDesign.originalImage,
        mode,
        type,
        style
      );
      
      if (!subscription.isPro) {
        updateSubscription({
          ...subscription,
          generationsUsed: subscription.generationsUsed + 1
        });
      }

      setCurrentDesign(prev => ({ ...prev, generatedImages: images }));
      setView(AppView.RESULTS);
    } catch (error: any) {
      console.error(error);
      // Show actual error message if available (e.g. "API Key missing")
      const msg = error.message || "Failed to generate design. Please check your connection.";
      alert(msg);
      setView(AppView.CONFIGURE);
    }
  };

  const handleUpgradeSuccess = () => {
    updateSubscription({
      ...subscription,
      isPro: true
    });
    
    // If we have a pending design, go back to configure
    if (currentDesign.originalImage) {
        setView(AppView.CONFIGURE);
    } else {
        setView(AppView.HOME);
    }
  };

  const handleSaveDesign = async () => {
    if (!currentDesign.originalImage || currentDesign.generatedImages.length === 0 || !currentDesign.style || !currentDesign.mode) return;
    
    const newDesign: SavedDesign = {
      id: Date.now().toString(),
      date: Date.now(),
      originalImage: currentDesign.originalImage,
      generatedImage: currentDesign.generatedImages[0], 
      style: currentDesign.style,
      mode: currentDesign.mode
    };
    
    try {
      await saveDesignToDB(newDesign);
      setSavedDesigns(prev => [newDesign, ...prev]);
    } catch (e) {
      console.error("Storage Error", e);
      alert("Failed to save design. Your device storage might be full.");
    }
  };

  const handleDeleteSaved = async (id: string) => {
    try {
      await deleteDesignFromDB(id);
      setSavedDesigns(prev => prev.filter(d => d.id !== id));
    } catch (e) {
      console.error("Failed to delete", e);
    }
  };

  const renderView = () => {
    switch (view) {
      case AppView.SPLASH:
        return <Splash onComplete={() => setView(AppView.HOME)} />;
      
      case AppView.HOME:
        return <Home 
          onNewProject={handleStartProject}
          onOpenSaved={() => setView(AppView.SAVED)}
          onOpenSettings={() => setView(AppView.SETTINGS)}
          savedDesigns={savedDesigns}
          subscription={subscription}
        />;
      
      case AppView.UPLOAD:
        return <Upload 
          onBack={() => setView(AppView.HOME)}
          onNext={(img) => {
            setCurrentDesign(prev => ({ ...prev, originalImage: img }));
            setView(AppView.CONFIGURE);
          }}
        />;
      
      case AppView.CONFIGURE:
        return <Configuration 
          onBack={() => setView(AppView.UPLOAD)}
          onGenerate={handleGenerate}
        />;
      
      case AppView.PROCESSING:
        return <Processing />;
      
      case AppView.RESULTS:
        return <Results 
          originalImage={currentDesign.originalImage || ''}
          generatedImages={currentDesign.generatedImages}
          onBack={() => setView(AppView.CONFIGURE)}
          onSave={handleSaveDesign}
          onDiscard={() => setView(AppView.HOME)}
        />;

      case AppView.SAVED:
        return <SavedDesigns 
          onBack={() => setView(AppView.HOME)}
          designs={savedDesigns}
          onDelete={handleDeleteSaved}
        />;

      case AppView.SETTINGS:
        return <Settings 
            onBack={() => setView(AppView.HOME)}
            onClearData={handleClearData}
            subscription={subscription}
            onOpenPaywall={() => setView(AppView.PAYWALL)}
            onProStatusRestored={() => updateSubscription({ ...subscription, isPro: true })}
        />;

      case AppView.PAYWALL:
        return <Paywall 
            onClose={() => setView(AppView.HOME)} 
            onSubscribeSuccess={handleUpgradeSuccess}
        />;
        
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-screen bg-white relative overflow-hidden flex flex-col font-sans">
      {renderView()}
    </div>
  );
};

export default App;
