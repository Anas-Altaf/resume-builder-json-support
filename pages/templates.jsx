import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SparklesCore } from "../components/ui/sparkles";

const templates = [
  {
    id: 1,
    name: "Google Style",
    image: "/assets/resume.jpg",
    description: "Clean, metrics-driven format preferred by Google recruiters",
    style: "modern",
    features: [
      "Quantifiable achievements",
      "Clear section hierarchy",
      "Bullet-point focused"
    ]
  },
  {
    id: 2,
    name: "Amazon Leadership",
    image: "/assets/resume.jpg",
    description: "Emphasizes leadership principles and results",
    style: "leadership",
    features: [
      "STAR format bullets",
      "Leadership principles aligned",
      "Metrics highlighted"
    ]
  },
  {
    id: 3,
    name: "Meta Technical",
    image: "/assets/resume.jpg",
    description: "Technical skills-focused layout for engineering roles",
    style: "technical",
    features: [
      "Technical skills matrix",
      "Project highlights",
      "System design experience"
    ]
  },
  {
    id: 4,
    name: "Apple Design",
    image: "/assets/resume.jpg",
    description: "Clean, minimalist design with strong typography",
    style: "minimal",
    features: [
      "Typography focused",
      "Whitespace optimized",
      "Visual hierarchy"
    ]
  },
  {
    id: 5,
    name: "Minimal Classic",
    image: "/assets/resume.jpg",
    description: "Simple, elegant, and professional layout",
    style: "minimal",
    features: [
      "Clean typography",
      "Perfect spacing",
      "Traditional structure"
    ]
  }
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen relative w-full bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Sparkles Background */}
      <div className="w-full absolute inset-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      
      <div className="relative z-10 pt-20 pb-16 px-4 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 pb-8">
          Choose Your Template
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ template }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative group rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden"
    >
      <div className="aspect-[4/3] relative">
        <img
          src={template.image}
          alt={template.name}
          className="object-contain w-full h-full p-4 bg-white/5"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Link
            href={`/builder?template=${template.id}`}
            className="relative inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            Use Template
          </Link>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white">{template.name}</h3>
        <p className="text-slate-400 mt-2 text-sm">{template.description}</p>
      </div>
    </motion.div>
  );
} 