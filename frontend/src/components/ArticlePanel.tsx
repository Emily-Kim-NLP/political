import type { Article, Step } from '../types'

interface Props {
  article: Article
  step: Step
  selectedSentence: number | null
  onSelectSentence: (id: number) => void
  accentColor: string
}

export default function ArticlePanel({
  article, step, selectedSentence, onSelectSentence, accentColor,
}: Props) {
  const canClick = step === 1

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: 20,
      background: '#fff',
      maxHeight: '72vh',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <h3 style={{
        fontSize: 13, fontWeight: 600, color: '#6b7280',
        textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8,
      }}>
        기사 원문
      </h3>

      {article.sentences.map(sentence => {
        const isSelected = selectedSentence === sentence.id
        return (
          <div
            key={sentence.id}
            onClick={() => canClick && onSelectSentence(sentence.id)}
            style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              padding: '8px 10px', borderRadius: 8,
              border: `2px solid ${isSelected ? accentColor : 'transparent'}`,
              background: isSelected
                ? `${accentColor}15`
                : canClick ? '#f9fafb' : 'transparent',
              cursor: canClick ? 'pointer' : 'default',
              transition: 'all 0.15s',
            }}
          >
            <span style={{
              minWidth: 22, height: 22, borderRadius: 4,
              background: isSelected ? accentColor : '#e5e7eb',
              color: isSelected ? '#fff' : '#6b7280',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, flexShrink: 0,
              transition: 'all 0.15s',
            }}>
              {sentence.id}
            </span>
            <span style={{ fontSize: 14, lineHeight: 1.7, color: '#1f2937' }}>
              {sentence.text}
            </span>
          </div>
        )
      })}

      {canClick && (
        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4, textAlign: 'center' }}>
          판단에 가장 큰 영향을 준 문장을 클릭하세요
        </p>
      )}
    </div>
  )
}
