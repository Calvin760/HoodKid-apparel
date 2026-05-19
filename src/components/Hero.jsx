import { memo } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

/**
 * Hero — renders two distinct stories: one mobile, one desktop.
 *
 * Each variant accepts its own content via `mobile` and `desktop` props.
 * Defaults are provided so <Hero /> still works without configuration.
 */
const Hero = ({ mobile = defaultMobile, desktop = defaultDesktop }) => {
  return (
    <section className="w-full">
      <MobileHero {...mobile} />
      <DesktopHero {...desktop} />
    </section>
  );
};

/* ============================================================
   MOBILE VARIANT
   ============================================================ */
const MobileHero = ({ image, title, subtitle, ctaLabel, ctaTo, ctaState }) => (
  <div className="block sm:hidden">
    <div className="relative w-full h-[60vh] overflow-hidden">
      <img
        src={image}
        alt={title}
        loading="eager"
        fetchPriority="high"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/10" />
    </div>

    <div className="text-center px-6 py-6 flex flex-col items-center">
      <h1 className="text-2xl font-black tracking-tight">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-2 text-xs tracking-widest text-gray-600 uppercase">
          {subtitle}
        </p>
      )}

      {ctaLabel && ctaTo && (
        <Link to={ctaTo} state={ctaState}>
          <button className="mt-4 px-6 py-2.5 bg-black text-white text-sm font-bold hover:bg-gray-900 transition-colors duration-200">
            {ctaLabel}
          </button>
        </Link>
      )}
    </div>
  </div>
);

/* ============================================================
   DESKTOP VARIANT
   ============================================================ */
const DesktopHero = ({ images, eyebrow, title, ctaLabel, ctaTo, ctaState }) => (
  <div className="hidden sm:block relative w-full h-[80vh] overflow-hidden">
    <div className="grid grid-cols-2 h-full">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`${title} ${i + 1}`}
          loading="eager"
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
      ))}
    </div>

    <div className="absolute inset-0 bg-black/10" />

    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
      {eyebrow && (
        <p className="text-white text-sm tracking-widest mb-3 uppercase">
          {eyebrow}
        </p>
      )}

      <h1 className="text-white text-4xl md:text-6xl font-black tracking-tight">
        {title}
      </h1>

      {ctaLabel && ctaTo && (
        <Link to={ctaTo} state={ctaState}>
          <button className="mt-6 px-8 py-2.5 bg-white text-black text-sm font-bold hover:bg-black hover:text-white transition-colors duration-200">
            {ctaLabel}
          </button>
        </Link>
      )}
    </div>
  </div>
);

/* ============================================================
   DEFAULT CONTENT
   ============================================================ */
const defaultMobile = {
  image: assets.p29,
  title: 'ANTI-PILLING FLEECE',
  subtitle: 'Soft feel. No compromises.',
  ctaLabel: 'SHOP NOW',
  ctaTo: '/collection',
  ctaState: { subcategory: 'anti pilling fleece' },
};

const defaultDesktop = {
  images: [assets.p26, assets.p30],
  eyebrow: 'Level up your look',
  title: 'NEW SEASON DROP',
  ctaLabel: 'SHOP NOW',
  ctaTo: '/collection',
  ctaState: { subcategory: 'anti pilling fleece' },
};

export default memo(Hero);