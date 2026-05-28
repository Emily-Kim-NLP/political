import type { Step } from '../types'

interface Props {
  step: Step
  accentColor: string
}

const STEPS = ['성향 판단', '단서 문장', '판단 이유'] as const

export default function StepIndicator({ step, accentColor }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 8 }}>
      {STEPS.map((label, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: i <= step ? accentColor : '#e5e7eb',
              color: i <= step ? '#fff' : '#9ca3af',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 14,
              transition: 'background 0.3s',
            }}>
              {i + 1}
            </div>
            <span style={{
              fontSize: 12, marginTop: 6,
              color: i <= step ? accentColor : '#9ca3af',
              fontWeight: i === step ? 700 : 400,
              transition: 'color 0.3s',
            }}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              flex: 1, height: 2, marginBottom: 20,
              background: i < step ? accentColor : '#e5e7eb',
              transition: 'background 0.3s',
            }} />
          )}
        </div>
      ))}
    </div>
  )
}
