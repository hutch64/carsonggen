import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Music2, Save } from "lucide-react";

export default function CustomerDetailModal({ customer, songs, onClose, onUpdate }) {
  const [notes, setNotes] = useState(customer.notes || "");
  const [status, setStatus] = useState(customer.status || "active");

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Customer.update(customer.id, data),
    onSuccess: () => { onUpdate(); onClose(); },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border/60 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/60">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">{customer.full_name || "Customer"}</h2>
            <p className="text-muted-foreground text-sm">{customer.email}</p>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-muted-foreground text-xs uppercase font-heading tracking-wider mb-1">Phone</p>
              <p className="text-foreground">{customer.phone || "—"}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-muted-foreground text-xs uppercase font-heading tracking-wider mb-1">Songs Generated</p>
              <p className="text-primary font-heading font-bold">{customer.songs_generated || 0}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-muted-foreground text-xs uppercase font-heading tracking-wider mb-1">Total Spent</p>
              <p className="text-primary font-heading font-bold">${(customer.total_spent || 0).toFixed(2)}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-muted-foreground text-xs uppercase font-heading tracking-wider mb-1">Last Purchase</p>
              <p className="text-foreground">{customer.last_purchase_date ? new Date(customer.last_purchase_date).toLocaleDateString() : "—"}</p>
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-muted-foreground text-xs uppercase font-heading tracking-wider mb-2">Status</p>
            <div className="flex gap-2">
              {["active", "inactive"].map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`px-3 py-1 rounded-md text-sm font-heading border transition-colors ${status === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 text-muted-foreground border-border/40 hover:border-primary/40"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-muted-foreground text-xs uppercase font-heading tracking-wider mb-2">Admin Notes</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Add notes about this customer..."
              className="w-full bg-muted/30 border border-border/40 rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>

          {/* Songs */}
          {songs.length > 0 && (
            <div>
              <p className="text-muted-foreground text-xs uppercase font-heading tracking-wider mb-3">Songs</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {songs.map(song => (
                  <div key={song.id} className="flex items-center gap-3 bg-muted/20 rounded-lg p-3">
                    <Music2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{song.title}</p>
                      <p className="text-xs text-muted-foreground">{song.car_make} · {song.genre}</p>
                    </div>
                    {song.genre && <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 text-xs flex-shrink-0">{song.genre}</Badge>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save */}
          <Button
            onClick={() => updateMutation.mutate({ notes, status })}
            disabled={updateMutation.isPending}
            className="w-full bg-primary text-primary-foreground font-heading text-xs tracking-widest rounded-sm">
            <Save className="w-4 h-4 mr-2" />
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}