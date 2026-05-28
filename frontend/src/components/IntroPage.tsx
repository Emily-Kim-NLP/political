interface Props {
  onNext: () => void
}

const STEPS = [
  { icon: '📰', text: '뉴스 기사 12개를 순서대로 읽습니다.' },
  { icon: '🧭', text: '각 기사의 정치 성향(보수/진보)을 판단합니다.' },
  { icon: '🔍', text: '판단에 영향을 준 문장과 이유를 선택합니다.' },
  { icon: '✅', text: '12개 기사 완료 후 실험이 종료됩니다.' },
]

export default function IntroPage({ onNext }: Props) {
  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>

        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-block',
            background: '#374151', color: '#fff',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
            padding: '4px 12px', borderRadius: 20, marginBottom: 16,
          }}>
            연구 실험 참여 안내
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.3, marginBottom: 10 }}>
            정치기사문 판별 실험
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.7 }}>
            뉴스 기사를 읽고 보수/진보 성향을 판단하는<br />
            미디어 인식 연구 실험입니다.
          </p>
        </div>

        {/* 구분선 */}
        <div style={{ height: 1, background: '#f3f4f6', marginBottom: 28 }} />

        {/* 실험 안내 */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 14 }}>
            실험 진행 방식
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: '#f9fafb', borderRadius: 10, padding: '12px 16px',
              }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{s.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 소요 시간 */}
        <div style={{
          background: '#f9fafb', border: '1px solid #e5e7eb',
          borderRadius: 10, padding: '12px 16px',
          fontSize: 14, color: '#374151', marginBottom: 28,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>⏱️</span>
          <span>예상 소요 시간: <strong>약 15~20분</strong></span>
        </div>

        {/* 시작 버튼 */}
        <button
          onClick={onNext}
          style={{
            width: '100%', padding: '15px 0', borderRadius: 10, border: 'none',
            background: '#374151', color: '#fff',
            fontWeight: 700, fontSize: 16, cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          실험 참여 동의서 확인하기 →
        </button>

        <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 14 }}>
          동의서 확인 후 기본 정보를 입력하고 실험을 시작합니다.
        </p>
      </div>
    </div>
  )
}

const wrapStyle: React.CSSProperties = {
  minHeight: '100vh', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
  padding: '24px 16px', background: '#f3f4f6',
}

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 16,
  padding: '40px 40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  width: '100%', maxWidth: 480,
}
