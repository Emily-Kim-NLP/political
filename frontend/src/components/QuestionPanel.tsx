import type { Step, Orientation } from '../types'
import { BI_OPTIONS } from '../types'

interface Props {
  step: Step
  category: string
  q1: Orientation
  setQ1: (v: Orientation) => void
  q2: number | null
  q3: string | null
  setQ3: (v: string) => void
  q3Other: string
  setQ3Other: (v: string) => void
  accentColor: string
  onPrev: () => void
  onNext: () => void
  canNext: boolean
  saving: boolean
  saveError: string | null
  isLast: boolean
}

export default function QuestionPanel({
  step, category, q1, setQ1, q2, q3, setQ3, q3Other, setQ3Other,
  accentColor, onPrev, onNext, canNext, saving, saveError, isLast,
}: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '72vh' }}>

      {/* Question card */}
      <div style={{
        border: '1px solid #e5e7eb', borderRadius: 12,
        padding: 24, background: '#fff', flex: 1, overflowY: 'auto',
      }}>

        {/* 카테고리 */}
        {category && (
          <div style={{
            display: 'inline-block',
            fontSize: 12, fontWeight: 700, color: '#374151',
            background: '#e5e7eb', border: '1px solid #9ca3af',
            borderRadius: 6, padding: '4px 10px', marginBottom: 14,
          }}>
            {category}
          </div>
        )}

        {/* Q1 */}
        {step === 0 && (
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Q1</p>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, lineHeight: 1.5 }}>
              이 기사문은 어느 성향에 더 가깝다고 느껴집니까?
            </h3>
            <div style={{ display: 'flex', gap: 14 }}>
              {([
                { val: 'conservative' as const, label: '보수', color: '#b91c1c' },
                { val: 'progressive'  as const, label: '진보', color: '#1d4ed8' },
              ]).map(({ val, label, color }) => (
                <button
                  key={val}
                  onClick={() => setQ1(val)}
                  style={{
                    flex: 1, padding: '18px 0', borderRadius: 10,
                    border: `2px solid ${q1 === val ? color : '#e5e7eb'}`,
                    background: q1 === val ? color : '#fff',
                    color: q1 === val ? '#fff' : '#374151',
                    fontWeight: 700, fontSize: 17, cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q2 */}
        {step === 1 && (
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Q2</p>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, lineHeight: 1.5 }}>
              판단에 가장 큰 영향을 준 문장을 클릭하세요.
            </h3>
            <div style={{
              padding: 16, borderRadius: 10,
              background: '#f9fafb', border: '1px solid #e5e7eb',
            }}>
              {q2 != null ? (
                <p style={{ fontSize: 14, color: accentColor, fontWeight: 600 }}>
                  ✓ 문장 {q2}번 선택됨
                </p>
              ) : (
                <p style={{ fontSize: 14, color: '#9ca3af' }}>
                  왼쪽 기사에서 문장을 클릭하세요.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Q3 */}
        {step === 2 && (
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Q3</p>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, lineHeight: 1.5 }}>
              그 문장을 선택한 이유는 무엇입니까?
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {BI_OPTIONS.map(opt => {
                const isChecked = q3 === opt.code
                return (
                  <label
                    key={opt.code}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      cursor: 'pointer', padding: '10px 12px', borderRadius: 8,
                      border: `1.5px solid ${isChecked ? accentColor : '#e5e7eb'}`,
                      background: isChecked ? `${accentColor}10` : '#fafafa',
                      transition: 'all 0.15s',
                    }}
                  >
                    <input
                      type="radio" name="q3" value={opt.code}
                      checked={isChecked}
                      onChange={() => setQ3(opt.code)}
                      style={{ marginTop: 2, flexShrink: 0, accentColor }}
                    />
                    <span style={{ fontSize: 13, lineHeight: 1.6, color: '#374151' }}>
                      {opt.code !== '기타' && (
                        <strong style={{ color: accentColor, marginRight: 4 }}>{opt.code}:</strong>
                      )}
                      {opt.label}
                    </span>
                  </label>
                )
              })}
              {q3 === '기타' && (
                <textarea
                  value={q3Other}
                  onChange={e => setQ3Other(e.target.value)}
                  placeholder="이유를 직접 입력해 주세요..."
                  style={{
                    width: '100%', minHeight: 80, padding: '10px 12px',
                    border: `1.5px solid ${accentColor}`, borderRadius: 8,
                    fontSize: 13, resize: 'vertical', outline: 'none', lineHeight: 1.6,
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {saveError && (
        <div style={{
          padding: '10px 14px', borderRadius: 8,
          background: '#fef2f2', border: '1px solid #fca5a5',
          fontSize: 13, color: '#b91c1c', textAlign: 'center',
        }}>
          {saveError}
        </div>
      )}

      {/* Nav buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onPrev}
          disabled={step === 0}
          style={{
            flex: 1, padding: '13px 0', borderRadius: 10,
            border: '1.5px solid #e5e7eb', background: '#fff',
            color: step === 0 ? '#d1d5db' : '#374151',
            cursor: step === 0 ? 'not-allowed' : 'pointer',
            fontWeight: 600, fontSize: 14, transition: 'all 0.15s',
          }}
        >
          이전
        </button>
        <button
          onClick={onNext}
          disabled={!canNext || saving}
          style={{
            flex: 2, padding: '13px 0', borderRadius: 10, border: 'none',
            background: canNext && !saving ? accentColor : '#e5e7eb',
            color: canNext && !saving ? '#fff' : '#9ca3af',
            cursor: canNext && !saving ? 'pointer' : 'not-allowed',
            fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
          }}
        >
          {saving ? '저장 중...' : isLast ? '제출 및 다음 기사' : '다음'}
        </button>
      </div>
    </div>
  )
}
