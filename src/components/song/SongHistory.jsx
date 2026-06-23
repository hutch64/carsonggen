import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Music, ImageIcon } from "lucide-react";

const genreEmojis = {
  pop: "🎤", country: "🤠", "hip-hop": "🎙️", rock: "🎸",
  gospel: "🙏", "r&b": "🎶", metal: "🤘", jazz: "🎷",
};

export default function SongHistory({ songs, onSelect }) {
  if (!songs || songs.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-heading tracking-widest text-muted-foreground uppercase flex items-center gap-2">
        <Music className="w-4 h-4" />
        My Car Songs
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {songs.map((song, index) => {
          const cover = song.photo_front || song.photo_side || song.photo_rear || song.photo_interior;
          return (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              onClick={() => onSelect(song)}
              className="group cursor-pointer rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,200,220,0.12)] transition-all bg-card"
            >
              {/* Photo */}
              <div className="relative w-full aspect-video bg-muted overflow-hidden">
                {cover ? (
                  <img
                    src={cover}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
                  </div>
                )}
                {song.audio_url && (
                  <div className="absolute top-2 right-2 bg-primary/90 rounded-full p-1">
                    <Music className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3 space-y-1">
                <p className="font-heading text-xs font-semibold truncate text-foreground leading-snug">
                  {song.title}
                </p>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs text-muted-foreground truncate">
                    {[song.car_year, song.car_make].filter(Boolean).join(" ")}
                  </p>
                  {song.genre && (
                    <span className="text-xs flex-shrink-0">{genreEmojis[song.genre] || ""}</span>
                  )}
                </div>
                {song.genre && (
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0">
                    {song.genre}
                  </Badge>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}