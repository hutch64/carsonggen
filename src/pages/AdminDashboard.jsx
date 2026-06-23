import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Music, DollarSign, Search, Eye, Trash2, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CustomerDetailModal from "@/components/admin/CustomerDetailModal";

export default function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: () => base44.entities.Customer.list("-created_date", 100),
    enabled: user?.role === "admin",
  });

  const { data: songs = [] } = useQuery({
    queryKey: ["all-songs"],
    queryFn: () => base44.entities.Song.list("-created_date", 200),
    enabled: user?.role === "admin",
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Customer.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Access denied. Admins only.</p>
          <Button className="mt-4" onClick={() => navigate("/")}>Go Home</Button>
        </Card>
      </div>
    );
  }

  const filtered = customers.filter(c =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = customers.reduce((sum, c) => sum + (c.total_spent || 0), 0);
  const totalSongs = songs.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,200,220,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,220,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">Manage your customers</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Customers", value: customers.length, icon: Users },
            { label: "Total Songs", value: totalSongs, icon: Music },
            { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign },
          ].map(({ label, value, icon: Icon }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-5 border-border/60 bg-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-heading tracking-wider uppercase">{label}</p>
                    <p className="text-foreground text-xl font-heading font-bold">{value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-card border-border/60"
          />
        </div>

        {/* Table */}
        <Card className="border-border/60 bg-card overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No customers found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/60 text-xs font-heading tracking-wider text-muted-foreground uppercase">
                    <th className="text-left p-4">Customer</th>
                    <th className="text-left p-4">Phone</th>
                    <th className="text-left p-4">Songs</th>
                    <th className="text-left p-4">Spent</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(customer => (
                    <tr key={customer.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <p className="font-medium text-foreground">{customer.full_name || "—"}</p>
                        <p className="text-muted-foreground text-sm">{customer.email}</p>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">{customer.phone || "—"}</td>
                      <td className="p-4 text-foreground font-heading">{customer.songs_generated || 0}</td>
                      <td className="p-4 text-primary font-heading font-semibold">${(customer.total_spent || 0).toFixed(2)}</td>
                      <td className="p-4">
                        <Badge className={customer.status === "active"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-muted text-muted-foreground"}>
                          {customer.status || "active"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => setSelectedCustomer(customer)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteMutation.mutate(customer.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          songs={songs.filter(s => s.created_by_id === selectedCustomer.created_by_id)}
          onClose={() => setSelectedCustomer(null)}
          onUpdate={() => queryClient.invalidateQueries({ queryKey: ["customers"] })}
        />
      )}
    </div>
  );
}