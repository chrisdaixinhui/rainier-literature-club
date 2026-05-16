import sentences from '@/data/sentences.json'

function getDailySentence() {
  const d = new Date()
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  return sentences[seed % sentences.length]
}

export default function SentenceOfDay() {
  const s = getDailySentence()
  return (
    <section
      style={{
        padding: '96px 24px',
        borderTop: '1px solid #E6E2DA',
        background: '#F2EDE4',
      }}
    >
      <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>

        {/* Label */}
        <p className="label-sm" style={{ marginBottom: '8px' }}>
          Quote of the Day
        </p>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            color: '#8FA499',
            letterSpacing: '0.08em',
            marginBottom: '52px',
          }}
        >
          每日一句
        </p>

        {/* Chinese quote */}
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(20px, 3vw, 28px)',
            color: '#1C2220',
            lineHeight: 1.95,
            letterSpacing: '0.03em',
            marginBottom: '24px',
          }}
        >
          {s.text}
        </p>

        {/* English translation */}
        {s.translation && (
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '15px',
              color: '#68736E',
              lineHeight: 1.75,
              marginBottom: '40px',
            }}
          >
            {s.translation}
          </p>
        )}

        {/* Source — right-aligned */}
        <div style={{ textAlign: 'right' }}>
          <p
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: '11px',
              color: '#8FA499',
              letterSpacing: '0.1em',
            }}
          >
            —— {s.source}
          </p>
        </div>

      </div>
    </section>
  )
}
