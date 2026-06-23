import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Music, Camera, Mic2, Share2, Car, Star, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const LOGO_URL = "https://media.base44.com/images/public/6a34d828818454f364333b8f/5e2267f63_logo.png";

const steps = [
  { icon: "🚗", num: "Step 1", title: "Enter Your Car", desc: "Type in the Year, Make & Model of any car — past, present, or dream ride." },
  { icon: "🎸", num: "Step 2", title: "Pick Your Genre", desc: "Choose from Country, Hip-Hop, Rock, Gospel, R&B, Pop, Metal, or Jazz." },
  { icon: "🎵", num: "Step 3", title: "Get Your Song + Photos", desc: "AI writes a custom song and generates 4 pro-quality photos — delivered in seconds." },
];

const features = [
  { icon: Music, text: "1 Original AI-Written Song", sub: "2 verses + chorus, custom to your car" },
  { icon: Camera, text: "4 AI-Generated Car Photos", sub: "Front, Side, Rear, Interior" },
  { icon: Star, text: "8 Music Genre Options", sub: "Country, Rock, Hip-Hop, Gospel, R&B, Pop, Metal, Jazz" },
  { icon: Mic2, text: "Text-to-Speech Playback", sub: 'Hit "Hear the Song" and listen to it read aloud' },
  { icon: Share2, text: "Printable/Shareable Song Card", sub: "Save it, share it, frame it" },
  { icon: Car, text: "Works for ANY Car", sub: "Classic, modern, exotic, or daily driver" },
];

const pricing = [
  {
    name: "SINGLE SONG",
    price: "$2.99",
    priceNote: null,
    bullets: ["One Custom Song", "1 Car Song", "4 AI Photos"],
    cta: "GET STARTED",
    popular: false,
    saveBadge: null,
    headerBg: "bg-red-700",
    ctaBg: "bg-red-600 hover:bg-red-500",
    img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80",
    planId: "single",
  },
  {
    name: "5 SONG PACK",
    price: "$9.99",
    priceNote: "Save 33%",
    bullets: ["5 Custom Songs", "Mix & Match Cars", "Great Deal!"],
    cta: "BUY 5 PACK",
    popular: false,
    saveBadge: null,
    headerBg: "bg-blue-800",
    ctaBg: "bg-blue-600 hover:bg-blue-500",
    img: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=80",
    planId: "five_pack",
  },
  {
    name: "10 SONG PACK",
    price: "$17.99",
    priceNote: null,
    bullets: ["10 Custom Songs", "Any 10 Cars!", "Huge Savings!"],
    cta: "BEST DEAL!",
    popular: true,
    saveBadge: "SAVE 40%",
    headerBg: "bg-gray-900",
    ctaBg: "bg-yellow-500 hover:bg-yellow-400 text-black",
    img: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&q=80",
    planId: "ten_pack",
  },
  {
    name: "DEALER PLAN",
    price: "$79",
    priceNote: "/month",
    bullets: ["Unlimited Songs", "For Dealerships", "Boost Your Listings"],
    cta: "JOIN NOW",
    popular: false,
    saveBadge: null,
    headerBg: "bg-green-800",
    ctaBg: "bg-green-600 hover:bg-green-500",
    img: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400&q=80",
    planId: "dealer",
  },
];

const audiences = [
  { icon: "🏆", title: "Car Show Enthusiasts", desc: "Get a hype song for your show car. Print the lyrics and display them next to your build." },
  { icon: "🏢", title: "Auto Dealerships", desc: "Generate a custom song for every car on your lot. Post to social media and stand out from every other dealer." },
  { icon: "❤️", title: "Car Lovers & Collectors", desc: "That car you love deserves its own song. A perfect gift for any car owner — birthdays, holidays, or just because." },
];

