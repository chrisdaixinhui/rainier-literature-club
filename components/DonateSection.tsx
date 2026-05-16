export default function DonateSection({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <section className="py-12 px-6 border-t border-mist/20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-ink/60 mb-3" style={{ fontFamily: 'var(--font-sans)' }}>
            支持我们继续做这件事 · Support what we do
          </p>
          <a
            href="/support#donate"
            className="inline-block text-sm font-medium text-moss hover:text-moss-dark transition-colors border-b border-moss/40"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            捐赠 Donate →
          </a>
        </div>
      </section>
    )
  }

  return (
    <section id="donate" className="py-20 px-6 bg-note">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs tracking-[0.2em] uppercase text-mist mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
          Donate · 捐赠
        </p>
        <h2 className="text-2xl font-bold text-ink mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
          支持我们继续做这件事
        </h2>
        <p className="text-sm text-ink/60 italic mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Support what we do
        </p>
        <div className="mt-8 p-8 bg-white/60 rounded-xl border border-mist/20">
          <p className="text-sm text-mist" style={{ fontFamily: 'var(--font-sans)' }}>
            捐赠详情即将上线 · Donation details coming soon
          </p>
        </div>
      </div>
    </section>
  )
}
