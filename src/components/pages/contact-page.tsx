'use client';

import Image from 'next/image';
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { SubscriberService } from '@/services/subscriber.service';
import type { Subscriber } from '@/models/subscriber';

// ─── Icon map for contact detail items ───────────────────────────────────────
const CONTACT_ICONS: Record<string, React.ReactNode> = {
  address: <MapPin className='h-5 w-5' />,
  phone: <Phone className='h-5 w-5' />,
  email: <Mail className='h-5 w-5' />,
  clock: <Clock className='h-5 w-5' />,
};

// ─── WhatsApp number selector modal ──────────────────────────────────────────
function WhatsAppModal({
  open,
  onClose,
  agents,
}: {
  open: boolean;
  onClose: () => void;
  agents: { title: string; href: string }[];
}) {
  if (!open) return null;
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-2xl shadow-xl w-full max-w-sm p-6'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center gap-2 mb-1'>
          <MessageCircle className='h-5 w-5 text-green-600' />
          <h3 className='font-bold text-gray-900'>Choose a contact</h3>
        </div>
        <p className='text-sm text-gray-500 mb-5'>
          Select which agent you would like to chat with on WhatsApp.
        </p>
        <div className='space-y-3'>
          {agents.map((agent) => (
            <a
              key={agent.href}
              href={agent.href}
              target='_blank'
              rel='noreferrer'
              className='flex items-center gap-3 w-full rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 px-4 py-3 transition-colors'
              onClick={onClose}
            >
              <span className='flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-green-600 text-white'>
                <MessageCircle className='h-4 w-4' />
              </span>
              <span className='font-semibold text-sm text-gray-800'>{agent.title}</span>
            </a>
          ))}
        </div>
        <button
          onClick={onClose}
          className='mt-5 w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors'
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Main ContactPage ─────────────────────────────────────────────────────────
export default function ContactPage() {
  const { siteContent } = useAppSelector((s) => s.content.content);
  const [waOpen, setWaOpen] = useState(false);
  const [formState, setFormState] = useState({
    fullname: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const hero = siteContent?.contact?.section1 ?? {};
  const details = siteContent?.contact?.section2 ?? {};
  const waAgents = (details.buttons ?? []).map((b) => ({ title: b.title, href: b.href }));

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    // Normalise phone to E.164 format: strip spaces, ensure + prefix,
    // remove leading 0 after country code (e.g. +234 0803... → +234803...)
    let phone: string | undefined;
    if (formState.phone.trim()) {
      // Remove all spaces
      let raw = formState.phone.replace(/\s+/g, '');
      // If starts with +234 followed by 0, drop the 0
      raw = raw.replace(/^(\+\d{1,4})0(\d+)$/, '$1$2');
      // If starts with 0, assume Nigeria and prefix +234
      if (raw.startsWith('0')) raw = '+234' + raw.slice(1);
      // If no +, add it
      if (!raw.startsWith('+')) raw = '+' + raw;
      phone = raw;
    }

    try {
      // Send all required fields explicitly including createdAt so the server
      // doesn't need to initialise any fields itself — which is what causes
      // it to write metadata: undefined to Firestore
      const payload = {
        name: formState.fullname,
        email: formState.email,
        type: 'enquiry' as const,
        createdAt: new Date().toISOString(),
        metadata: { message: formState.message || '' },
        ...(phone ? { phone } : {}),
      };

      await SubscriberService.createSubscribe(payload);
      setSubmitted(true);
      setFormState({ fullname: '', email: '', phone: '', message: '' });
    } catch (err: unknown) {
      const details = (err as Error & { details?: unknown[] })?.details;
      if (details) {
        console.error('Validation details:', JSON.stringify(details, null, 2));
      }
      console.error('Failed to send message:', err);
      setSubmitError(
        'Something went wrong. Please try again or contact us directly on WhatsApp.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className='overflow-x-hidden'>
      {/* ── HERO BANNER ──────────────────────────────────────────────────── */}
      <section className='relative h-64 sm:h-72 flex items-center justify-center overflow-hidden bg-primary pt-16'>
        <div className='absolute inset-0'>
          <Image
            src='/images/Ridmax-our-services/slide.png'
            alt='Contact Us'
            fill
            priority
            sizes='100vw'
            className='object-cover object-center'
          />
          <div className='absolute inset-0 bg-primary/70' />
        </div>
        <div className='relative text-center px-6'>
          <h1 className='text-3xl sm:text-5xl font-bold text-white tracking-tight'>
            {hero.title ?? 'Contact Us'}
          </h1>
          {hero.subtitle ? (
            <p className='mt-3 text-white/80 text-sm sm:text-base max-w-xl mx-auto'>
              {hero.subtitle}
            </p>
          ) : null}
        </div>
      </section>

      {/* ── CONTACT BODY ─────────────────────────────────────────────────── */}
      <section className='py-16 bg-white'>
        <div className='mx-auto container px-6'>
          <div className='grid lg:grid-cols-2 gap-12'>

            {/* ── LEFT: Contact details ─────────────────────────────────── */}
            <div>
              <h2 className='text-xl font-bold text-primary mb-1'>
                {details.title ?? 'Contact Information'}
              </h2>
              <p className='text-sm text-gray-500 mb-8'>
                {details.body ?? ''}
              </p>

              {/* Detail items */}
              <div className='space-y-6'>
                {(details.items ?? []).map((item) => {
                  const icon = item.subtitle ? CONTACT_ICONS[item.subtitle] ?? null : null;
                  return (
                    <div key={item.title} className='flex gap-4'>
                      <div className='flex-shrink-0 flex items-center justify-center h-11 w-11 rounded-xl bg-primary/10 text-primary'>
                        {icon}
                      </div>
                      <div>
                        <h4 className='font-bold text-gray-900 text-sm mb-1'>{item.title}</h4>
                        {item.body.split('\n').map((line, i) => (
                          <p key={i} className='text-sm text-gray-600 leading-relaxed'>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* WhatsApp quick chat */}
              {waAgents.length > 0 ? (
                <div className='mt-8 rounded-2xl bg-green-50 border border-green-200 p-5'>
                  <div className='flex items-center gap-2 mb-1'>
                    <MessageCircle className='h-5 w-5 text-green-600' />
                    <h4 className='font-bold text-gray-900 text-sm'>Quick Chat on WhatsApp</h4>
                  </div>
                  <p className='text-xs text-gray-500 mb-4'>
                    Get instant support through WhatsApp for quick inquiries and quotes.
                  </p>
                  <Button
                    type='button'
                    onClick={() => setWaOpen(true)}
                    className='w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold'
                  >
                    Start WhatsApp Chat
                  </Button>
                </div>
              ) : null}
            </div>

            {/* ── RIGHT: Contact form ───────────────────────────────────── */}
            <div>
              {submitted ? (
                <div className='flex flex-col items-center justify-center h-full py-16 text-center'>
                  <div className='flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4'>
                    <Mail className='h-7 w-7' />
                  </div>
                  <h3 className='text-xl font-bold text-gray-900 mb-2'>Message sent!</h3>
                  <p className='text-sm text-gray-500 max-w-xs'>
                    Thank you for reaching out. Our team will get back to you shortly.
                  </p>
                  <Button
                    className='mt-6 rounded-full'
                    variant='outline'
                    onClick={() => setSubmitted(false)}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className='space-y-5'>
                  {/* Full name */}
                  <div>
                    <label className='block text-xs font-semibold text-gray-700 mb-1.5'>
                      Fullname
                    </label>
                    <input
                      type='text'
                      name='fullname'
                      required
                      value={formState.fullname}
                      onChange={handleChange}
                      className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition'
                      placeholder=''
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className='block text-xs font-semibold text-gray-700 mb-1.5'>
                      Email
                    </label>
                    <input
                      type='email'
                      name='email'
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition'
                      placeholder=''
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className='block text-xs font-semibold text-gray-700 mb-1.5'>
                      Phone number
                    </label>
                    <input
                      type='tel'
                      name='phone'
                      value={formState.phone}
                      onChange={handleChange}
                      className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition'
                      placeholder='e.g. 08036630578 or +2348036630578'
                    />
                    <p className='mt-1 text-xs text-gray-400'>
                      Enter Nigerian number (e.g. 0803...) or with country code (+234...).
                    </p>
                  </div>

                  {/* Message */}
                  <div>
                    <label className='block text-xs font-semibold text-gray-700 mb-1.5'>
                      Message
                    </label>
                    <textarea
                      name='message'
                      required
                      rows={6}
                      value={formState.message}
                      onChange={handleChange}
                      placeholder='Type your message…'
                      className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none'
                    />
                  </div>

                  <Button
                    type='submit'
                    disabled={submitting}
                    className='w-full rounded-xl bg-primary text-white hover:bg-primary/90 font-semibold py-3 text-sm'
                  >
                    {submitting ? 'Sending…' : 'Send Message'}
                  </Button>

                  {submitError ? (
                    <p className='text-xs text-red-600 text-center mt-2'>{submitError}</p>
                  ) : null}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp agent selector modal */}
      <WhatsAppModal
        open={waOpen}
        onClose={() => setWaOpen(false)}
        agents={waAgents}
      />
    </div>
  );
}
