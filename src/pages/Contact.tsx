import { useState } from 'react'
import { Send, Twitter, Mail, MessageSquare, CheckCircle } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useInView } from '../hooks/useInView'

import { TWITTER_URL, CONTACT_EMAIL } from '../data/config'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

const EMPTY_FORM: FormData = { name: '', email: '', subject: '', message: '' }

function ContactCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  const content = (
    <div className="card flex items-center gap-4 group cursor-pointer">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-kanade-blush/20 to-kanade-lavender/20
                      flex items-center justify-center flex-shrink-0 text-kanade-lavender
                      group-hover:from-kanade-blush/40 group-hover:to-kanade-lavender/40 transition-all duration-300">
        {icon}
      </div>
      <div>
        <p className="text-kanade-sand/40 text-xs tracking-widest uppercase">{label}</p>
        <p className="text-kanade-cream text-sm mt-0.5 group-hover:text-kanade-blush transition-colors">{value}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }
  return content
}

export default function Contact() {
  const [form,   setForm]   = useState<FormData>(EMPTY_FORM)
  const [status, setStatus] = useState<FormState>('idle')
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const { t } = useLang()
  const { ref: headerRef, inView: headerInView } = useInView()
  const { ref: leftRef,   inView: leftInView }   = useInView({ threshold: 0.1 })
  const { ref: rightRef,  inView: rightInView }  = useInView({ threshold: 0.1 })

  const validate = (): boolean => {
    const next: Partial<FormData> = {}
    if (!form.name.trim())                       next.name    = t('お名前は必須です',         'Name is required')
    if (!form.email.trim())                      next.email   = t('メールアドレスは必須です',  'Email is required')
    else if (!/\S+@\S+\.\S+/.test(form.email))  next.email   = t('有効なメールアドレスを入力してください', 'Enter a valid email')
    if (!form.subject.trim())                    next.subject = t('件名は必須です',           'Subject is required')
    if (!form.message.trim())                    next.message = t('メッセージは必須です',      'Message is required')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('submitting')
    try {
      // TODO: replace with real endpoint, e.g. Formspree or EmailJS
      // const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      //   body: JSON.stringify(form),
      // })
      // if (!res.ok) throw new Error('Send failed')
      throw new Error('No endpoint configured')
    } catch {
      setStatus('error')
    }
  }

  const fieldClass = (field: keyof FormData) =>
    `w-full glass rounded-xl px-4 py-3 text-sm text-kanade-cream placeholder-kanade-sand/30
     border transition-all duration-200 outline-none
     focus:border-kanade-lavender/60 focus:shadow-lg focus:shadow-kanade-lavender/10
     ${errors[field]
       ? 'border-kanade-rose/60 bg-kanade-rose/5'
       : 'border-white/10 hover:border-white/20'}`

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-12 px-6 text-center">
        <div ref={headerRef} className={`reveal-up${headerInView ? ' is-visible' : ''}`}>
          <p className="text-kanade-lavender/60 tracking-[0.4em] text-xs uppercase mb-4 font-sans">
            {t('お問い合わせ', 'Get in Touch')}
          </p>
          <h1 className="section-title">{t('コンタクト', 'Contact')}</h1>
          <div className="section-divider" />
          <p className="text-kanade-sand/50 max-w-xl mx-auto text-sm leading-relaxed">
            {t(
              'コラボのご相談、ご質問、または気軽なご挨拶など、お気軽にご連絡ください。',
              'Want to collaborate, ask a question, or just say hello? We\'d love to hear from you.'
            )}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-[1fr_1.6fr] gap-10">
        {/* Left — contact info */}
        <div
          ref={leftRef}
          className={`flex flex-col gap-4 reveal-left${leftInView ? ' is-visible' : ''}`}
        >
          <h2 className="font-serif text-xl text-kanade-cream/80 font-light mb-2">
            {t('連絡先', 'Reach Us')}
          </h2>

          <ContactCard
            icon={<Twitter size={18} />}
            label="X / Twitter"
            value="@FF14_Kanade2020"
            href={TWITTER_URL}
          />
          <ContactCard
            icon={<Mail size={18} />}
            label={t('メール', 'Email')}
            value={CONTACT_EMAIL}
            href={`mailto:${CONTACT_EMAIL}`}
          />
          <ContactCard
            icon={<MessageSquare size={18} />}
            label={t('ゲーム内', 'In-game')}
            value="Tonberry · KANADE FC"
          />

          <div className="card mt-4">
            <p className="text-kanade-sand/50 text-xs leading-relaxed">
              {t(
                '通常2〜3日以内にご返信いたします。急ぎのイベントに関するお問い合わせは、X（旧Twitter）からご連絡いただくと最も早く対応できます。',
                'We typically respond within 2–3 days. For urgent event inquiries, reaching us on X/Twitter is the fastest way to get a reply.'
              )}
            </p>
          </div>
        </div>

        {/* Right — form */}
        <div
          ref={rightRef}
          className={`card reveal-right${rightInView ? ' is-visible' : ''}`}
        >
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-kanade-blush/30 to-kanade-lavender/30
                              flex items-center justify-center">
                <CheckCircle size={28} className="text-kanade-blush" />
              </div>
              <h3 className="font-serif text-xl text-kanade-cream font-light">
                {t('送信完了！', 'Message Sent!')}
              </h3>
              <p className="text-kanade-sand/50 text-sm max-w-xs">
                {t(
                  'お問い合わせいただきありがとうございます。できる限り早くご返信いたします。',
                  'Thank you for reaching out. We\'ll get back to you as soon as possible.'
                )}
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="btn-ghost mt-2"
              >
                {t('もう一件送る', 'Send Another')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <h2 className="font-serif text-xl text-kanade-cream/80 font-light mb-1">
                {t('メッセージを送る', 'Send a Message')}
              </h2>

              {/* Name */}
              <div>
                <label className="block text-xs tracking-widest uppercase text-kanade-sand/50 mb-1.5">
                  {t('お名前', 'Name')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t('お名前', 'Your name')}
                  className={fieldClass('name')}
                  autoComplete="name"
                />
                {errors.name && <p className="text-kanade-rose/80 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs tracking-widest uppercase text-kanade-sand/50 mb-1.5">
                  {t('メールアドレス', 'Email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={fieldClass('email')}
                  autoComplete="email"
                />
                {errors.email && <p className="text-kanade-rose/80 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs tracking-widest uppercase text-kanade-sand/50 mb-1.5">
                  {t('件名', 'Subject')}
                </label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className={`${fieldClass('subject')} appearance-none`}
                >
                  <option value="" disabled>{t('トピックを選択…', 'Select a topic…')}</option>
                  <option value="Event Inquiry">{t('イベントのお問い合わせ', 'Event Inquiry')}</option>
                  <option value="Collaboration">{t('コラボレーション',       'Collaboration')}</option>
                  <option value="Fan Message">{t('ファンメッセージ',         'Fan Message')}</option>
                  <option value="General Question">{t('一般的なご質問',       'General Question')}</option>
                  <option value="Other">{t('その他',                         'Other')}</option>
                </select>
                {errors.subject && <p className="text-kanade-rose/80 text-xs mt-1">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs tracking-widest uppercase text-kanade-sand/50 mb-1.5">
                  {t('メッセージ', 'Message')}
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder={t('メッセージをここに入力してください…', 'Write your message here…')}
                  rows={5}
                  className={`${fieldClass('message')} resize-none`}
                />
                {errors.message && <p className="text-kanade-rose/80 text-xs mt-1">{errors.message}</p>}
              </div>

              {status === 'error' && (
                <p className="text-kanade-rose/80 text-sm text-center">
                  {t('送信に失敗しました。後ほど再試行してください。', 'Failed to send. Please try again later.')}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary self-end inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('送信中…', 'Sending…')}
                  </>
                ) : (
                  <>
                    {t('送信する', 'Send Message')}
                    <Send size={14} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
