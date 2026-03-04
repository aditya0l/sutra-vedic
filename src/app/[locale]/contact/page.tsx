'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Mail, MapPin, Send, Clock, CheckCircle, Loader2 } from 'lucide-react';

export default function ContactPage() {
    const locale = useLocale();
    const isFr = locale === 'fr';

    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, locale }),
            });
            if (!res.ok) throw new Error('Failed');
            setIsSubmitted(true);
        } catch {
            setError(isFr ? 'Échec de l\'envoi. Veuillez réessayer.' : 'Failed to send. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-32 pb-20 px-4 text-center border-b border-cream-dark/30">
                <h1 className="text-4xl md:text-5xl font-serif font-normal text-forest-dark mb-6 tracking-wide">
                    {isFr ? 'Contactez-nous' : 'Contact Us'}
                </h1>
                <p className="text-lg text-charcoal-light max-w-xl mx-auto font-light leading-relaxed">
                    {isFr ? 'Une question ? Nous sommes là pour vous aider.' : "Have a question? We're here to help."}
                </p>
            </div>

            <div className="container-premium py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    {/* Contact Info */}
                    <div className="lg:col-span-5 space-y-8">
                        {[
                            { icon: MapPin, title: isFr ? 'Adresse' : 'Address', value: '5 Rue Muller\n75018 Paris, France' },
                            { icon: Mail, title: 'Email', value: 'contact@sutravedic.fr' },
                            { icon: Clock, title: isFr ? 'Horaires' : 'Hours', value: isFr ? 'Lun-Ven: 9h-18h\nSam: 10h-14h' : 'Mon-Fri: 9am-6pm\nSat: 10am-2pm' },
                        ].map(({ icon: Icon, title, value }) => (
                            <div key={title} className="flex gap-6 p-8 bg-white rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-cream-dark/20 text-left">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FEFAE0] to-[#E8D8A0]/30 flex items-center justify-center shrink-0 border border-cream-dark/10">
                                    <Icon className="w-6 h-6 text-[#C9A84C]" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-normal text-2xl text-forest-dark mb-2 tracking-wide">{title}</h3>
                                    <p className="text-[0.9375rem] text-charcoal-light whitespace-pre-line leading-relaxed font-light">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-7">
                        {isSubmitted ? (
                            <div className="bg-white rounded-3xl p-12 shadow-sm border border-cream-dark/10 text-center">
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-serif font-bold text-forest-dark mb-2">
                                    {isFr ? 'Message Envoyé !' : 'Message Sent!'}
                                </h2>
                                <p className="text-charcoal-light">
                                    {isFr ? 'Nous vous répondrons dans les plus brefs délais.' : 'We will get back to you as soon as possible.'}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-12 lg:p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-cream-dark/20 text-center">
                                <h2 className="font-serif font-normal text-4xl text-forest-dark mb-12 tracking-wide leading-tight px-4">
                                    {isFr ? 'Envoyez-nous un Message' : 'Send us a Message'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-left">
                                    <div>
                                        <label className="block text-[0.8rem] font-medium tracking-wide uppercase text-charcoal-light mb-3">{isFr ? 'Nom' : 'Name'}</label>
                                        <input name="name" value={form.name} onChange={handleChange} required className="w-full px-6 py-4 bg-[#FEFAE0]/30 border border-cream-dark/30 rounded-2xl text-[0.9375rem] focus:outline-none focus:ring-1 focus:ring-gold/50 transition-shadow" />
                                    </div>
                                    <div>
                                        <label className="block text-[0.8rem] font-medium tracking-wide uppercase text-charcoal-light mb-3">Email</label>
                                        <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-6 py-4 bg-[#FEFAE0]/30 border border-cream-dark/30 rounded-2xl text-[0.9375rem] focus:outline-none focus:ring-1 focus:ring-gold/50 transition-shadow" />
                                    </div>
                                </div>
                                <div className="mb-8 text-left">
                                    <label className="block text-[0.8rem] font-medium tracking-wide uppercase text-charcoal-light mb-3">{isFr ? 'Sujet' : 'Subject'}</label>
                                    <input name="subject" value={form.subject} onChange={handleChange} required className="w-full px-6 py-4 bg-[#FEFAE0]/30 border border-cream-dark/30 rounded-2xl text-[0.9375rem] focus:outline-none focus:ring-1 focus:ring-gold/50 transition-shadow" />
                                </div>
                                <div className="mb-12 text-left">
                                    <label className="block text-[0.8rem] font-medium tracking-wide uppercase text-charcoal-light mb-3">Message</label>
                                    <textarea name="message" rows={6} value={form.message} onChange={handleChange} required className="w-full px-6 py-5 bg-[#FEFAE0]/30 border border-cream-dark/30 rounded-2xl text-[0.9375rem] focus:outline-none focus:ring-1 focus:ring-gold/50 transition-shadow resize-none" />
                                </div>

                                {error && <p className="text-red-500 text-sm mb-6">{error}</p>}

                                <button type="submit" disabled={isSubmitting} className="px-[3.5rem] py-5 bg-[#0F2E22] hover:bg-[#1B4332] disabled:opacity-60 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center justify-center gap-4 text-[0.95rem] tracking-wide mx-auto">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 opacity-80 shrink-0" />}
                                    <span>{isFr ? 'Envoyer' : 'Send Message'}</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
