import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import SongForm from "@/components/song/SongForm";
import SongDisplay from "@/components/song/SongDisplay";
import SongHistory from "@/components/song/SongHistory";
import { AnimatePresence, motion } from "framer-motion";
import { Music } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [currentSong, setCurrentSong] = useState(null);
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: songs = [] } = useQuery({
    queryKey: ["songs"],
    queryFn: () => base44.entities.Song.list("-created_date", 10),
  });

  const generateMutation = useMutation({
    mutationFn: async (formData) => {
      const carDesc = [formData.car_year, formData.car_make, formData.car_model].filter(Boolean).join(" ");

      const prompt = `Write a short, punchy car anthem about a ${carDesc}. Genre: ${formData.genre}.

IMPORTANT: Keep the total lyrics under 500 characters. Use this structure:
[verse]
2-3 short lines about the car

[chorus]
2-3 catchy lines celebrating the car

[verse]
2-3 more lines

Label sections exactly as: [verse] and [chorus]. Reference the make and year. Keep every line short and punchy.`;

      // Step 1: Generate lyrics first so we can show the song quickly
      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string", description: "A catchy anthem title for the car" },
            lyrics: { type: "string", description: "Full song lyrics with verses and chorus labeled" },
          },
          required: ["title", "lyrics"],
        },
      });

      const songData = {
        title: result.title,
        lyrics: result.lyrics,
        car_make: `${formData.car_make} ${formData.car_model}`.trim(),
        car_year: formData.car_year,
        genre: formData.genre,
      };

      const saved = await base44.entities.Song.create(songData);
      const song = { ...songData, ...saved };

      // Step 2: Show song immediately, generate photos in background
      setCurrentSong(song);
      queryClient.invalidateQueries({ queryKey: ["songs"] });

      const carPhotoDesc = `photorealistic automotive photography, ${carDesc}, professional car shoot, dramatic studio lighting, high detail, cinematic`;
      Promise.all([
        base44.integrations.Core.GenerateImage({ prompt: `${carPhotoDesc}, front view, low angle hero shot` }),
        base44.integrations.Core.GenerateImage({ prompt: `${carPhotoDesc}, side profile view, clean background` }),
        base44.integrations.Core.GenerateImage({ prompt: `${carPhotoDesc}, rear three-quarter view, dramatic angle` }),
        base44.integrations.Core.GenerateImage({ prompt: `${carPhotoDesc}, interior cockpit view, steering wheel, dashboard` }),
      ]).then(([photoFront, photoSide, photoRear, photoInterior]) => {
        const photos = {
          photo_front: photoFront?.url || null,
          photo_side: photoSide?.url || null,
          photo_rear: photoRear?.url || null,
          photo_interior: photoInterior?.url || null,
        };
        base44.entities.Song.update(song.id, photos);
        setCurrentSong(prev => prev?.id === song.id ? { ...prev, ...photos } : prev);
      }).catch(console.error);

      return song;
    },
    onSuccess: () => {
      // currentSong already set inside mutationFn for instant display
    },
    onError: (err) => {
      console.error("Song generation error:", err);
      toast.error("Song generation failed. Please try again.");
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* BG grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,200,220,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,220,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <Navbar user={user} />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-24 sm:pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-16 bg-primary/40" />
            <Music className="w-6 h-6 text-primary" />
            <div className="h-px w-16 bg-primary/40" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground"
          >
            BUILD YOUR <span className="text-primary drop-shadow-[0_0_20px_rgba(0,200,220,0.5)]">CAR SONG</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mt-2"
          >
            Enter any car's Year, Make & Model — get a custom AI-written song in your chosen music style, plus 4 stunning AI-generated photos. Instantly.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {currentSong ? (
            <motion.div key="display" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SongDisplay song={currentSong} onNewSong={() => setCurrentSong(null)} />
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <Card className="p-6 sm:p-8 border-border/60 bg-card shadow-[0_0_30px_rgba(0,200,220,0.05)]">
                <SongForm
                  onGenerate={(data) => generateMutation.mutate(data)}
                  isLoading={generateMutation.isPending}
                />
              </Card>
              <SongHistory songs={songs} onSelect={(song) => setCurrentSong(song)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}