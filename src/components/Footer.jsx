
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';
import { SiTiktok } from 'react-icons/si';

const API_URL = import.meta.env.VITE_API_URL;
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const FOOTER_SECTIONS = [
    {
        title: 'Shop', links: [
            { label: 'New Arrivals', to: '/collection' },
            { label: 'Men', to: '/collection', state: { gender: 'male' } },
            { label: 'Women', to: '/collection', state: { gender: 'female' } },
            { label: 'Sale', to: '/collection', state: { sale: true } },
        ]
    },
    {
        title: 'Support', links: [
            { label: 'Help Center', to: '/help' },
            { label: 'Shipping', to: '/shipping' },
            { label: 'Returns', to: '/returns' },
            { label: 'Order Status', to: '/orders' },
        ]
    },
    {
        title: 'About', links: [
            { label: 'Our Story', to: '/about' },
            { label: 'Sustainability', to: '/sustainability' },
            { label: 'Careers', to: '/careers' },
            { label: 'Contact', to: '/contact' },
        ]
    },
];

const SOCIALS = [
    { icon: FiInstagram, label: 'Instagram', href: 'https://www.instagram.com/hoodkidapparel/' },
    { icon: SiTiktok, label: 'TikTok', href: 'https://www.tiktok.com/@hoodkidapparel' },
    { icon: FiFacebook, label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100068642961395' },
    { icon: FiTwitter, label: 'X (Twitter)', href: 'https://x.com/HoodkidApparel' },
];

const LEGAL_LINKS = [
    { label: 'Privacy', to: '/privacy' },
    { label: 'Terms', to: '/terms' },
    { label: 'Cookies', to: '/cookies' },
];

const FooterColumn = ({ title, links }) => (
    <div>
        <h3 className="text-xs font-black uppercase tracking-widest mb-4 text-white">{title}</h3>
        <ul className="space-y-3">
            {links.map((link) => (
                <li key={link.label}>
                    <Link to={link.to} state={link.state} className="text-sm text-gray-400 hover:text-white transition-colors duration-200">{link.label}</Link>
                </li>
            ))}
        </ul>
    </div>
);

const SocialLinks = () => (
    <div className="flex gap-4 items-center">
        {SOCIALS.map(({ icon: Icon, label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`HOODKID on ${label}`} className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-white hover:text-white transition-colors duration-200">
                <Icon size={16} strokeWidth={2} />
            </a>
        ))}
    </div>
);

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !isValidEmail(email)) { toast.error('Please enter a valid email'); return; }
        setSubmitting(true);
        try {
            const { data } = await axios.post(`${API_URL}/api/newsletter/subscribe`, { email });
            if (data?.success === false) throw new Error(data.message || 'Could not subscribe');
            setSubscribed(true);
            setEmail('');
            toast.success('Thanks - you are subscribed!');
        } catch (err) {
            console.error('Newsletter subscribe failed:', err);
            toast.error(err.response?.data?.message || err.message || 'Could not subscribe. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (subscribed) {
        return (
            <div>
                <h3 className="text-xs font-black uppercase tracking-widest mb-4 text-white">Join Us</h3>
                <p className="text-sm text-gray-400 leading-relaxed">You are on the list. Watch your inbox for the next drop.</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-xs font-black uppercase tracking-widest mb-4 text-white">Join Us</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">Get updates on new drops and exclusive offers.</p>
            <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input id="newsletter-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" disabled={submitting} className="w-full px-3 py-2.5 text-sm bg-gray-900 text-white border border-gray-700 placeholder-gray-500 focus:border-white outline-none transition-colors duration-200 disabled:opacity-50" />
                <button type="submit" disabled={submitting} className="mt-3 w-full bg-white text-black py-2.5 text-sm font-bold uppercase tracking-wide hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                    {submitting ? 'Subscribing...' : 'Subscribe'}
                </button>
            </form>
        </div>
    );
};

const Footer = () => (
    <footer className="bg-[#111111] text-gray-100 mt-20 border-t border-gray-800">
        <div className="px-6 sm:px-10 py-12 sm:py-16 max-w-6xl mx-auto">
            <div className="sm:hidden mb-10">
                <Link to="/" className="inline-block">
                    <h2 className="text-2xl font-black tracking-tight text-white">HOODKID.</h2>
                </Link>
                <p className="text-xs uppercase tracking-widest text-gray-400 mt-2">Wear If You are Real</p>
                <div className="mt-5"><SocialLinks /></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10">
                {FOOTER_SECTIONS.map((section) => (
                    <FooterColumn key={section.title} title={section.title} links={section.links} />
                ))}
                <div className="col-span-2 sm:col-span-1"><Newsletter /></div>
            </div>
            <div className="hidden sm:flex justify-between items-center mt-12 pt-8 border-t border-gray-800">
                <Link to="/" className="inline-block">
                    <h2 className="text-xl font-black tracking-tight text-white">HOODKID.</h2>
                </Link>
                <SocialLinks />
            </div>
        </div>
        <div className="border-t border-gray-800 px-6 sm:px-10 py-5 max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-3">
            <p>(c) {new Date().getFullYear()} HOODKID. All rights reserved.</p>
            <div className="flex gap-5">
                {LEGAL_LINKS.map((link) => (
                    <Link key={link.label} to={link.to} className="hover:text-white transition-colors duration-200">{link.label}</Link>
                ))}
            </div>
        </div>
    </footer>
);

export default Footer;