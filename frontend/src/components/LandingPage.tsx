import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Leaf, Sparkles, HelpCircle, ChevronDown, ChevronUp, Layers, Box, Cpu, FileText, Zap } from 'lucide-react';

interface LandingPageProps {
  onStartRecommendation: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onExploreMaterials: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartRecommendation,
  onOpenAuth,
  onExploreMaterials
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const foodCategories = [
    { title: "Fruits", img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=600", desc: "Climacteric & non-climacteric produce requiring controlled respiration." },
    { title: "Vegetables", img: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&q=80&w=600", desc: "Perishable produce needing micro-perforated atmospheric gas balance." },
    { title: "Grains & Staples", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600", desc: "Low moisture staples needing high puncture resistance & pest barrier." },
    { title: "Snacks & Confectionery", img: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=600", desc: "High-fat foods vulnerable to crispness loss, oxidation & rancidity." },
    { title: "Dairy Products", img: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=600", desc: "Light-sensitive items requiring UV barrier and gas flushing." },
    { title: "Bakery", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600", desc: "Baked goods requiring moisture locks to prevent rapid staling & mold." },
    { title: "Fresh Meat", img: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=600", desc: "Protein-rich meat demanding leak-proof EVOH oxygen barrier film." },
    { title: "Seafood", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600", desc: "Chilled fish fillets needing gas flush and odor-barrier retention." },
    { title: "Frozen Foods", img: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&q=80&w=600", desc: "Sub-zero commodities requiring low-temp flex stability." },
    { title: "Ready-to-Eat Foods", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600", desc: "Retortable laminates withstand high temp thermal processing." }
  ];

  const platformFeatures = [
    { title: "Intelligent Material Matching", desc: "Multi-criteria mathematical scoring matches optimal packaging structures.", icon: Cpu },
    { title: "Biophysical Property Analysis", desc: "Evaluates moisture %, fat oxidation, pH, respiration rate & environmental sensitivity.", icon: Layers },
    { title: "Respiration Produce Engine", desc: "Calculates micro-perforation and breathable film permeability for climacteric fruits.", icon: Leaf },
    { title: "Modified Atmosphere (MAP)", desc: "Recommends exact gas mixtures (N2, O2, CO2) for shelf-life extension.", icon: Box },
    { title: "Barrier Requirement Analysis", desc: "Calculates quantitative & qualitative OTR, WVTR & UV light protection.", icon: ShieldCheck },
    { title: "PDF Report Export", desc: "Generates downloadable PDF technical report with specs & disclaimers.", icon: FileText },
    { title: "Real QR Code Traceability", desc: "Live camera scan & image upload QR traceability verification page.", icon: Zap },
    { title: "Ask PackWise AI Assistant", desc: "Grounded domain QA chatbot for food packaging science inquiries.", icon: HelpCircle }
  ];

  const faqs = [
    { q: "How does PackWise AI determine packaging material recommendations?", a: "PackWise AI uses a hybrid decision-support engine combining rule-based biophysical food science logic with multi-criteria weighted scoring across moisture barrier, OTR, WVTR, storage temperature, mechanical puncture resistance, cost, and sustainability parameters." },
    { q: "Why shouldn't all fresh fruits and vegetables be sealed in 100% airtight plastic?", a: "Fresh produce continues to respire after harvest, taking in O2 and emitting CO2. Sealing high-respiration produce in 100% airtight plastic starves it of oxygen, triggering anaerobic fermentation, ethanol off-odors, and rapid decay. PackWise AI recommends micro-perforated or breathable films." },
    { q: "Does the platform generate downloadable PDF reports and QR codes?", a: "Yes. Every generated recommendation can be exported as an official PDF report complete with technical specifications, compatibility score breakdown, scientific disclaimers, and a unique QR traceability code." },
    { q: "Who can use PackWise AI?", a: "PackWise AI is designed for farmers, food manufacturers, startups, researchers, agriculture students, and packaging professionals seeking validated decision support." }
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E7]/40 text-slate-dark overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-b from-white via-[#FFF8E7]/60 to-[#FFF8E7]/20 border-b border-[#4CAF50]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4CAF50]/10 border border-[#4CAF50]/30 text-[#245B35] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#FF9800]" />
              Smart India Hackathon Problem Statement 26236
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#245B35] leading-tight">
              Smarter Packaging. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] via-[#7CB342] to-[#FF9800]">
                Better Food Protection.
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed font-normal">
              An intelligent decision-support platform that analyzes food commodity properties, metabolic respiration, and environmental storage conditions to recommend precise, sustainable packaging materials and specifications.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onStartRecommendation}
                className="flex items-center gap-2 bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white font-extrabold text-base px-7 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Generate Packaging Recommendation
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <a
                href="#how-it-works"
                className="flex items-center gap-2 bg-white hover:bg-slate-50 text-[#245B35] border border-[#245B35]/20 font-bold text-base px-6 py-4 rounded-2xl shadow-sm transition-all"
              >
                Explore How It Works
              </a>
            </div>

            {/* Quick Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80">
              <div>
                <p className="text-2xl font-extrabold text-[#245B35]">100%</p>
                <p className="text-xs text-slate-500 font-semibold">Dynamic Engine</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#4CAF50]">14+</p>
                <p className="text-xs text-slate-500 font-semibold">Packaging Materials</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#FF9800]">Multi-Criteria</p>
                <p className="text-xs text-slate-500 font-semibold">Transparent Scoring</p>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card Layout */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white p-3">
              <img
                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800"
                alt="Fresh Food Produce & Packaging"
                className="w-full h-[420px] object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl flex flex-col justify-end p-6 text-white">
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl text-slate-dark shadow-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#245B35] uppercase tracking-wider">Dynamic Multi-Criteria Analysis</span>
                    <span className="text-xs bg-[#4CAF50] text-white px-2 py-0.5 rounded font-bold">Calculated Score</span>
                  </div>
                  <p className="font-extrabold text-sm text-[#245B35]">Food Biophysics → Material Permeability Match</p>
                  <p className="text-xs text-slate-600 mt-1">Evaluates OTR, WVTR, respiration rate, and storage temperature dynamically.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* THE PROBLEM SECTION */}
      <section className="py-16 bg-white border-b border-slate-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-[#245B35]">The Packaging Challenge in Agriculture</h2>
            <p className="text-slate-600 mt-2">Improper packaging material selection causes millions of tons of food loss worldwide annually.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Moisture Absorption", desc: "Crisp snacks lose crunch while dry grains spoil rapidly under high RH.", color: "border-amber-400 bg-amber-50/50" },
              { title: "Lipid Oxidation", desc: "High-fat foods turn rancid when exposed to light and unshielded oxygen.", color: "border-red-400 bg-red-50/50" },
              { title: "Microbial Spoilage", desc: "Inadequate barrier films permit rapid bacterial and fungal proliferation.", color: "border-emerald-400 bg-emerald-50/50" },
              { title: "Texture & Nutrient Loss", desc: "Improper gas exchange degrades vitamins, firmness, and natural flavor.", color: "border-blue-400 bg-blue-50/50" }
            ].map((item, idx) => (
              <div key={idx} className={`p-6 rounded-2xl border-l-4 shadow-sm ${item.color} hover:shadow-md transition-shadow`}>
                <h3 className="font-extrabold text-base text-[#245B35] mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-[#FFF8E7]/50 border-b border-[#4CAF50]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#7CB342] uppercase tracking-wider">5-Step Decision Pipeline</span>
            <h2 className="text-3xl font-extrabold text-[#245B35] mt-1">How PackWise AI Recommends Packaging</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: "01", title: "Enter Food Details", desc: "Select commodity, processing state, shelf life & quantity." },
              { step: "02", title: "Analyze Properties", desc: "Assess moisture %, fat %, pH, respiration & sensitivity." },
              { step: "03", title: "Determine Requirements", desc: "Calculate OTR, WVTR, light & mechanical barrier needs." },
              { step: "04", title: "Match Materials", desc: "Evaluate 14+ materials & film structures." },
              { step: "05", title: "Generate Report", desc: "Get score breakdown, alternatives & downloadable PDF." }
            ].map((s, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-food-card border border-[#4CAF50]/20 flex flex-col justify-between hover:-translate-y-1 transition-all">
                <div>
                  <span className="text-3xl font-black text-[#FFC107] block mb-2">{s.step}</span>
                  <h3 className="font-extrabold text-sm text-[#245B35] mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES SECTION */}
      <section id="features" className="py-20 bg-white border-b border-slate-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#4CAF50] uppercase tracking-wider">Platform Capabilities</span>
            <h2 className="text-3xl font-extrabold text-[#245B35] mt-1">PackWise AI System Features</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map((feat, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#FFF8E7]/30 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <feat.icon className="w-8 h-8 text-[#4CAF50] mb-3" />
                <h3 className="font-extrabold text-base text-[#245B35] mb-1">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOD CATEGORIES GRID */}
      <section id="food-categories" className="py-20 bg-[#FFF8E7]/40 border-b border-slate-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#4CAF50] uppercase tracking-wider">Supported Commodities</span>
            <h2 className="text-3xl font-extrabold text-[#245B35] mt-1">Food Commodities Supported</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {foodCategories.map((cat, idx) => (
              <div key={idx} className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all">
                <div className="h-36 overflow-hidden relative">
                  <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <span className="absolute bottom-2 left-3 text-white font-extrabold text-sm">{cat.title}</span>
                </div>
                <div className="p-3">
                  <p className="text-[11px] text-slate-600 line-clamp-2">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUSTAINABILITY SECTION */}
      <section id="sustainability" className="py-20 bg-gradient-to-br from-[#245B35] to-[#1d492a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7CB342]/20 border border-[#7CB342]/40 text-[#7CB342] text-xs font-bold">
              <Leaf className="w-3.5 h-3.5" /> Eco-Conscious Packaging Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Balancing Food Preservation with Circular Sustainability
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed">
              PackWise AI evaluates recyclable monomaterial structures (BOPP/CPP, LDPE monolayer), bio-based compostable polymers (PLA/PBAT), and paper laminates to reduce environmental footprint without sacrificing barrier integrity.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "Recyclable Monomaterial polyolefins (RIC #4 LDPE & RIC #5 PP)",
                "Bio-based industrial compostable films for short-cycle produce",
                "Transparent sustainability vs. shelf-life trade-off analysis"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#FFC107] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onExploreMaterials}
              className="mt-4 bg-[#FF9800] hover:bg-[#FF9800]/90 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-md transition-all text-sm"
            >
              Explore Packaging Material Database
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/15">
            <h3 className="font-extrabold text-xl text-white mb-4">Material Sustainability Matrix</h3>
            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="font-bold text-sm text-[#FFC107]">Monomaterial PE / PP</p>
                <p className="text-xs text-slate-200 mt-1">Easily recyclable in municipal film streams. High moisture barrier.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="font-bold text-sm text-[#7CB342]">PLA / PBAT Bio-Polymer</p>
                <p className="text-xs text-slate-200 mt-1">Derived from renewable corn starch. Industrial compostable.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="font-bold text-sm text-sky-300">Kraft Paper Laminates</p>
                <p className="text-xs text-slate-200 mt-1">Renewable pulp substrate with eco-sealant inner layer.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT PLATFORM SECTION */}
      <section id="about" className="py-20 bg-white border-b border-slate-150">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold text-[#4CAF50] uppercase tracking-wider">About PackWise AI</span>
          <h2 className="text-3xl font-extrabold text-[#245B35]">Intelligent Decision Support for Food Packaging</h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Developed for Smart India Hackathon Problem Statement 26236, PackWise AI provides a scientific decision-support system to reduce post-harvest food waste, optimize packaging material selection, and accelerate sustainable packaging adoption across agricultural supply chains.
          </p>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-[#FFF8E7]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#245B35]">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-sm mt-1">Common questions about food packaging analysis & material matching.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 font-bold text-slate-dark text-base flex justify-between items-center hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-5 h-5 text-[#4CAF50]" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                {openFaq === idx && (
                  <div className="p-5 border-t border-slate-200 text-sm text-slate-600 bg-slate-50 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#245B35] text-white py-12 border-t border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="font-extrabold text-xl text-[#FFC107]">PackWise AI</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              AI-Based Intelligent Food Packaging Material Recommendation System for Food Commodities. Built for Smart India Hackathon Problem Statement 26236.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#7CB342] mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><button onClick={onStartRecommendation} className="hover:text-white">New Recommendation</button></li>
              <li><button onClick={onExploreMaterials} className="hover:text-white">Packaging Materials</button></li>
              <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
              <li><a href="#features" className="hover:text-white">Features</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#7CB342] mb-3">User Roles</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>Farmers & Agriculture Producers</li>
              <li>Food Manufacturers & Startups</li>
              <li>Researchers & Students</li>
              <li>Packaging Professionals</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#7CB342] mb-3">Scientific Compliance</h4>
            <p className="text-[11px] text-slate-300 leading-normal">
              PackWise AI is an intelligent decision-support system. Recommendations should be validated through standard food laboratory testing before commercial deployment.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-emerald-800/80 flex flex-col sm:flex-row justify-between text-xs text-slate-400">
          <p>© 2026 PackWise AI — Smart India Hackathon PS 26236</p>
          <p>Smarter Packaging. Better Food Protection.</p>
        </div>
      </footer>

    </div>
  );
};
