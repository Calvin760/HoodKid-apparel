import { Link } from 'react-router-dom';
import {
  FiAward,
  FiMinimize2,
  FiUsers,
  FiArrowRight,
} from 'react-icons/fi';

import { assets } from '../assets/assets';

/* ============================================================
   VALUE CARD
   ============================================================ */
const ValueCard = ({ icon: Icon, title, body }) => (
  <div className="border border-gray-200 p-6 sm:p-8 group hover:border-black transition-colors duration-200">
    <div className="w-12 h-12 mb-5 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-black transition-colors duration-200">
      <Icon
        size={22}
        strokeWidth={2}
        className="text-black group-hover:text-white transition-colors duration-200"
      />
    </div>
    <h3 className="text-base font-black uppercase tracking-widest mb-2">
      {title}
    </h3>
    <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
  </div>
);

/* ============================================================
   STAT
   ============================================================ */
const Stat = ({ value, label }) => (
  <div>
    <p className="text-3xl sm:text-4xl font-black tracking-tight">{value}</p>
    <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-500">
      {label}
    </p>
  </div>
);

/* ============================================================
   MAIN
   ============================================================ */
const About = ({
  intro = defaultIntro,
  story = defaultStory,
  mission = defaultMission,
  values = defaultValues,
  stats = defaultStats,
  cta = defaultCta,
}) => {
  return (
    <div className="text-black">
      <div className="px-6 sm:px-12 py-16 sm:py-24 max-w-6xl mx-auto">
        {/* ============================================================
            INTRO
            ============================================================ */}
        <section className="mb-16 sm:mb-24 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
            {intro.eyebrow}
          </p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-6 leading-tight">
            {intro.title}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            {intro.subtitle}
          </p>
        </section>

        {/* ============================================================
            STORY (image left)
            ============================================================ */}
        <section className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-20 sm:mb-28 items-center">
          {story.image && (
            <div className="relative h-[400px] sm:h-[500px] overflow-hidden">
              <img
                src={story.image}
                alt={story.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
              {story.eyebrow}
            </p>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-6">
              {story.title}
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              {story.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            STATS STRIP
            ============================================================ */}
        {stats.length > 0 && (
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 py-10 sm:py-12 border-y border-gray-200 mb-20 sm:mb-28">
            {stats.map((s, i) => (
              <Stat key={i} value={s.value} label={s.label} />
            ))}
          </section>
        )}

        {/* ============================================================
            MISSION (image right)
            ============================================================ */}
        <section className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-20 sm:mb-28 items-center">
          <div className="lg:order-2">
            {mission.image && (
              <div className="relative h-[400px] sm:h-[500px] overflow-hidden">
                <img
                  src={mission.image}
                  alt={mission.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="lg:order-1">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
              {mission.eyebrow}
            </p>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-6">
              {mission.title}
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              {mission.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            VALUES
            ============================================================ */}
        <section className="mb-20 sm:mb-28">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
              What We Stand For
            </p>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Our Values
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {values.map((v, i) => (
              <ValueCard key={i} icon={v.icon} title={v.title} body={v.body} />
            ))}
          </div>
        </section>

        {/* ============================================================
            CTA
            ============================================================ */}
        {cta && (
          <section className="bg-black text-white px-6 sm:px-12 py-12 sm:py-16 text-center">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-4">
              {cta.title}
            </h2>
            {cta.body && (
              <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto mb-8 leading-relaxed">
                {cta.body}
              </p>
            )}
            <Link
              to={cta.ctaTo}
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 text-sm font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors duration-200"
            >
              {cta.ctaLabel}
              <FiArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </section>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   DEFAULT CONTENT
   ============================================================ */
const defaultIntro = {
  eyebrow: 'About HOODKID',
  title: 'More than a store. A culture.',
  subtitle:
    'HOODKID is built on clean design, premium feel, and pieces that move with you — wherever the day takes you.',
};

const defaultStory = {
  eyebrow: 'Our Story',
  title: 'Built from the streets up.',
  image: assets.p29,
  paragraphs: [
    'HOODKID started with a simple idea — that everyday wear deserves the same intention as a runway piece. We design for the people moving through the city, building something real, showing up as themselves.',
    'Every drop is small, considered, and made to outlast the next trend cycle. No filler, no compromise.',
  ],
};

const defaultMission = {
  eyebrow: 'Our Mission',
  title: 'Bold, simple, accessible.',
  image: assets.p30,
  paragraphs: [
    'We make pieces we want to wear ourselves — built to last, priced fairly, and designed to feel as good on the tenth wear as the first.',
    'Quality first, hype never.',
  ],
};

const defaultValues = [
  {
    icon: FiAward,
    title: 'Quality',
    body: 'Premium fabrics, considered cuts. Built to last, not trend.',
  },
  {
    icon: FiMinimize2,
    title: 'Minimalism',
    body: 'Clean lines and quiet confidence. Less noise, more impact.',
  },
  {
    icon: FiUsers,
    title: 'Community',
    body: 'Driven by the people who wear it, not the people who sell it.',
  },
];

const defaultStats = [
  { value: '2016', label: 'Founded' },
  { value: '50+', label: 'Drops' },
  { value: '10K+', label: 'Pieces sold' },
  { value: '100%', label: 'Local' },
];

const defaultCta = {
  title: 'Ready to wear it?',
  body: 'Explore the latest drop and find your fit.',
  ctaLabel: 'Shop the Collection',
  ctaTo: '/collection',
};

export default About;