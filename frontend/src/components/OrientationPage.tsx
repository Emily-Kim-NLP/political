interface Props {
  onNext: () => void
}

const SOCIAL = [
  {
    category: '총기규제',
    progressive: '총기 규제 강화 지지, 보유권에 소극적',
    conservative: '총기 보유권 적극 옹호, 규제 반대',
  },
  {
    category: 'LGBTQ',
    progressive: '동성결혼·트랜스젠더 등 권리 확대 지지',
    conservative: '전통적 가치 중시, 권리 확대에 신중·반대',
  },
  {
    category: '이민정책',
    progressive: '포용적 이민, 미등록 이민자 추방 반대 (단속은 연방 권한)',
    conservative: '국경 통제·불법 이민자 추방, 주 차원 단속 강화',
  },
  {
    category: '낙태법',
    progressive: '임신중지 권리 옹호',
    conservative: '임신중지 반대·제한',
  },
]

const ECONOMIC = [
  {
    category: '금리',
    progressive: '고용·성장 중시, 완화적 통화기조에 상대적 우호',
    conservative: '물가안정·건전통화 우선, 연준의 \'물가 본연 임무\' 집중 요구',
  },
  {
    category: '실업',
    progressive: '정부 개입(일자리 창출·재정지출·실업 안전망 확대)',
    conservative: '시장 해법(감세·규제완화·노동 유연성)',
  },
  {
    category: '물가',
    progressive: '기업의 과도한 가격인상 책임론, 반독점·소비자 보호',
    conservative: '정부의 과잉 재정지출·통화완화가 원인이라는 책임론, 지출 삭감',
  },
  {
    category: '환경',
    progressive: '적극적 기후 대응·환경 규제 강화',
    conservative: '규제 최소화, 산업·경제성 우선',
  },
  {
    category: '주택',
    progressive: '연방 투자 확대(부담가능주택 공급·임대 지원·공정주거(차별 시정))',
    conservative: '연방 역할 축소·지방 자율, 규제·용도지구 완화·재산권',
  },
  {
    category: '에너지',
    progressive: '재생에너지(태양광·풍력) 확대, 화석연료 의존 축소',
    conservative: '화석연료(석유·가스) 생산 확대·에너지 독립, 시추 장려',
  },
  {
    category: '관세',
    progressive: '광범위 관세에 비판적, 자유무역에 상대적 우호로 이동',
    conservative: '보호무역·관세 지지, 전략산업·국익 강조',
  },
]

export default function OrientationPage({ onNext }: Props) {
  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>
            실험 전 참고 사항
          </h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>
            아래는 미국 정치에서 <strong>진보(민주당)</strong>와 <strong>보수(공화당)</strong>가
            각 주제에 대해 취하는 일반적인 입장입니다.<br />
            기사를 읽을 때 참고하세요.
          </p>
        </div>

        {/* 사회 분야 */}
        <SectionLabel label="사회 분야" />
        <Table rows={SOCIAL} />

        <div style={{ height: 1, background: '#f3f4f6', margin: '20px 0' }} />

        {/* 경제 분야 */}
        <SectionLabel label="경제 분야" />
        <Table rows={ECONOMIC} />

        <button
          onClick={onNext}
          style={{
            width: '100%', marginTop: 28, padding: '14px 0',
            borderRadius: 10, border: 'none',
            background: '#374151', color: '#fff',
            fontWeight: 700, fontSize: 16, cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          실험 시작하기 →
        </button>
      </div>
    </div>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
    }}>
      <div style={{ width: 4, height: 16, borderRadius: 2, background: '#374151', flexShrink: 0 }} />
      <span style={{ fontSize: 14, fontWeight: 700, color: '#1f2937' }}>{label}</span>
    </div>
  )
}

function Table({ rows }: { rows: typeof SOCIAL }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 4 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={thStyle('#f9fafb', '#374151', '80px')}>카테고리</th>
            <th style={thStyle('#dbeafe', '#1d4ed8', undefined)}>진보 (민주당) 입장</th>
            <th style={thStyle('#fee2e2', '#b91c1c', undefined)}>보수 (공화당) 입장</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.category} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
              <td style={{ ...tdStyle, fontWeight: 700, color: '#374151', whiteSpace: 'nowrap' }}>
                {r.category}
              </td>
              <td style={{ ...tdStyle, color: '#1e40af' }}>{r.progressive}</td>
              <td style={{ ...tdStyle, color: '#991b1b' }}>{r.conservative}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function thStyle(bg: string, color: string, width?: string): React.CSSProperties {
  return {
    background: bg, color, padding: '9px 12px',
    textAlign: 'left', fontWeight: 700,
    borderBottom: '2px solid #e5e7eb',
    width,
  }
}

const tdStyle: React.CSSProperties = {
  padding: '9px 12px',
  borderBottom: '1px solid #f3f4f6',
  lineHeight: 1.55,
  verticalAlign: 'top',
}

const wrapStyle: React.CSSProperties = {
  minHeight: '100vh', display: 'flex',
  alignItems: 'flex-start', justifyContent: 'center',
  padding: '24px 16px', background: '#f3f4f6',
}

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 16,
  padding: '36px 36px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  width: '100%', maxWidth: 780,
}
