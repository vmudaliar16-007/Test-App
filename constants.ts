
import { DesignMode, InteriorStyle, VanType } from "./types";
import { Zap, Layout, PaintBucket, Truck, Tent, Home } from "lucide-react";

export const FREE_GENERATION_LIMIT = 5;

export const PRICING_PLANS = {
  MONTHLY: {
    id: 'monthly',
    price: '$3.00',
    period: 'month',
    label: 'Monthly'
  },
  YEARLY: {
    id: 'yearly',
    price: '$15.00',
    period: 'year',
    label: 'Yearly',
    saveLabel: 'Save 58%'
  }
};

export const MODE_OPTIONS = [
  {
    id: DesignMode.FULL,
    title: "Full Remodel",
    description: "Complete overhaul of the existing interior.",
    icon: Zap
  },
  {
    id: DesignMode.EMPTY,
    title: "Empty Remodel",
    description: "Design from an empty cargo shell.",
    icon: Layout
  },
  {
    id: DesignMode.PARTIAL,
    title: "Partial Refresh",
    description: "Keep layout, update materials and vibe.",
    icon: PaintBucket
  }
];

export const TYPE_OPTIONS = [
  { id: VanType.CAMPING, title: "Camping", icon: Tent },
  { id: VanType.TRAVEL, title: "Travel", icon: Truck },
  { id: VanType.LIVING, title: "Living", icon: Home },
  { id: VanType.SPRINTER, title: "Sprinter", icon: Truck },
];

export const STYLE_OPTIONS = [
  { 
    id: InteriorStyle.MINIMAL, 
    title: "Minimalist", 
    color: "bg-gray-100",
    imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80"
  },
  { 
    id: InteriorStyle.MODERN, 
    title: "Modern", 
    color: "bg-slate-200",
    imageUrl: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=400&q=80"
  },
  { 
    id: InteriorStyle.BOHO, 
    title: "Boho", 
    color: "bg-orange-100",
    imageUrl: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=400&q=80"
  },
  { 
    id: InteriorStyle.RUSTIC, 
    title: "Rustic", 
    color: "bg-amber-100",
    imageUrl: "https://images.unsplash.com/photo-1652268728569-f35ef9099166?q=80&w=435&auto=format&fit=crop&w=400&q=80"
  },
  { 
    id: InteriorStyle.LUXURY, 
    title: "Luxury", 
    color: "bg-stone-200",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80"
  },
];

export const INSPIRATION_SAMPLES = [
  {
    id: 1,
    title: "Cozy Weekender",
    category: "Camping • Boho",
    image: "https://images.unsplash.com/photo-1758983065583-9cea714214f9?q=80&w=387&auto=format&fit=crop&&w=600&q=80"
  },
  {
    id: 2,
    title: "Digital Nomad Setup",
    category: "Living • Modern",
    image: "https://images.unsplash.com/photo-1760278041881-e64e501d009c?q=80&w=327&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Alpine Explorer",
    category: "Travel • Rustic",
    image: "https://images.unsplash.com/photo-1652268728569-f35ef9099166?q=80&w=435&auto=format&fit=crop&w=600&q=80"
  }
];

export const DISCLAIMER_TEXT = "Designs are conceptual and for inspiration only. AI generated results may vary from actual structural possibilities.";
