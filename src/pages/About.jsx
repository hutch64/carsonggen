import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Music2, Image, Mic2, Zap, Car, Headphones, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Car,
    title: "Enter Your Car Details",
    description: "Type in your car's year, make, and model — any vehicle, any era.",
  },
  {
    icon: Music2,
    title: "Pick Your Genre",
    description: "Choose from country, rock, hip-hop, gospel, R&B, pop, metal, or jazz.",
  },
  {
    icon: Zap,
    title: "AI Writes Your Song",
    description: "Our AI instantly crafts custom lyrics with verses and a chorus built around your car.",
  },
  {
    icon: Image,
    title: "Get 4 AI Car Photos",
    description: "Front, side, rear, and interior — photorealistic AI-generated images of your exact car.",
  },
  {
    icon: Headphones,
    title: "Generate & Play Music",
    description: "Turn your lyrics into a real audio track you can play and download as an MP3.",
  },
];

const features = [
  { title: "Any Car, Any Year", description: "From classic muscle cars to modern EVs — if it has wheels, we'll write its anthem." },
  { title: "8 Musical Genres", description: "Country twang, rock riffs, hip-hop beats, gospel soul — your song, your style." },
  { title: "4 AI Photos Included", description: "Professional-quality AI-generated photos from four angles, every time." },
  { title: "Real Audio Playback", description: "Listen to your song right in the app and download the MP3 to keep forever." },
  { title: "Instant Results", description: "Lyrics appear in seconds. Photos and audio generate in the background while you read." },
  { title: "Shareable & Giftable", description: "Perfect for car lovers, birthdays, dealerships, and social media content." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,200,220,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,220,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 pt-24 pb-28 sm:pb-16">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-primary/40" />
            <Mic2 className="w-6 h-6 text-primary" />
            <div className="h-px w-16 bg-primary/40" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
            ABOUT <span className="text-primary drop-shadow-[0_0_20px_rgba(0,200,220,0.5)]">CAR SONG</span> GENERATOR
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            We turn your car into a custom song — complete with AI-written lyrics, a full audio track, and four stunning AI-generated photos. In under a minute.
          </p>
        </motion.div>

        {/* How It Works */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-14">
          <h2 className="font-heading text-sm tracking-widest text-primary uppercase mb-6 text-center">How It Works</h2>
          <div className="space-y-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-heading font-semibold text-foreground text-sm">{step.title}</p>
                    <p className="text-muted-foreground text-sm mt-0.5">{step.description}</p>
                  </div>
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center mt-1">
                    <span className="font-heading text-xs font-bold text-muted-foreground">{i + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-14">
          <h2 className="font-heading text-sm tracking-widest text-primary uppercase mb-6 text-center">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <Card key={i} className="p-4 border-border/50 bg-card">
                <p className="font-heading font-semibold text-foreground text-sm mb-1">{f.title}</p>
                <p className="text-muted-foreground text-sm">{f.description}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center">
          <Link to="/">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading text-xs tracking-widest rounded-sm px-8 h-12 shadow-[0_0_20px_rgba(0,200,220,0.3)]">
              Try It Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}