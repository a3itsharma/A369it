import React, { useState, useEffect } from 'react';
import { MarsHeroScene, TeslaTridentScene } from './components/TeslaScenes';
import { ChapterCard, ExperimentVisual } from './components/TeslaStory';
import { IllustrationGallery } from './components/IllustrationGallery';
import { TeslaPuzzles } from './components/TeslaPuzzles';
import { Logo } from './src/components/Logo';
import { AuthModal } from './src/components/AuthModal';
import { auth } from './src/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { loadStripe } from '@stripe/stripe-js';
import { ArrowDown, Menu, X, Zap, Star, Book, Info, Play, Loader2, Image as ImageIcon, Lock, User as UserIcon, LogOut, CreditCard, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");
  const [isProUnlocked, setIsProUnlocked] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : true; // Default to dark mode for this Martian theme
    }
    return true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    // Check for payment success in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      setIsProUnlocked(true);
      // In a real app, you'd verify this on the server and update the user's profile
    }

    const checkApiKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkApiKey();
    
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const generateCinematicVideo = async () => {
    if (!hasApiKey) {
      await handleSelectKey();
    }

    setIsVideoGenerating(true);
    setGenerationStatus("Initializing Martian transmission...");
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      setGenerationStatus("Calibrating Tesla Tower frequencies...");
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: 'A cinematic high-definition wide shot of a glowing Tesla Tower on the red plains of Mars. Electric blue arcs of energy leap from the tower into a dark starry sky, forming a shimmering ladder of light. In the foreground, a young girl named Mira and a gentle robot with a silver humming helmet watch in awe. The atmosphere is optimistic, vibrant, and magical.',
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      setGenerationStatus("Rendering the City of Glass...");
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
        
        // Update status messages periodically
        const statuses = [
          "Weaving the shield of light...",
          "Capturing the ozone and lemon sparks...",
          "Stabilizing the Martian horizon...",
          "Finalizing the cinematic vision..."
        ];
        setGenerationStatus(statuses[Math.floor(Math.random() * statuses.length)]);
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': process.env.API_KEY || '',
          },
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setGeneratedVideoUrl(url);
      }
    } catch (error: any) {
      console.error("Video generation failed:", error);
      const errorStr = typeof error === 'object' ? JSON.stringify(error) : String(error);
      if (errorStr.includes("Requested entity was not found") || errorStr.includes("PERMISSION_DENIED") || errorStr.includes("403")) {
        setHasApiKey(false);
        alert("API key session expired or lacks permission. Please select a valid paid API key and try again.");
        await handleSelectKey();
      } else {
        alert("The Martian storm was too strong. Please try again later.");
      }
    } finally {
      setIsVideoGenerating(false);
      setGenerationStatus("");
    }
  };

  const handleUpgrade = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    setIsUpgrading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const session = await response.json();
      
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      if (stripe) {
        await (stripe as any).redirectToCheckout({ sessionId: session.id });
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const chapters = [
    {
      number: 1,
      title: "The Spark on the Red Plain",
      summary: "Mira follows a trail of tiny blue sparks across the red plain and discovers Tesla, a gentle machine in a humming silver helmet.",
      passage: "The sparks smelled faintly of ozone and lemon. Mira crouched and cupped one in her palm; it tickled like a tiny, warm beetle."
    },
    {
      number: 2,
      title: "The Helmet That Hummed",
      summary: "Tesla’s helmet is revealed to be a listening and learning device. Mira learns to hear the planet’s currents.",
      passage: "Tesla taught Mira to feel the ground’s heartbeat: a slow, patient thrum under the rocks."
    },
    {
      number: 3,
      title: "Drones in the Dust",
      summary: "Wobbling drones lead Mira and Tesla to an old forgotten Tesla coil. They repair it, learning teamwork and basic circuitry.",
      passage: "Pip the drone wobbled above the cracked ground, its sensors chirping as Mira tightened the final copper wire."
    },
    {
      number: 4,
      title: "The Tesla Tower’s Secret",
      summary: "Mira and Tesla explore the tower’s inner library of blueprints and sky maps. They learn the tower’s original mission.",
      passage: "Inside the tower, blueprints glowed like stars against the dark obsidian walls."
    },
    {
      number: 5,
      title: "Wings of the Red Wind",
      summary: "Mira meets Lio, a flying humanoid who teaches her to navigate the Martian thermal currents using a specialized jetpack.",
      passage: "The wind didn't just push; it invited. Lio banked left, a streak of silver against the orange sky, and Mira followed, her heart racing as fast as her turbines."
    },
    {
      number: 6,
      title: "The Experiment That Glowed",
      summary: "Mira and Tesla stage a careful experiment to light a skyway. The experiment succeeds spectacularly.",
      passage: "The ribbon did not scream or burn; it sang. It threaded through the Tesla Tower’s coils and leapt into the sky like a ladder of lanterns."
    },
    {
      number: 7,
      title: "The Shield of Sapphire",
      summary: "A massive Martian dust storm threatens the City of Glass. Mira and Tesla must use the tower to create an electromagnetic shield.",
      passage: "The sky turned the color of a bruised plum. Tesla adjusted the final dial, and a web of sapphire light unfurled above the domes, catching the first strike of the storm."
    }
  ];

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen selection:bg-electric-blue selection:text-space-dark">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 dark:bg-space-dark/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10 py-4' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Logo className="cursor-pointer" />
          
          <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-[0.2em] uppercase">
            <a href="#story" onClick={scrollToSection('story')} className="hover:text-electric-blue transition-colors">The Journey</a>
            <a href="#gallery" onClick={scrollToSection('gallery')} className="hover:text-electric-blue transition-colors">Illustrations</a>
            <a href="#experiment" onClick={scrollToSection('experiment')} className="hover:text-electric-blue transition-colors">The Experiment</a>
            
            <div className="h-4 w-px bg-white/10 mx-2"></div>

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-matte-charcoal dark:text-tesla-silver"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="h-4 w-px bg-white/10 mx-2"></div>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-tesla-silver/60">
                  <UserIcon size={14} />
                  <span className="normal-case tracking-normal">{user.email?.split('@')[0]}</span>
                </div>
                {!isProUnlocked && (
                  <button 
                    onClick={handleUpgrade}
                    disabled={isUpgrading}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-500 transition-all text-[10px]"
                  >
                    {isUpgrading ? <Loader2 size={12} className="animate-spin" /> : <CreditCard size={12} />}
                    GO PRO
                  </button>
                )}
                <button onClick={() => signOut(auth)} className="text-tesla-silver/40 hover:text-red-400 transition-colors">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="px-6 py-2 border border-electric-blue/30 text-electric-blue rounded-full hover:bg-electric-blue hover:text-space-dark transition-all"
              >
                SIGN IN
              </button>
            )}
          </div>

          <button className="md:hidden text-tesla-silver" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-40 bg-white dark:bg-space-dark flex flex-col items-center justify-center gap-8 text-2xl font-serif"
          >
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="absolute top-8 right-8 p-3 rounded-full bg-black/5 dark:bg-white/10 text-matte-charcoal dark:text-tesla-silver"
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <a href="#story" onClick={scrollToSection('story')} className="hover:text-electric-blue">The Journey</a>
            <a href="#gallery" onClick={scrollToSection('gallery')} className="hover:text-electric-blue">Illustrations</a>
            <a href="#experiment" onClick={scrollToSection('experiment')} className="hover:text-electric-blue">The Experiment</a>
            <a href="#trident" onClick={scrollToSection('trident')} className="hover:text-electric-blue">The Trident</a>
            <button className="px-8 py-3 bg-electric-blue text-space-dark rounded-full font-bold text-lg">Download PDF</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        {generatedVideoUrl ? (
          <video 
            src={generatedVideoUrl} 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        ) : (
          <MarsHeroScene />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 dark:from-space-dark/20 via-transparent to-white dark:to-space-dark z-0"></div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="font-cursive text-7xl md:text-8xl lg:text-9xl font-bold mb-8 leading-none"
          >
            The Tesla <br/>
            <span className="shimmer-text font-normal">Trident of Mars</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-matte-charcoal/70 dark:text-tesla-silver/70 font-light leading-relaxed mb-12"
          >
            Mira and Tesla embark on a journey across the red plains to unlock the secrets of the City of Glass and the ancient Tower of Light.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center justify-center gap-8"
          >
             {!generatedVideoUrl && (
               isVideoGenerating ? (
                 <div className="flex flex-col items-center gap-3">
                   <div className="px-8 py-4 bg-electric-blue/50 text-space-dark rounded-full font-bold flex items-center gap-3 cursor-not-allowed">
                     <Loader2 className="animate-spin" size={20} />
                     <span>Generating Video...</span>
                   </div>
                   <span className="text-xs font-bold tracking-widest text-electric-blue uppercase animate-pulse">
                     {generationStatus}
                   </span>
                 </div>
               ) : (
                 <button 
                   onClick={generateCinematicVideo}
                   className="px-8 py-4 bg-electric-blue text-space-dark rounded-full font-bold hover:bg-white transition-all shadow-xl flex items-center gap-3"
                 >
                   <Play size={20} />
                   <span>Generate Cinematic Intro</span>
                 </button>
               )
             )}

             <a href="#story" onClick={scrollToSection('story')} className="group flex flex-col items-center gap-4 text-[10px] font-black tracking-[0.3em] text-matte-charcoal/40 dark:text-tesla-silver/40 hover:text-electric-blue dark:hover:text-electric-blue transition-colors mt-4">
                <span>BEGIN JOURNEY</span>
                <div className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:border-electric-blue dark:group-hover:border-electric-blue transition-colors">
                  <ArrowDown size={16} className="animate-bounce" />
                </div>
             </a>
          </motion.div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Story Section */}
        <section id="story" className="py-12 md:py-20 container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
            <div className="lg:col-span-4 sticky top-32">
              <div className="text-electric-blue text-xs font-black tracking-[0.3em] uppercase mb-4">THE MANUSCRIPT</div>
              <h2 className="font-serif text-5xl mb-8 leading-tight shimmer-text">Expanded <br/>Chapters</h2>
              <div className="w-20 h-1 mars-gradient mb-8 shimmer-foil"></div>
              <p className="text-tesla-silver/60 leading-relaxed text-lg">
                Deepening character arcs for Mira and Tesla, adding vivid sensory detail and introducing scientific curiosity.
              </p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {chapters.map((ch) => (
                <ChapterCard key={ch.number} {...ch} />
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <div className="relative">
          {!isProUnlocked && (
            <div className="absolute inset-0 z-20 bg-white/60 dark:bg-space-dark/60 backdrop-blur-md flex items-center justify-center p-6">
              <TeslaPuzzles onUnlock={() => setIsProUnlocked(true)} />
            </div>
          )}
          <IllustrationGallery hasApiKey={hasApiKey} onSelectKey={handleSelectKey} />
        </div>

        {/* Experiment Section */}
        <section id="experiment" className="py-12 md:py-20 bg-black/5 dark:bg-white/5 border-y border-black/5 dark:border-white/5">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-electric-blue/10 text-electric-blue text-[10px] font-black tracking-[0.3em] uppercase rounded-full mb-6 border border-electric-blue/20">
                <Star size={12} /> CHAPTER 6 HIGHLIGHT
              </div>
              <h2 className="font-serif text-5xl md:text-6xl mb-8 shimmer-text">The Experiment That Glowed</h2>
              <p className="text-xl text-tesla-silver/70 leading-relaxed font-light">
                Mira’s hands trembled only a little when she lifted the trident. It felt heavier than it looked, as if it carried the memory of storms and songs.
              </p>
              
              <div className="mt-12 flex flex-col items-center">
                {!isProUnlocked ? (
                  <div className="glass-card p-8 border-dashed border-electric-blue/30 flex flex-col items-center gap-4">
                    <Lock className="text-electric-blue/40" size={32} />
                    <p className="text-sm text-tesla-silver/40 uppercase tracking-widest font-bold">Pro Feature Locked</p>
                    <p className="text-xs text-tesla-silver/60 text-center max-w-xs">Solve the calibration puzzles in the Illustrations section to unlock Cinematic Visions.</p>
                  </div>
                ) : !generatedVideoUrl && !isVideoGenerating ? (
                  <button 
                    onClick={generateCinematicVideo}
                    className="group flex items-center gap-3 px-8 py-4 bg-electric-blue text-space-dark rounded-full font-bold hover:bg-white transition-all electric-glow"
                  >
                    <Play size={20} fill="currentColor" />
                    GENERATE CINEMATIC VISION
                  </button>
                ) : isVideoGenerating ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-4 border-electric-blue/20 border-t-electric-blue animate-spin"></div>
                    <div className="text-electric-blue font-serif italic text-xl animate-pulse">
                      {generationStatus}
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <video 
                      src={generatedVideoUrl!} 
                      controls 
                      autoPlay 
                      loop 
                      className="w-full aspect-video object-cover"
                    />
                    <button 
                      onClick={() => setGeneratedVideoUrl(null)}
                      className="mt-4 text-xs text-tesla-silver/40 hover:text-electric-blue transition-colors uppercase tracking-widest"
                    >
                      Generate New Vision
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <ExperimentVisual />
              <div className="space-y-8">
                <div className="glass-card p-8 border-l-4 border-l-electric-blue">
                  <p className="font-serif italic text-2xl text-tesla-silver leading-relaxed">
                    "The ribbon did not scream or burn; it sang. It threaded through the Tesla Tower’s coils and leapt into the sky like a ladder of lanterns."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trident Showcase */}
        <section id="trident" className="py-12 md:py-20 container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="font-serif text-5xl mb-4 shimmer-text">The Trident of Mars</h2>
            <p className="text-tesla-silver/60 leading-relaxed text-lg">
              A powerful artifact pulsing with raw Martian energy.
            </p>
          </div>
          <div className="h-[600px] glass-card overflow-hidden relative w-full max-w-5xl mx-auto">
            <TeslaTridentScene />
          </div>
        </section>

        {/* Activity Section */}
        <section className="py-12 md:py-20 mars-gradient">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-serif text-5xl mb-8 text-white">Ready for Adventure?</h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              The back matter includes activity pages, teacher guides and a glossary to keep the Martian curiosity growing.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="px-10 py-4 bg-space-dark text-white rounded-full font-bold hover:bg-white hover:text-space-dark transition-all shadow-2xl">
                View Activity Page
              </button>
              <button className="px-10 py-4 border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-space-dark transition-all">
                Teacher's Guide
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-space-dark border-t border-black/5 dark:border-white/5 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 mars-gradient rounded-lg flex items-center justify-center text-white">
                  <Zap size={16} />
                </div>
                <span className="font-serif font-bold text-xl tracking-wider text-matte-charcoal dark:text-tesla-silver">
                  TESLA <span className="text-electric-blue">TRIDENT</span>
                </span>
              </div>
              <p className="text-tesla-silver/40 text-sm leading-relaxed">
                A sci-fi novel reimagined as a high-definition colorful interactive experience.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div>
                <h5 className="text-matte-charcoal dark:text-white font-bold text-xs tracking-widest uppercase mb-6">Story</h5>
                <ul className="space-y-4 text-sm text-tesla-silver/40">
                  <li><a href="#story" onClick={scrollToSection('story')} className="hover:text-electric-blue">The Journey</a></li>
                  <li><a href="#gallery" onClick={scrollToSection('gallery')} className="hover:text-electric-blue">Illustrations</a></li>
                  <li><a href="#experiment" onClick={scrollToSection('experiment')} className="hover:text-electric-blue">The Experiment</a></li>
                  <li><a href="#trident" onClick={scrollToSection('trident')} className="hover:text-electric-blue">The Trident</a></li>
                </ul>
              </div>
              <div>
                <h5 className="text-matte-charcoal dark:text-white font-bold text-xs tracking-widest uppercase mb-6">Resources</h5>
                <ul className="space-y-4 text-sm text-tesla-silver/40">
                  <li><a href="#" className="hover:text-electric-blue">Teacher Guide</a></li>
                  <li><a href="#" className="hover:text-electric-blue">Activities</a></li>
                  <li><a href="#" className="hover:text-electric-blue">Glossary</a></li>
                </ul>
              </div>
              <div>
                <h5 className="text-matte-charcoal dark:text-white font-bold text-xs tracking-widest uppercase mb-6">Legal</h5>
                <ul className="space-y-4 text-sm text-tesla-silver/40">
                  <li><a href="#" className="hover:text-electric-blue">Privacy</a></li>
                  <li><a href="#" className="hover:text-electric-blue">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-black/5 dark:border-white/5 text-[10px] font-black tracking-[0.2em] text-matte-charcoal/20 dark:text-tesla-silver/20 uppercase">
            <div>© 2026 Amit. All Rights Reserved.</div>
            <div className="flex gap-8">
              <span>Designed with AI</span>
              <span>Mars Colony 01</span>
            </div>
          </div>
        </div>
      </footer>
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
};

export default App;
