import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Settings, CheckCircle2, Lock, Unlock, RefreshCw, Info } from 'lucide-react';

interface PuzzleProps {
  onUnlock: () => void;
}

export const TeslaPuzzles: React.FC<PuzzleProps> = ({ onUnlock }) => {
  const [activePuzzle, setActivePuzzle] = useState<number>(1);
  const [puzzle1Solved, setPuzzle1Solved] = useState(false);
  const [puzzle2Solved, setPuzzle2Solved] = useState(false);
  const [puzzle3Solved, setPuzzle3Solved] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Puzzle 1: Rotating Magnetic Field (Phase Alignment)
  const [phase, setPhase] = useState(0);
  const targetPhase = 90; 

  // Puzzle 2: Magnifying Transmitter (Resonance Tuning)
  const [frequency, setFrequency] = useState(50);
  const targetFrequency = 88; 

  // Puzzle 3: Telautomaton Navigation (Signal Matching)
  const [signal, setSignal] = useState(0);
  const targetSignal = 72;

  const checkPuzzle1 = () => {
    if (Math.abs(phase - targetPhase) < 5) {
      setPuzzle1Solved(true);
      setTimeout(() => setActivePuzzle(2), 1500);
    }
  };

  const checkPuzzle2 = () => {
    if (Math.abs(frequency - targetFrequency) < 2) {
      setPuzzle2Solved(true);
      setTimeout(() => setActivePuzzle(3), 1500);
    }
  };

  const checkPuzzle3 = () => {
    if (Math.abs(signal - targetSignal) < 3) {
      setPuzzle3Solved(true);
      setTimeout(() => {
        onUnlock();
      }, 1500);
    }
  };

  return (
    <div className="glass-card p-16 max-w-2xl mx-auto mt-12 relative overflow-hidden bg-matte-charcoal/60">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
        <Settings size={200} className="animate-spin-slow" />
      </div>

      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 mars-gradient rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl">
              <Lock size={32} />
            </div>
            <h3 className="font-serif text-5xl mb-8 text-white">Unlock Pro Features</h3>
            <p className="text-tesla-silver/40 mb-12 leading-relaxed text-xl font-light">
              To access the advanced Martian transmissions (Cinematic Video & Full Gallery), 
              you must first calibrate the Tesla Tower by solving the fundamental puzzles 
              of his greatest inventions.
            </p>
            <button
              onClick={() => setShowIntro(false)}
              className="px-12 py-5 bg-white/5 border border-white/10 text-tesla-silver/80 rounded-full font-bold hover:bg-white hover:text-space-dark transition-all shadow-2xl tracking-widest text-xs"
            >
              BEGIN CALIBRATION
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="puzzles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex gap-2 mb-8">
              <div className={`h-1 flex-1 rounded-full transition-colors ${puzzle1Solved ? 'bg-emerald-500' : 'bg-electric-blue/20'}`}></div>
              <div className={`h-1 flex-1 rounded-full transition-colors ${puzzle2Solved ? 'bg-emerald-500' : 'bg-electric-blue/20'}`}></div>
              <div className={`h-1 flex-1 rounded-full transition-colors ${puzzle3Solved ? 'bg-emerald-500' : 'bg-electric-blue/20'}`}></div>
            </div>

            {activePuzzle === 1 && (
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-electric-blue">
                    <RefreshCw size={20} className={puzzle1Solved ? "" : "animate-spin-slow"} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Puzzle 1: The Rotating Field</h4>
                    <p className="text-xs text-tesla-silver/40 uppercase tracking-widest">PDF Page 32 Reference</p>
                  </div>
                </div>

                <p className="text-base text-tesla-silver/50 italic font-light">
                  "Polyphase currents create a rotating magnetic field. Align the secondary phase to exactly 90° to achieve perfect rotation."
                </p>

                <div className="relative h-40 bg-space-dark/50 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
                  {/* Visual representation of waves */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <div className="w-32 h-32 border-2 border-dashed border-white rounded-full"></div>
                  </div>
                  
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 border-4 border-electric-blue rounded-full relative"
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-electric-blue rounded-full shadow-[0_0_10px_#00D2FF]"></div>
                  </motion.div>

                  <motion.div 
                    animate={{ rotate: 360 }}
                    style={{ rotate: phase }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 border-4 border-mars-orange rounded-full absolute"
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-mars-orange rounded-full shadow-[0_0_10px_#E27D60]"></div>
                  </motion.div>

                  {puzzle1Solved && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center"
                    >
                      <CheckCircle2 size={48} className="text-emerald-500" />
                    </motion.div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span>Current Phase: {phase}°</span>
                    <span className="text-electric-blue">Target: 90°</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="180" 
                    value={phase} 
                    onChange={(e) => setPhase(parseInt(e.target.value))}
                    disabled={puzzle1Solved}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-electric-blue"
                  />
                  <button
                    onClick={checkPuzzle1}
                    disabled={puzzle1Solved}
                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    CALIBRATE PHASE
                  </button>
                </div>
              </div>
            )}

            {activePuzzle === 2 && (
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-electric-blue">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Puzzle 2: Magnifying Transmitter</h4>
                    <p className="text-xs text-tesla-silver/40 uppercase tracking-widest">PDF Page 43 Reference</p>
                  </div>
                </div>

                <p className="text-base text-tesla-silver/50 italic font-light">
                  "The transmitter is a resonant transformer. Tune the frequency to find the Earth's stationary wave resonance."
                </p>

                <div className="relative h-40 bg-space-dark/50 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
                  <div className="flex items-end gap-1 h-20">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          height: [20, Math.random() * 60 + 20, 20],
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ 
                          duration: 2 / (frequency / 50), 
                          repeat: Infinity,
                          delay: i * 0.1
                        }}
                        className="w-2 bg-electric-blue rounded-t-sm"
                      />
                    ))}
                  </div>

                  {puzzle2Solved && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center"
                    >
                      <CheckCircle2 size={48} className="text-emerald-500" />
                    </motion.div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span>Frequency: {frequency} MHz</span>
                    <span className="text-electric-blue">Resonance: {targetFrequency} MHz</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={frequency} 
                    onChange={(e) => setFrequency(parseInt(e.target.value))}
                    disabled={puzzle2Solved}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-electric-blue"
                  />
                  <button
                    onClick={checkPuzzle2}
                    disabled={puzzle2Solved}
                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    LOCK RESONANCE
                  </button>
                </div>
              </div>
            )}

            {activePuzzle === 3 && (
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-electric-blue">
                    <RefreshCw size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Puzzle 3: The Telautomaton</h4>
                    <p className="text-xs text-tesla-silver/40 uppercase tracking-widest">PDF Page 51 Reference</p>
                  </div>
                </div>

                <p className="text-base text-tesla-silver/50 italic font-light">
                  "The Art of Telautomatics: remote control via synchronized signals. Match the control frequency to guide the vessel."
                </p>

                <div className="relative h-40 bg-space-dark/50 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <motion.div
                      animate={{ 
                        x: [0, 10, -10, 0],
                        y: [0, -5, 5, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-16 h-6 bg-tesla-silver rounded-full relative"
                    >
                      <div className="absolute -top-1 right-4 w-1 h-3 bg-electric-blue rounded-full"></div>
                    </motion.div>
                    
                    {/* Signal Waves */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ 
                            scale: [0.5, 2],
                            opacity: [0.5, 0]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            delay: i * 0.6,
                            ease: "easeOut"
                          }}
                          className="absolute w-20 h-20 border border-electric-blue rounded-full"
                          style={{ 
                            borderColor: Math.abs(signal - targetSignal) < 10 ? '#00D2FF' : '#E27D60'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {puzzle3Solved && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center z-10"
                    >
                      <div className="text-center">
                        <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-2" />
                        <div className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Calibration Complete</div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span>Signal: {signal}%</span>
                    <span className="text-electric-blue">Target: {targetSignal}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={signal} 
                    onChange={(e) => setSignal(parseInt(e.target.value))}
                    disabled={puzzle3Solved}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-electric-blue"
                  />
                  <button
                    onClick={checkPuzzle3}
                    disabled={puzzle3Solved}
                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    SYNCHRONIZE SIGNAL
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-3 text-[10px] text-tesla-silver/30 uppercase tracking-widest">
        <Info size={14} />
        <span>Solve puzzles to unlock Cinematic Vision and Full Illustration Gallery</span>
      </div>
    </div>
  );
};
