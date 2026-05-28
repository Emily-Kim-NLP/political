import { useState } from 'react'
import type { LikertAnswers } from '../types'

interface Props {
  onSubmit: (answers: LikertAnswers) => void
  saving: boolean
}

const SOCIAL_QUESTIONS = [
  { id: 'soc_1', text: '사형제도는 유지하여야 한다.' },
  { id: 'soc_2', text: '낙태는 금지되어야 한다.' },
  { id: 'soc_3', text: '소수자나 약자를 위한 사회적 지원이 더욱 강화되어야 한다.' },
  { id: 'soc_4', text: '사회질서를 위해서는 표현의 자유를 제한할 수 있다.' },
  { id: 'soc_5', text: '다양한 성적 지향과 정체성은 사회적 금기나 차별의 대상이 되어서는 안 된다.' },
  { id: 'soc_6', text: '기후위기 극복을 위해 지금보다 강한 규제를 시행하여야 한다.' },
]

const ECONOMIC_QUESTIONS = [
  { id: 'eco_1', text: '경제 발전을 위해서는 성장보다 분배가 먼저다.' },
  { id: 'eco_2', text: '고소득자들이 현재보다 세금을 더 많이 내게 해야 한다.' },
  { id: 'eco_3', text: '복지는 필요한 사람에게만 선별적으로 제공되어야 한다.' },
  { id: 'eco_4', text: '국가가 최소생활비를 보장하는 제도는 더 강화되어야 한다.' },
  { id: 'eco_5', text: '빈곤은 개인의 불성실에 의한 결과일 때가 더 많다.' },
  { id: 'eco_6', text: '경제적 불평등 해결이 경제성장보다 더 중요하다.' },
]

const ALL_QUESTIONS = [...SOCIAL_QUESTIONS, ...ECONOMIC_QUESTIONS]
const SCALE_LABELS  = ['매우\n아니다', '아니다', '보통\n이다', '그렇다', '매우\n그렇다']

export default function LikertPage({ onSubmit, saving }: Props) {
  const [answers, setAnswers] = useState<LikertAnswers>({})

  const answered  = Object.keys(answers).length
  const total     = ALL_QUESTIONS.length
  const canSubmit = answered === total

  function setAnswer(id: string, val: number) {
    setAnswers(prev => ({ ...prev, [id]: val }))
  }

  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>

        {/* 헤더 */}
        <div style={{ marginBottom: 8 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>추가 설문</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>
            각 문항에 대해 본인의 생각과 가장 가까운 숫자를 선택해 주세요.
          </p>
        </div>

        {/* 척도 범례 */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '10px 4px', marginBottom: 20,
          background: '#f9fafb', borderRadius: 8,
          border: '1px solid #e5e7eb',
        }}>
          {SCALE_LABELS.map((label, i) => (
            <div key={i} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                fontSize: 13, fontWeight: 700, color: '#374151',
                marginBottom: 2,
              }}>{i + 1}</div>
              <div style={{ fontSize: 10, color: '#6b7280', whiteSpace: 'pre-line', lineHeight: 1.3 }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* 진행 바 */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>
            <span>응답 현황</span>
            <span>{answered} / {total}</span>
          </div>
          <div style={{ height: 4, background: '#e5e7eb', borderRadius: 4 }}>
            <div style={{
              height: '100%', borderRadius: 4, background: '#374151',
              width: `${(answered / total) * 100}%`, transition: 'width 0.3s',
            }} />
          </div>
        </div>

        {/* 사회 분야 */}
        <SectionTitle label="사회 분야" color="#7c3aed" />
        {SOCIAL_QUESTIONS.map((q, i) => (
          <QuestionRow
            key={q.id}
            num={i + 1}
            text={q.text}
            value={answers[q.id] ?? null}
            onChange={v => setAnswer(q.id, v)}
          />
        ))}

        <div style={{ height: 1, background: '#f3f4f6', margin: '24px 0' }} />

        {/* 경제 분야 */}
        <SectionTitle label="경제 분야" color="#0369a1" />
        {ECONOMIC_QUESTIONS.map((q, i) => (
          <QuestionRow
            key={q.id}
            num={SOCIAL_QUESTIONS.length + i + 1}
            text={q.text}
            value={answers[q.id] ?? null}
            onChange={v => setAnswer(q.id, v)}
          />
        ))}

        {/* 제출 */}
        <button
          onClick={() => canSubmit && !saving && onSubmit(answers)}
          disabled={!canSubmit || saving}
          style={{
            width: '100%', padding: '14px 0', borderRadius: 10, border: 'none',
            background: canSubmit && !saving ? '#374151' : '#e5e7eb',
            color: canSubmit && !saving ? '#fff' : '#9ca3af',
            fontWeight: 700, fontSize: 16,
            cursor: canSubmit && !saving ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          {saving ? '저장 중...' : canSubmit ? '설문 제출하기' : `${total - answered}개 문항 남았습니다`}
        </button>
      </div>
    </div>
  )
}

function SectionTitle({ label, color }: { label: string; color: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
    }}>
      <div style={{
        width: 4, height: 18, borderRadius: 2, background: color, flexShrink: 0,
      }} />
      <span style={{ fontSize: 15, fontWeight: 700, color: '#1f2937' }}>{label}</span>
    </div>
  )
}

function QuestionRow({
  num, text, value, onChange,
}: {
  num: number
  text: string
  value: number | null
  onChange: (v: number) => void
}) {
  return (
    <div style={{
      marginBottom: 20, padding: '16px', borderRadius: 10,
      border: `1.5px solid ${value !== null ? '#bfdbfe' : '#e5e7eb'}`,
      background: value !== null ? '#f0f7ff' : '#fafafa',
      transition: 'all 0.15s',
    }}>
      <p style={{ fontSize: 14, color: '#1f2937', lineHeight: 1.6, marginBottom: 12 }}>
        <span style={{ fontWeight: 700, color: '#6b7280', marginRight: 6 }}>Q{num}.</span>
        {text}
      </p>
      <div style={{ display: 'flex', gap: 6 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 7, fontSize: 14,
              fontWeight: 700,
              border: `2px solid ${value === n ? '#374151' : '#e5e7eb'}`,
              background: value === n ? '#374151' : '#fff',
              color: value === n ? '#fff' : '#6b7280',
              cursor: 'pointer', transition: 'all 0.12s',
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

const wrapStyle: React.CSSProperties = {
  minHeight: '100vh', display: 'flex',
  alignItems: 'flex-start', justifyContent: 'center',
  padding: '24px 16px', background: '#f3f4f6',
}

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 16,
  padding: '40px 40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  width: '100%', maxWidth: 560,
}
