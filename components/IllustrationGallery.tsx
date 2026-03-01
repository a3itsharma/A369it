import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Loader2, Image as ImageIcon, Download } from 'lucide-react';

interface IllustrationBrief {
  id: number;
  chapter: string;
  prompt: string;
  alt: string;
}

const briefs: IllustrationBrief[] = [
  {
    id: 1,
    chapter: "Chapter 1",
    prompt: "A cartoon-realistic, colorful illustration of Mira, a young girl, following a trail of tiny blue sparks across a red Martian plain towards a gentle robot with a humming silver helmet standing on a ridge. Warm Martian palette (oranges, rusts) with electric blue sparks. High contrast.",
    alt: "Mira finds a humming helmet on the red plain."
  },
  {
    id: 2,
    chapter: "Chapter 2",
    prompt: "A close-up cartoon-realistic illustration of Tesla's silver helmet with tiny visible gears and a warm, friendly glowing visor. A small inset shows a tiny glowing green seed sprouting in red soil. Metallic silvers and warm visor glow. High contrast.",
    alt: "The helmet’s visor blinks like a friendly eye."
  },
  {
    id: 3,
    chapter: "Chapter 3",
    prompt: "A cartoon-realistic illustration of Pip, a small wobbling drone, floating above cracked Martian ground while Mira and Tesla rewire an old, forgotten Tesla coil. Teamwork theme, bright copper wires, electric blue accents. High contrast.",
    alt: "A small drone and two friends fix an old coil."
  },
  {
    id: 4,
    chapter: "Chapter 4",
    prompt: "A cartoon-realistic interior view of the Tesla Tower: glowing blue blueprints and sky maps on dark walls, with a balcony view overlooking a glass city on Mars. Blueprints glow like stars. High contrast, cinematic lighting.",
    alt: "Inside the tower, blueprints glow like stars."
  },
  {
    id: 5,
    chapter: "Chapter 5",
    prompt: "A joyful cartoon-realistic illustration of Mira learning to ride wind gusts with Lio, a flying humanoid. Bright jetpack trails and motion lines in a Martian sky. Energetic, colorful, high contrast.",
    alt: "Mira learns to fly with a friendly humanoid."
  },
  {
    id: 6,
    chapter: "Chapter 6",
    prompt: "A dramatic cartoon-realistic illustration of the experiment: electric blue arcs leaping from a trident to a tall tower, lighting up a skyway path. A crowd watches from glass domes. Shimmering light, high contrast.",
    alt: "Electricity forms a glowing path to the sky."
  },
  {
    id: 7,
    chapter: "Chapter 7",
    prompt: "A cartoon-realistic storm scene on Mars: a net of electric blue light shielding a glass city from dark, dramatic storm clouds. Mira and Tesla working together at the tower. Courageous theme, high contrast.",
    alt: "A net of light shields the city from a storm."
  },
  {
    id: 8,
    chapter: "Chapter 8",
    prompt: "A warm cartoon-realistic farewell scene: Martian ships rising along a path of light into a beautiful Martian sunset. Mira holding a glowing seed, exchanging gifts with visitors. Warm oranges and rusts, peaceful atmosphere.",
    alt: "Visitors depart, leaving gifts and promises."
  }
];

export const IllustrationGallery: React.FC<{ hasApiKey: boolean; onSelectKey: () => Promise<void> }> = ({ hasApiKey, onSelectKey }) => {
  const [images, setImages] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [generatingAll, setGeneratingAll] = useState(false);

  const generateImage = async (brief: IllustrationBrief) => {
    if (!hasApiKey) {
      await onSelectKey();
    }

    setLoading(prev => ({ ...prev, [brief.id]: true }));
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [{ text: brief.prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          }
        }
      });

      let imageUrl = "";
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setImages(prev => ({ ...prev, [brief.id]: imageUrl }));
      }
    } catch (error: any) {
      console.error(`Failed to generate image ${brief.id}:`, error);
      const errorStr = typeof error === 'object' ? JSON.stringify(error) : String(error);
      if (errorStr.includes("Requested entity was not found") || errorStr.includes("PERMISSION_DENIED") || errorStr.includes("403")) {
        alert("API key session expired or lacks permission. Please select a valid paid API key and try again.");
        await onSelectKey();
      }
    } finally {
      setLoading(prev => ({ ...prev, [brief.id]: false }));
    }
  };

  const generateAll = async () => {
    if (!hasApiKey) {
      await onSelectKey();
    }
    setGeneratingAll(true);
    for (const brief of briefs) {
      if (!images[brief.id]) {
        await generateImage(brief);
      }
    }
    setGeneratingAll(false);
  };

  return (
    <section id="gallery" className="py-12 md:py-20 bg-white dark:bg-space-dark border-t border-black/[0.05] dark:border-white/[0.05]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <div className="text-electric-blue/60 text-[10px] font-black tracking-[0.4em] uppercase mb-6">VISUAL NARRATIVE</div>
            <h2 className="font-serif text-5xl md:text-6xl text-matte-charcoal dark:text-white leading-tight">Interior <br/>Illustrations</h2>
          </div>
          <button
            onClick={generateAll}
            disabled={generatingAll}
            className="px-10 py-5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-matte-charcoal dark:text-tesla-silver rounded-full font-bold hover:bg-matte-charcoal hover:text-white dark:hover:bg-white dark:hover:text-space-dark transition-all flex items-center gap-3 disabled:opacity-50 shadow-xl"
          >
            {generatingAll ? <Loader2 className="animate-spin" /> : <Sparkles size={20} className="text-electric-blue" />}
            <span className="tracking-widest text-xs">{generatingAll ? "GENERATING GALLERY..." : "GENERATE ALL ILLUSTRATIONS"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {briefs.map((brief) => (
            <motion.div
              key={brief.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card overflow-hidden group relative aspect-square"
            >
              {images[brief.id] ? (
                <>
                  <img
                    src={images[brief.id]}
                    alt={brief.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                    <div className="text-[10px] text-electric-blue font-black tracking-widest mb-2 uppercase">{brief.chapter}</div>
                    <div className="text-lg text-white font-serif leading-tight">{brief.alt}</div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-black/5 dark:bg-white/5">
                  {loading[brief.id] ? (
                    <Loader2 className="w-12 h-12 text-electric-blue animate-spin mb-4" />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-black/10 dark:text-white/10 mb-4" />
                  )}
                  <div className="text-xs font-bold tracking-widest text-tesla-silver/40 uppercase mb-4">{brief.chapter}</div>
                  {!loading[brief.id] && (
                    <button
                      onClick={() => generateImage(brief)}
                      className="text-[10px] font-black tracking-[0.2em] text-electric-blue hover:text-white transition-colors uppercase"
                    >
                      Generate Image
                    </button>
                  )}
                  {loading[brief.id] && (
                    <div className="text-[10px] font-black tracking-[0.2em] text-electric-blue animate-pulse uppercase">
                      Transmitting...
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
