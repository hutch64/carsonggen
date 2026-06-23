import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await base44.auth.deleteAccount();
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Failed to delete account. Please try again.");
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-destructive hover:text-destructive/80 select-none transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Delete Account</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-foreground tracking-wide">Delete Account</h3>
            <p className="text-xs text-muted-foreground">This cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Are you sure you want to permanently delete your account? All your saved songs and data will be lost.
        </p>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-xs">{error}</div>
        )}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 select-none"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground select-none"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" />Deleting...</> : "Delete Account"}
          </Button>
        </div>
      </div>
    </div>
  );
}