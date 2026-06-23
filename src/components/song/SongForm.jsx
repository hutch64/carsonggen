import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Music, Sparkles, Car } from "lucide-react";
import { motion } from "framer-motion";

const genres = [
  { value: "country", label: "🤠 Country" },
  { value: "rock", label: "🎸 Rock" },
  { value: "hip-hop", label: "🎙️ Hip-Hop" },
  { value: "gospel", label: "🙏 Gospel" },
  { value: "r&b", label: "🎶 R&B" },
  { value: "pop", label: "🎤 Pop" },
  { value: "metal", label: "🤘 Metal" },
  { value: "jazz", label: "🎷 Jazz" },
];

export default function SongForm({ onGenerate, isLoading }) {
  const [form, setForm] = useState({
    car_make: "",
    car_model: "",
    car_year: "",
    genre: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(form);
  };

  const isValid = form.car_make && form.car_model && form.genre;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-2">
            <Label htmlFor="car_year" className="text-sm font-medium text-foreground/80">
              Year
            </Label>
            <Select value={form.car_year} onValueChange={(val) => setForm({ ...form, car_year: val })}>
              <SelectTrigger id="car_year" className="h-12 bg-background border-border/60 focus:border-primary">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {Array.from({ length: 2027 - 1920 + 1 }, (_, i) => 2027 - i).map((year) => (
                  <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="car_make" className="text-sm font-medium flex items-center gap-2 text-foreground/80">
              <Car className="w-4 h-4 text-primary" />
              Make *
            </Label>
            <Input
              id="car_make"
              placeholder="e.g. Ford"
              value={form.car_make}
              onChange={(e) => setForm({ ...form, car_make: e.target.value })}
              className="h-12 bg-background border-border/60 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="car_model" className="text-sm font-medium text-foreground/80">
              Model *
            </Label>
            <Input
              id="car_model"
              placeholder="e.g. Mustang GT"
              value={form.car_model}
              onChange={(e) => setForm({ ...form, car_model: e.target.value })}
              className="h-12 bg-background border-border/60 focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2 text-foreground/80">
            <Music className="w-4 h-4 text-primary" />
            Music Genre *
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {genres.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setForm({ ...form, genre: g.value })}
                className={`h-11 rounded-sm border text-xs font-heading tracking-wide transition-all ${
                  form.genre === g.value
                    ? "border-primary bg-primary/15 text-primary shadow-[0_0_10px_rgba(0,200,220,0.2)]"
                    : "border-border/60 bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full h-13 text-sm font-heading tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(0,200,220,0.25)] hover:shadow-[0_0_30px_rgba(0,200,220,0.4)] transition-all rounded-sm mt-2"
        >
          {isLoading ? (
            <span className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              CREATING YOUR SONG & PHOTOS...
            </span>
          ) : (
            <span className="flex items-center gap-3">
              <Sparkles className="w-4 h-4" />
              GENERATE MY CAR SONG
            </span>
          )}
        </Button>
      </form>
    </motion.div>
  );
}