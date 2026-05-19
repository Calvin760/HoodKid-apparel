import { useContext, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { optimizeCloudinaryVideo } from '../utils/cloudinary';

const API_URL = import.meta.env.VITE_API_URL;

/* ============================================================
   HELPERS
   ============================================================ */
const resolveUrl = (src) =>
    !src ? '' : src.startsWith('http') ? src : `${API_URL}/${src}`;

const resolveVideo = (product) =>
    product?.video ? optimizeCloudinaryVideo(resolveUrl(product.video)) : null;

/* ============================================================
   AUTOPLAY VIDEO
   ============================================================ */
const AutoplayVideo = ({ src, className = '' }) => (
    <video
        className={className}
        autoPlay loop muted playsInline preload="metadata"
    >
        <source src={src} type="video/mp4" />
    </video>
);

/* ============================================================
   CTA BUTTON — two visual variants
   ============================================================ */
const CtaButton = ({ to, state, variant = 'light', children }) => {
    const styles =
        variant === 'light'
            ? 'bg-white text-black border-white hover:bg-black hover:text-white'
            : 'bg-black text-white border-black hover:bg-white hover:text-black';

    return (
        <Link to={to} state={state}>
            <button
                className={`mt-6 w-fit px-7 py-2.5 text-sm font-bold border transition-colors duration-200 ${styles}`}
            >
                {children}
            </button>
        </Link>
    );
};

/* ============================================================
   CINEMATIC HERO (full-bleed video + left-aligned copy)
   ============================================================ */
const CinematicHero = ({ video, eyebrow, title, ctaLabel, ctaTo, ctaState }) => (
    <div className="relative w-full h-[65vh] overflow-hidden mb-16">
        <AutoplayVideo src={video} className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-16">
            <h2 className="text-white text-3xl sm:text-5xl font-black tracking-tight leading-tight whitespace-pre-line">
                {title}
            </h2>

            {eyebrow && (
                <p className="mt-2 text-sm tracking-widest text-gray-300 uppercase">
                    {eyebrow}
                </p>
            )}

            {ctaLabel && ctaTo && (
                <CtaButton to={ctaTo} state={ctaState} variant="light">
                    {ctaLabel}
                </CtaButton>
            )}
        </div>
    </div>
);

/* ============================================================
   STATEMENT BLOCK
   ============================================================ */
const StatementBlock = ({ title, body }) => (
    <div className="px-6 sm:px-[8vw] mb-16">
        <div className="max-w-3xl">
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight whitespace-pre-line">
                {title}
            </h3>
            {body && (
                <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                    {body}
                </p>
            )}
        </div>
    </div>
);

/* ============================================================
   PORTRAIT SPLIT (video left, copy right)
   ============================================================ */
const PortraitSplit = ({ video, title, body, ctaLabel, ctaTo, ctaState }) => (
    <div className="px-6 sm:px-[8vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="relative w-full h-[75vh] sm:h-[80vh] overflow-hidden rounded-2xl">
                <AutoplayVideo src={video} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="flex flex-col justify-center">
                <h4 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {title}
                </h4>
                {body && (
                    <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                        {body}
                    </p>
                )}
                {ctaLabel && ctaTo && (
                    <CtaButton to={ctaTo} state={ctaState} variant="dark">
                        {ctaLabel}
                    </CtaButton>
                )}
            </div>
        </div>
    </div>
);

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
const FreshDrop = ({
    hero = defaultHero,
    statement = defaultStatement,
    portrait = defaultPortrait,
}) => {
    const { products } = useContext(ShopContext);

    const heroVideo = useMemo(
        () => resolveVideo(products?.find((p) => p.hero === hero.heroKey)),
        [products, hero.heroKey]
    );

    const portraitVideo = useMemo(
        () => resolveVideo(products?.find((p) => p.hero === portrait.heroKey)),
        [products, portrait.heroKey]
    );

    // Hide entire section if the cinematic hero has no video source
    if (!heroVideo) return null;

    return (
        <section className="my-20">
            <CinematicHero
                video={heroVideo}
                eyebrow={hero.eyebrow}
                title={hero.title}
                ctaLabel={hero.ctaLabel}
                ctaTo={hero.ctaTo}
                ctaState={hero.ctaState}
            />

            <StatementBlock title={statement.title} body={statement.body} />

            {portraitVideo && (
                <PortraitSplit
                    video={portraitVideo}
                    title={portrait.title}
                    body={portrait.body}
                    ctaLabel={portrait.ctaLabel}
                    ctaTo={portrait.ctaTo}
                    ctaState={portrait.ctaState}
                />
            )}
        </section>
    );
};

/* ============================================================
   DEFAULT CONTENT
   ============================================================ */
const defaultHero = {
    heroKey: 'hero2',
    eyebrow: 'Engineered for impact',
    title: 'FRESH\nENERGY',
    ctaLabel: 'EXPLORE',
    ctaTo: '/collection',
    ctaState: { subcategory: 'anti pilling fleece' },
};

const defaultStatement = {
    title: 'BUILT TO MOVE.\nDESIGNED TO DISRUPT.',
    body: 'This is not just another drop. It\u2019s a shift in energy \u2014 where performance meets street precision. Every detail is tuned for motion, speed, and presence.',
};

const defaultPortrait = {
    heroKey: 'hero3',
    title: 'NEXT GEN STREETWEAR',
    body: 'Precision cuts. Lightweight feel. Maximum attitude. Built for creators, movers, and rule breakers.',
    ctaLabel: 'SHOP THE DROP',
    ctaTo: '/collection',
    ctaState: { subcategory: 'menace to the society' },
};

export default memo(FreshDrop);