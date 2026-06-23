import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

const LOGO_URL = "https://media.base44.com/images/public/6a34d828818454f364333b8f/5e2267f63_logo.png";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,200,220,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,220,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative text-center max-w-lg"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shadow-[0_0_40px_rgba(0,200,220,0.3)]">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
        </div>

        <img
          src={LOGO_URL}
          alt="Car Song Generator"
          className="w-16 h-16 object-contain mx-auto mb-4 drop-shadow-[0_0_20px_rgba(0,200,220,0.4)]"
          onError={(e) => { e.target.style.display = 'none'; }}
        />

        <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground mb-3">
          PAYMENT <span className="text-primary drop-shadow-[0_0_20px_rgba(0,200,220,0.5)]">CONFIRMED!</span>
        </h1>

        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          Your order is complete. Head to the generator and create your first custom car song!
        </p>

        <Link to="/generator">
          <Button
            size="lg"
            className="h-14 px-10 font-heading text-sm tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(0,200,220,0.35)] rounded-sm"
          >
            <Music className="w-5 h-5 mr-2" />
            GENERATE MY CAR SONG
          </Button>
        </Link>

        <p className="text-muted-foreground text-xs mt-6">
          <Link to="/" className="hover:text-primary transition-colors">← Back to Home</Link>
        </p>
      </motion.div>
    </div>
  );
}