const faqs = [
  { q: "What cars does this work for?", a: "Any car, any year, any make and model worldwide. From a 1957 Chevy Bel Air to a 2026 Tesla Model S — if it has wheels and an engine (or a motor), we can write a song about it." },
  { q: "How long does it take?", a: "Usually 15–30 seconds for the song and photos to generate. You'll see results appear in real-time on your screen." },
  { q: "Can I hear the song out loud?", a: 'Yes! Hit the "Hear the Song" button and the AI will read your custom lyrics aloud with expressive text-to-speech technology.' },
  { q: "Do I need an account?", a: "No account needed. Just pay, generate your song and photos, and enjoy. It's that simple." },
  { q: "What music genres are available?", a: "Country, Hip-Hop, Rock, Gospel, R&B/Soul, Pop, Metal, and Jazz/Blues. We're always adding more styles based on user feedback." },
  { q: "Can dealerships get a bulk plan?", a: "Yes! The Dealer Monthly plan gives you unlimited song generations for $79/month. Perfect for creating unique content for every vehicle on your lot." },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-card/60 transition-colors"
      >
        <span className="font-medium text-foreground text-sm sm:text-base">{q}</span>
        <ChevronDown className={`w-4 h-4 text-primary flex-shrink-0 ml-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border/30 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function Landing() {
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleCheckout = async (planId) => {
    setLoadingPlan(planId);
    try {
      const res = await base44.functions.invoke("create-checkout", { planId });
      if (res.data?.redirectUrl) {
        window.location.href = res.data.redirectUrl;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-md border-b border-border/40">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Car Song Generator" className="w-12 h-12 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
            <div className="hidden sm:block">
              <p className="font-heading text-primary text-xs tracking-widest uppercase font-bold leading-tight">Car Song Generator</p>
              <p className="text-muted-foreground text-[10px] tracking-widest">Your Car. Your Song. Your Story.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" className="text-foreground/70 hover:text-primary text-sm h-9">Log In</Button>
            </Link>
            <Link to="/generator">
              <Button variant="ghost" className="text-foreground/70 hover:text-primary text-sm h-9 hidden sm:inline-flex">Generator</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading text-xs tracking-wider h-9 px-5 rounded-sm shadow-[0_0_15px_rgba(0,200,220,0.3)]">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,200,220,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,220,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[700px] h-[500px] bg-primary/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, type: "spring", bounce: 0.4 }} className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-150" />
              <img src={LOGO_URL} alt="Car Song Generator" className="relative w-36 h-36 sm:w-48 sm:h-48 object-contain drop-shadow-[0_0_40px_rgba(0,200,220,0.5)]" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }} className="font-heading font-black tracking-tight leading-none mb-6">
            <span className="block text-4xl sm:text-6xl md:text-7xl text-foreground">Your Car. Your Song.</span>
            <span className="block text-4xl sm:text-6xl md:text-7xl text-primary drop-shadow-[0_0_40px_rgba(0,200,220,0.6)]">Your Story.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
            Enter any car's Year, Make & Model — get a custom AI-written song in your chosen music style, plus 4 stunning AI-generated photos. Instantly.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-10">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" />Instant delivery</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" />Account needed</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" />Powered by AI</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => handleCheckout("single")}
              disabled={loadingPlan === "single"}
              className="h-14 px-10 font-heading text-sm tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(0,200,220,0.35)] hover:shadow-[0_0_50px_rgba(0,200,220,0.55)] transition-all rounded-sm disabled:opacity-60"
            >
              {loadingPlan === "single" ? "LOADING..." : <>🎵 Try It Now — $2.99 <ChevronRight className="ml-2 w-5 h-5" /></>}
            </Button>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="h-14 px-10 font-heading text-sm tracking-widest border-primary/40 text-primary hover:bg-primary/10 rounded-sm">
                🎬 Watch the Demo
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-3">HOW IT WORKS</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-[0_0_12px_rgba(0,200,220,0.8)]" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border/50 rounded-lg p-8 text-center hover:border-primary/40 transition-colors">
                <div className="text-5xl mb-4">{s.icon}</div>
                <div className="font-heading text-primary text-xs tracking-widest mb-2">{s.num}</div>
                <h3 className="font-heading text-sm tracking-wider font-bold text-foreground mb-3">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EVERYTHING YOU GET */}
      <section className="py-24 px-6 bg-card/30 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-3">EVERYTHING YOU GET FOR $2.99</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-[0_0_12px_rgba(0,200,220,0.8)]" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-card border border-border/50 rounded-lg p-6 flex items-start gap-4 hover:border-primary/40 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-heading text-xs tracking-wide font-bold text-foreground mb-1">{f.text}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">{f.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sample song card */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-card border border-primary/25 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,200,220,0.08)] max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-b border-primary/20 p-6">
              <div className="flex items-center gap-2 mb-1">
                <Mic2 className="w-4 h-4 text-primary" />
                <span className="text-primary/70 text-xs font-heading tracking-widest uppercase">Sample Song</span>
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground">🚗 1969 Ford Mustang — Rock Edition</h3>
            </div>
            <div className="p-6 text-sm text-foreground/80 leading-relaxed space-y-3">
              <div>
                <p className="font-heading text-xs text-primary tracking-widest mb-2">VERSE 1</p>
                <p>Chrome and steel under Texas sun,<br />Three-fifty-one, yeah she's second to none,<br />Midnight black with a rumble low,<br />Hit the highway, let the whole world know.</p>
              </div>
              <div>
                <p className="font-heading text-xs text-primary tracking-widest mb-2">CHORUS</p>
                <p>Mustang runnin', hear that engine sing,<br />She's the queen of every road, the freedom that she brings,<br />Sixty-nine and forever wild,<br />Born to ride, pedal down, mile after mile!</p>
              </div>
              <div>
                <p className="font-heading text-xs text-primary tracking-widest mb-2">VERSE 2</p>
                <p>Garage light flickerin' on the hood,<br />Every scratch tells a story good,<br />Handed down from my old man's hands,<br />Ain't no car like this in all the land.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 px-6 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-3">SIMPLE, HONEST PRICING</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-[0_0_12px_rgba(0,200,220,0.8)]" />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pricing.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`relative rounded-xl overflow-hidden flex flex-col border-2 transition-all ${p.popular ? "border-yellow-400 shadow-[0_0_40px_rgba(234,179,8,0.25)] scale-105" : "border-border/50"}`}>
                {/* Save badge */}
                {p.saveBadge && (
                  <div className="absolute top-3 right-3 z-10 bg-yellow-400 text-black font-heading text-[10px] font-black tracking-wide px-2.5 py-1.5 rounded-full shadow-lg">
                    {p.saveBadge}
                  </div>
                )}
                {/* Header */}
                <div className={`${p.headerBg} p-4`}>
                  <h3 className="font-heading text-sm tracking-widest font-black text-white mb-3">{p.name}</h3>
                  <div className="relative h-28 rounded-lg overflow-hidden">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                </div>
                {/* Price */}
                <div className="bg-card px-5 pt-4 pb-2">
                  <div className="flex items-end gap-1 mb-1">
                    <span className="font-heading text-4xl font-black text-foreground">{p.price}</span>
                    {p.priceNote && <span className="text-muted-foreground text-sm mb-1.5">{p.priceNote}</span>}
                  </div>
                  {/* Bullets */}
                  <ul className="space-y-1.5 mt-3 mb-4">
                    {p.bullets.map((b, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-foreground/80">
                        <span className="text-primary">•</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleCheckout(p.planId)}
                    disabled={loadingPlan === p.planId}
                    className={`w-full py-3 rounded-sm font-heading text-xs tracking-widest font-bold text-white transition-all mb-1 disabled:opacity-60 disabled:cursor-not-allowed ${p.ctaBg}`}
                  >
                    {loadingPlan === p.planId ? "LOADING..." : p.cta}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BUILT FOR CAR PEOPLE */}
      <section className="py-24 px-6 bg-card/30 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-3">BUILT FOR CAR PEOPLE</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-[0_0_12px_rgba(0,200,220,0.8)]" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {audiences.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border/50 rounded-lg p-8 text-center hover:border-primary/40 transition-colors">
                <div className="text-5xl mb-4">{a.icon}</div>
                <h3 className="font-heading text-sm tracking-wider font-bold text-foreground mb-3">{a.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 border-t border-border/30">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-3">FREQUENTLY ASKED QUESTIONS</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-[0_0_12px_rgba(0,200,220,0.8)]" />
          </motion.div>
          <div className="space-y-3">
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="py-24 px-6 border-t border-border/30">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="bg-card border border-primary/25 rounded-xl p-12 shadow-[0_0_80px_rgba(0,200,220,0.08)]">
            <img src={LOGO_URL} alt="Car Song Generator" className="w-20 h-20 object-contain mx-auto mb-6 drop-shadow-[0_0_20px_rgba(0,200,220,0.4)]" onError={(e) => { e.target.style.display = 'none'; }} />
            <h2 className="font-heading text-3xl sm:text-4xl font-black mb-2 text-foreground">YOUR CAR DESERVES ITS OWN SONG.</h2>
            <p className="text-muted-foreground mb-2">Join thousands of car lovers who've already generated their custom car song.</p>
            <Button
              size="lg"
              onClick={() => handleCheckout("single")}
              disabled={loadingPlan === "single"}
              className="h-14 px-12 font-heading text-sm tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(0,200,220,0.35)] rounded-sm mt-6 disabled:opacity-60"
            >
              {loadingPlan === "single" ? "LOADING..." : "🎵 Generate My Car Song — $2.99"}
            </Button>
            <p className="text-muted-foreground text-xs mt-4">Instant delivery · 100% satisfaction</p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/40 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <img src={LOGO_URL} alt="Car Song Generator" className="w-8 h-8 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
          <div className="text-left">
            <p className="font-heading text-primary text-xs tracking-widest uppercase font-bold leading-tight">Car Song Generator</p>
            <p className="text-muted-foreground text-[10px] tracking-wider">Your Car. Your Song. Your Story.</p>
          </div>
        </div>
        <p className="text-muted-foreground text-xs">© 2026 Car Song Generator. All rights reserved.</p>
      </footer>

    </div>
  );
}
