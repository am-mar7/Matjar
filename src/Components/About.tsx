// src/components/aboutPage.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FaHeart,
  FaAward,
  FaRecycle,
  FaLightbulb,
  FaUsers,
  FaStar,
} from "react-icons/fa";

const heroImages: string[] = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600",
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600",
];

// Types
interface Value {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

interface Stat {
  number: string;
  label: string;
}

function aboutPage() {
  const { t } = useTranslation();
  const [index, setIndex] = useState<number>(0);

  // Core Values
  const values: Value[] = [
    {
      icon: <FaHeart className="w-12 h-12 md:w-14 md:h-14 text-cyan-400" />,
      title: t("values.passion") || "Passion",
      desc: t("values.passion_desc") || "We pour our hearts into every design, ensuring each piece reflects our love for fashion.",
    },
    {
      icon: <FaAward className="w-12 h-12 md:w-14 md:h-14 text-cyan-400" />,
      title: t("values.quality") || "Quality",
      desc: t("values.quality_desc") || "Premium materials and meticulous attention to detail in every step.",
    },
    {
      icon: <FaRecycle className="w-12 h-12 md:w-14 md:h-14 text-cyan-400" />,
      title: t("values.sustainability") || "Sustainability",
      desc: t("values.sustainability_desc") || "Committed to eco-friendly practices and ethical sourcing.",
    },
    {
      icon: <FaLightbulb className="w-12 h-12 md:w-14 md:h-14 text-cyan-400" />,
      title: t("values.innovation") || "Innovation",
      desc: t("values.innovation_desc") || "Constantly evolving while staying true to timeless aesthetics.",
    },
    {
      icon: <FaUsers className="w-12 h-12 md:w-14 md:h-14 text-cyan-400" />,
      title: t("values.community") || "Community",
      desc: t("values.community_desc") || "Building meaningful connections with our customers.",
    },
    {
      icon: <FaStar className="w-12 h-12 md:w-14 md:h-14 text-cyan-400" />,
      title: t("values.excellence") || "Excellence",
      desc: t("values.excellence_desc") || "Never settling for good enough—we strive for perfection.",
    },
  ];

  // Team Members
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Creative Director",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    },
    {
      id: 2,
      name: "Sarah Miller",
      role: "Lead Designer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Brand Manager",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    },
    {
      id: 4,
      name: "Emma Davis",
      role: "Marketing Head",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    },
  ];

  // Statistics
  const stats: Stat[] = [
    { number: "10K+", label: t("stats.customers") || "Happy Customers" },
    { number: "500+", label: t("stats.products") || "Products" },
    { number: "50+", label: t("stats.countries") || "Countries" },
    { number: "99%", label: t("stats.satisfaction") || "Satisfaction" },
  ];

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section
        aria-label="aboutPage Us Hero"
        className="relative min-h-[70vh] sm:min-h-[75vh] md:min-h-[85vh] overflow-hidden bg-slate-950 flex items-center justify-center"
      >
        {/* Background slider */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${heroImages[index]})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            aria-hidden="true"
          />
        </AnimatePresence>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/80 to-slate-900/60" />

        {/* Main content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h3
            className="text-cyan-400 tracking-widest uppercase text-xs sm:text-sm mb-3"
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            {t("aboutPage.tag") || "Our Story"}
          </motion.h3>

          <motion.h1
            className="text-white font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.9 }}
          >
            {t("aboutPage.title") || "Welcome to"}{" "}
            <span className="text-cyan-400">{t('logo')}</span>
          </motion.h1>

          <motion.p
            className="text-slate-200 text-sm sm:text-base md:text-lg mb-8 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.9 }}
          >
            {t("aboutPage.subtitle") || "We're not just a brand—we're a movement. Redefining quality, style, and sustainability for the modern generation."}
          </motion.p>
        </div>

        {/* Footer text */}
        <motion.div
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-slate-400 text-xs tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {t("aboutPage.scroll") || "Scroll to explore"}
        </motion.div>
      </section>

      {/* STORY SECTION */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-cyan-500 uppercase tracking-widest mx-3 text-xs sm:text-sm font-bold">
              {t("aboutPage.journey") || "Our Journey"}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-3 mb-6 relative inline-block after:absolute after:left-0 after:bottom-[-6px] after:h-1 after:w-full after:bg-cyan-500 after:rounded-full">
              {t("aboutPage.story_title") || "The Story Behind Us"}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                {t("aboutPage.story_p1") || "Founded in 2020, we started with a simple vision: to create products that don't compromise on quality, style, or ethics. From a small studio, we've grown into a trusted brand serving thousands worldwide."}
              </p>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                {t("aboutPage.story_p2") || "Every product we offer is carefully curated to blend contemporary design with timeless elegance. We believe in quality over quantity, sustainability over trends, and authenticity over imitation."}
              </p>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                {t("aboutPage.story_p3") || "Our mission goes beyond commerce—we're building a community of conscious consumers who value craftsmanship, ethical practices, and meaningful connections."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden shadow-lg h-64 sm:h-80">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600"
                  alt="Our craftsmanship"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg h-64 sm:h-80 mt-8">
                <img
                  src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600"
                  alt="Quality products"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-cyan-400 uppercase tracking-widest text-xs sm:text-sm font-bold">
              {t("aboutPage.what_drives") || "What Drives Us"}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-3">
              {t("aboutPage.values_title") || "Our Core Values"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 backdrop-blur border border-cyan-500/20 rounded-2xl p-6 sm:p-8 text-center hover:bg-slate-700/50 hover:border-cyan-400/40 hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-white text-lg sm:text-xl font-bold mb-3">
                  {value.title}
                </h3>
                <p className="text-cyan-100/80 text-sm sm:text-base leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="text-center p-6 rounded-2xl bg-slate-800/30 border border-cyan-500/10 hover:border-cyan-400/30 hover:scale-105 transition-all duration-300"
              >
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-cyan-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-300 text-sm sm:text-base font-semibold uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-cyan-500 uppercase mx-2 tracking-widest text-xs sm:text-sm font-bold">
              {t("aboutPage.meet_experts") || "Meet The Experts"}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-3 mb-6 relative inline-block after:absolute after:left-0 after:bottom-[-6px] after:h-1 after:w-full after:bg-cyan-500 after:rounded-full">
              {t("aboutPage.team_title") || "Our Creative Team"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5 text-center">
                  <h4 className="text-lg font-bold text-slate-900 mb-1">
                    {member.name}
                  </h4>
                  <p className="text-cyan-600 font-semibold text-sm">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-cyan-900 to-cyan-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
            {t("aboutPage.cta_title") || "Join Our Community"}
          </h2>
          <p className="text-white/95 text-base sm:text-lg lg:text-xl mb-8 max-w-2xl mx-auto">
            {t("aboutPage.cta_subtitle") || "Experience quality that makes a difference. Shop our latest collection and discover why thousands trust us."}
          </p>
          <button className="bg-slate-900 hover:bg-white text-white hover:text-cyan-600 px-8 sm:px-12 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base uppercase tracking-wider shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
            {t("aboutPage.cta_button") || "Shop Now"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default aboutPage;