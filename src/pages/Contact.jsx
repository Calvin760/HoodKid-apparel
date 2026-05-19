import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FiMail,
  FiPhone,
  FiClock,
  FiBriefcase,
  FiSend,
  FiCheckCircle,
} from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL;

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const InfoBlock = ({ icon: Icon, title, children }) => (
  <div className="flex gap-4">
    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
      <Icon size={18} strokeWidth={2.5} className="text-black" />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-sm font-black uppercase tracking-widest mb-1">{title}</h3>
      <div className="text-sm text-gray-600 space-y-0.5">{children}</div>
    </div>
  </div>
);

const Field = ({ label, name, value, onChange, required, type = 'text', as = 'input', placeholder, disabled }) => {
  const Component = as;
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <Component
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={as === 'textarea' ? 5 : undefined}
        className={`mt-1 w-full border border-gray-300 px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed ${as === 'textarea' ? 'resize-none' : ''}`}
      />
    </label>
  );
};

const FormSuccess = ({ onReset }) => (
  <div className="text-center py-8">
    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
      <FiCheckCircle size={32} strokeWidth={2.5} className="text-green-700" />
    </div>
    <h3 className="text-xl font-black tracking-tight mb-2">Message Sent</h3>
    <p className="text-sm text-gray-600 mb-6">
      Thanks for reaching out. We&apos;ll get back to you within 1-2 business days.
    </p>
    <button onClick={onReset} className="text-sm font-bold uppercase tracking-wide underline hover:no-underline">
      Send another message
    </button>
  </div>
);

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' };

const Contact = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name';
    if (!form.email.trim() || !isValidEmail(form.email)) return 'Please enter a valid email';
    if (!form.subject.trim()) return 'Please enter a subject';
    if (!form.message.trim() || form.message.trim().length < 10) return 'Please enter a message (at least 10 characters)';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) { toast.error(error); return; }

    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/contact`, form);
      if (data?.success === false) throw new Error(data.message || 'Could not send your message');
      setSubmitted(true);
      setForm(INITIAL_FORM);
    } catch (err) {
      console.error('Contact form failed:', err);
      toast.error(err.response?.data?.message || err.message || 'Could not send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-6 sm:px-12 py-16 max-w-6xl mx-auto text-black">
      <header className="mb-16 text-center sm:text-left">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Get In Touch</p>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">Contact Us</h1>
        <p className="text-gray-600 max-w-3xl leading-relaxed">
          We&apos;d love to hear from you. Whether it&apos;s about your order, collaborations, support, or general enquiries - our team is here to help.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-8">Contact Information</h2>

          <div className="space-y-6">
            <InfoBlock icon={FiMail} title="Email">
              <a href="mailto:support@hoodkidapparel.com" className="hover:text-black hover:underline transition-colors duration-200">
                support@hoodkidapparel.com
              </a>
            </InfoBlock>

            <InfoBlock icon={FiPhone} title="Phone">
              <a href="tel:+27769934759" className="hover:text-black hover:underline transition-colors duration-200">
                +27 76 993 4759
              </a>
            </InfoBlock>

            <InfoBlock icon={FiClock} title="Business Hours">
              <p>Monday - Friday: 09:00 - 18:00</p>
              <p>Saturday: 10:00 - 15:00</p>
              <p>Sunday: Closed</p>
            </InfoBlock>

            <InfoBlock icon={FiBriefcase} title="Collaborations">
              <p>For partnerships, influencer work, and brand collaborations, please contact us via email.</p>
            </InfoBlock>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 sm:p-8">
          {submitted ? (
            <FormSuccess onReset={() => setSubmitted(false)} />
          ) : (
            <>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-6">Send Us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Field label="Your Name" name="name" value={form.name} onChange={handleChange} required disabled={submitting} placeholder="Jane Doe" />
                <Field label="Your Email" name="email" type="email" value={form.email} onChange={handleChange} required disabled={submitting} placeholder="jane@example.com" />
                <Field label="Subject" name="subject" value={form.subject} onChange={handleChange} required disabled={submitting} placeholder="What is this about?" />
                <Field label="Your Message" name="message" as="textarea" value={form.message} onChange={handleChange} required disabled={submitting} placeholder="Tell us what is on your mind..." />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-wide hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {submitting ? 'Sending...' : (<><FiSend size={16} strokeWidth={2.5} />Send Message</>)}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
