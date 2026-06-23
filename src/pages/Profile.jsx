import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Music2, User, ArrowLeft, DollarSign, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Profile() {
  const navigate = useNavigate();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const { data: songs = [], isLoading: songsLoading } = useQuery({
    queryKey: ["my-songs"],
    queryFn: () => base44.entities.Song.filter({ created_by_id: user?.id }, "-created_date", 50),
    enabled: !!user?.id,
  });

  const { data: customerRecord } = useQuery({
    queryKey: ["my-customer", user?.email],
    queryFn: () => base44.entities.Customer.filter({ email: user.email }, "-created_date", 1),
    enabled: !!user?.email,
    select: (data) => data[0] || null,
  });

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Please log in to view your profile.</p>
          <Button onClick={() => navigate("/login")}>Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,200,220,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,220,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-heading text-2xl font-bold text-foreground">My Profile</h1>
        </div>

        {/* User Info Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 border-border/60 bg-card mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="font-heading font-bold text-foreground text-lg">{user.full_name || "Car Fan"}</p>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
            </div>

            {customerRecord && (
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/40">
                <div className="text-center">
                  <p className="font-heading font-bold text-primary text-xl">{songs.length}</p>
                  <p className="text-muted-foreground text-xs uppercase font-heading tracking-wider mt-1">Songs Made</p>
                </div>
                <div className="text-center">
                  <p className="font-heading font-bold text-primary text-xl">${(customerRecord.total_spent || 0).toFixed(2)}</p>
                  <p className="text-muted-foreground text-xs uppercase font-heading tracking-wider mt-1">Total Spent</p>
                </div>
                <div className="text-center">
                  <p className="font-heading font-bold text-primary text-xl">
                    {customerRecord.last_purchase_date ? new Date(customerRecord.last_purchase_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "—"}
                  </p>
                  <p className="text-muted-foreground text-xs uppercase font-heading tracking-wider mt-1">Last Purchase</p>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Songs History */}
        <div>
          <h2 className="font-heading text-sm tracking-widest text-primary uppercase mb-4">My Songs</h2>
          {songsLoading ? (
            <div className="text-center text-muted-foreground py-8">Loading songs...</div>
          ) : songs.length === 0 ? (
            <Card className="p-8 text-center border-border/40 bg-card">
              <Music2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No songs yet. Generate your first car song!</p>
              <Button className="mt-4 bg-primary text-primary-foreground font-heading text-xs tracking-widest rounded-sm" onClick={() => navigate("/generator")}>
                Generate a Song
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {songs.map((song, i) => (
                <motion.div key={song.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="p-4 border-border/40 bg-card flex items-center gap-4">
                    {song.photo_front ? (
                      <img src={song.photo_front} alt="car" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Music2 className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-foreground truncate">{song.title}</p>
                      <p className="text-muted-foreground text-sm truncate">{[song.car_year, song.car_make].filter(Boolean).join(" ")}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {song.genre && <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">{song.genre}</Badge>}
                      <p className="text-muted-foreground text-xs">{new Date(song.created_date).toLocaleDateString()}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}