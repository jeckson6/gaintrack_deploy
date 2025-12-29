import React from "react";
import { Link } from "react-router-dom";
import {
    Activity,
    Dumbbell,
    Apple,
    ChevronRight,
    CheckCircle2,
    ArrowRight,
    Sparkles
} from "lucide-react";

export default function Index() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">

            {/* ======================
          NAVBAR
      ====================== */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                       
                        <span>GainTrack</span>
                    </div>

                    <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                        <a href="#features" className="hover:text-indigo-600 transition">
                            Features
                        </a>
                        <a href="#how-it-works" className="hover:text-indigo-600 transition">
                            Methodology
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-sm font-semibold hover:text-indigo-600 transition"
                        >
                            Sign in
                        </Link>
                        <Link
                            to="/register"
                            className="bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-slate-800 transition shadow-sm"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ======================
          HERO
      ====================== */}
            <section className="relative pt-20 pb-16 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                            <Sparkles size={14} /> AI-Powered Performance
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                            Master your fitness{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                                with intelligence.
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
                            GainTrack synthesizes your health metrics into personalized
                            training and nutrition protocols — removing guesswork from your
                            fitness journey.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                to="/register"
                                className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                            >
                                Start Free Trial <ChevronRight size={18} />
                            </Link>


                        </div>
                    </div>
                </div>
            </section>

            {/* ======================
          PRODUCT PREVIEW
      ====================== */}
            <section className="py-24 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-bold mb-6">
                            One platform.<br />
                            <span className="text-indigo-600">Total fitness control.</span>
                        </h2>

                        <p className="text-slate-600 text-lg mb-6">
                            GainTrack unifies health records, AI planning, and progress
                            tracking into a single, distraction-free system.
                        </p>

                        <ul className="space-y-4 text-slate-700">
                            <li className="flex gap-3">
                                <CheckCircle2 className="text-indigo-500 mt-1" />
                                Centralized health analytics & progress history
                            </li>
                            <li className="flex gap-3">
                                <CheckCircle2 className="text-indigo-500 mt-1" />
                                AI-generated training & nutrition logic
                            </li>
                            <li className="flex gap-3">
                                <CheckCircle2 className="text-indigo-500 mt-1" />
                                Clean role-based user & admin architecture
                            </li>
                        </ul>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20"></div>
                        <div className="relative bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-2xl">
                            <p className="text-xs uppercase tracking-widest text-indigo-400 mb-2">
                                GainTrack Dashboard
                            </p>
                            <p className="text-sm text-slate-300">
                                Visual analytics, AI recommendations, and structured planning —
                                engineered for consistency and long-term results.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ======================
          FEATURES
      ====================== */}
            <section id="features" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">
                            Precision-engineered features
                        </h2>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            Everything required to monitor, manage, and optimize performance.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Activity className="text-indigo-600" />}
                            title="Health Analytics"
                            desc="Track BMI, body fat, and historical trends with intuitive visualizations."
                        />
                        <FeatureCard
                            icon={<Dumbbell className="text-violet-600" />}
                            title="Adaptive Training"
                            desc="Workout plans evolve automatically based on progress and recovery."
                        />
                        <FeatureCard
                            icon={<Apple className="text-emerald-600" />}
                            title="Smart Nutrition"
                            desc="Daily meal plans optimized for caloric and macronutrient targets."
                        />
                    </div>
                </div>
            </section>

            {/* ======================
          WHY GAINTRACK
      ====================== */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Why GainTrack?</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Most fitness apps log data. GainTrack interprets it.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
                    <ComparisonCard
                        title="Traditional Apps"
                        points={[
                            "Static workout templates",
                            "Manual tracking only",
                            "No adaptive logic",
                            "Limited insights"
                        ]}
                    />

                    <ComparisonCard
                        title="GainTrack System"
                        highlight
                        points={[
                            "AI-assisted health interpretation",
                            "Adaptive training & nutrition",
                            "Integrated analytics",
                            "Built for long-term progression"
                        ]}
                    />

                    <ComparisonCard
                        title="Manual Coaching"
                        points={[
                            "High cost",
                            "Limited availability",
                            "No centralized data",
                            "Not scalable"
                        ]}
                    />
                </div>
            </section>

            {/* ======================
          SYSTEM METRICS
      ====================== */}
            <section className="py-20 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    <Metric value="AI-Driven" label="Decision Engine" />
                    <Metric value="Role-Based" label="Access Control" />
                    <Metric value="Modular" label="System Design" />
                    <Metric value="Scalable" label="Architecture" />
                </div>
            </section>

            {/* ======================
          HOW IT WORKS
      ====================== */}
            <section id="how-it-works" className="py-24">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-16">The GainTrack Protocol</h2>
                    <div className="grid md:grid-cols-4 gap-12">
                        <Step number="01" title="Onboarding" desc="Define baseline & goals." />
                        <Step number="02" title="Data Input" desc="Log health metrics." />
                        <Step number="03" title="Synthesis" desc="AI builds your plan." />
                        <Step number="04" title="Execution" desc="Track & refine results." />
                    </div>
                </div>
            </section>

            {/* ======================
          CTA
      ====================== */}
            <section className="px-6 py-16">
                <div className="max-w-5xl mx-auto bg-indigo-600 rounded-3xl p-12 text-center text-white shadow-2xl shadow-indigo-200">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Start your transformation today.
                    </h2>
                    <p className="text-indigo-100 mb-10 max-w-md mx-auto">
                        Join thousands using data-driven fitness. No credit card required.
                    </p>

                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 px-10 py-4 rounded-xl font-bold transition-transform hover:scale-105"
                    >
                        Get Started Free <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            <footer className="py-12 text-center border-t border-slate-100">
                <p className="text-slate-400 text-sm">
                    © {new Date().getFullYear()} GainTrack Systems. Engineering better health.
                </p>
                <p className="text-slate-500 text-xs mt-1">
                    Designed & developed by Jeckson Liew
                </p>
            </footer>
        </div>
    );
}

/* ======================
   COMPONENTS
====================== */

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="bg-white border border-slate-200/60 p-8 rounded-2xl hover:border-indigo-200 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-slate-600 text-sm">{desc}</p>
        </div>
    );
}

function ComparisonCard({ title, points, highlight }) {
    return (
        <div
            className={`rounded-2xl p-8 border ${highlight
                    ? "border-indigo-300 shadow-xl shadow-indigo-500/10"
                    : "border-slate-200"
                } bg-white`}
        >
            <h3
                className={`text-lg font-bold mb-6 ${highlight ? "text-indigo-600" : ""
                    }`}
            >
                {title}
            </h3>

            <ul className="space-y-3 text-sm">
                {points.map((p, i) => (
                    <li key={i} className="flex gap-3 text-slate-600">
                        <CheckCircle2
                            className={`w-4 h-4 ${highlight ? "text-indigo-500" : "text-slate-400"
                                }`}
                        />
                        {p}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Metric({ value, label }) {
    return (
        <div>
            <div className="text-3xl font-extrabold text-indigo-600 mb-2">
                {value}
            </div>
            <div className="text-sm text-slate-500">{label}</div>
        </div>
    );
}

function Step({ number, title, desc }) {
    return (
        <div>
            <div className="text-4xl font-black text-slate-100 mb-4">{number}</div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-slate-500 text-sm">{desc}</p>
        </div>
    );
}
