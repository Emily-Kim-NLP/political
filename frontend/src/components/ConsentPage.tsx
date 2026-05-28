import { useState } from 'react'

interface Props {
  onAgree: () => void
  onDisagree: () => void
}

const CONSENT_TEXT = `본 연구에서는 연구 참여자의 이름, 생년월일 등 기본적인 인적사항을 포함한 개인정보를 수집합니다. 수집된 정보는 연구 참여자를 식별하고, 연구 결과의 통계적 분석을 위한 기초 자료로만 활용됩니다. 해당 개인정보는 연구 목적 외에는 절대 사용되지 않으며, 연구가 종료된 후 즉시 폐기됩니다. 이 동의는 자발적으로 이루어지며, 참여자는 언제든지 개인정보 제공을 거부할 권리가 있습니다. 다만, 개인정보 제공에 동의하지 않을 경우 연구 참여가 제한될 수 있습니다.

본인은 위 내용을 충분히 이해하였으며, 이에 동의합니다.`

export default function ConsentPage({ onAgree, onDisagree }: Props) {
  const [declined, setDeclined] = useState(false)

  if (declined) {
    return (
      <div style={wrapStyle}>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>😔</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>참여가 제한됩니다</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>
            동의서에 동의하지 않으셔서 실험 참여 및<br />
            쿠폰 수령이 불가합니다.
          </p>
          <button
            onClick={() => setDeclined(false)}
            style={{
              marginTop: 24, padding: '10px 24px', borderRadius: 8,
              border: '1.5px solid #e5e7eb', background: '#fff',
              color: '#374151', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            }}
          >
            돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>실험 참여 동의서</h2>
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 20 }}>
          아래 내용을 꼼꼼히 읽고 동의 여부를 선택해 주세요.
        </p>

        {/* 동의서 본문 */}
        <div style={{
          background: '#f9fafb', border: '1px solid #e5e7eb',
          borderRadius: 10, padding: '20px 20px',
          fontSize: 14, lineHeight: 2, color: '#374151',
          marginBottom: 20, whiteSpace: 'pre-line',
        }}>
          {CONSENT_TEXT}
        </div>

        {/* 자발적 참여 문구 */}
        <div style={{
          background: '#f9fafb', border: '1px solid #e5e7eb',
          borderRadius: 10, padding: '14px 16px',
          fontSize: 14, color: '#374151', marginBottom: 24, lineHeight: 1.7,
        }}>
          <strong>귀하는 자발적으로 이 실험에 참여하십니까?</strong>
        </div>

        {/* 안내 문구 */}
        <p style={{
          fontSize: 13, color: '#f59e0b',
          background: '#fffbeb', border: '1px solid #fde68a',
          borderRadius: 8, padding: '10px 14px',
          marginBottom: 24, lineHeight: 1.6,
        }}>
          🎁 <strong>동의</strong>를 하셔야만 실험 참여가 가능하며, 실험 완료 후 <strong>선물(쿠폰)</strong>을 받으실 수 있습니다.
        </p>

        {/* 버튼 */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => { setDeclined(true); onDisagree() }}
            style={{
              flex: 1, padding: '13px 0', borderRadius: 10,
              border: '1.5px solid #e5e7eb', background: '#fff',
              color: '#6b7280', cursor: 'pointer', fontWeight: 600, fontSize: 15,
              transition: 'all 0.15s',
            }}
          >
            비동의
          </button>
          <button
            onClick={onAgree}
            style={{
              flex: 2, padding: '13px 0', borderRadius: 10,
              border: 'none', background: '#374151',
              color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 15,
              transition: 'all 0.15s',
            }}
          >
            동의합니다
          </button>
        </div>
      </div>
    </div>
  )
}

const wrapStyle: React.CSSProperties = {
  minHeight: '100vh', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
  padding: '24px 16px',
}

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 16,
  padding: '40px 40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  width: '100%', maxWidth: 520,
}
