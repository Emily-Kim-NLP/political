import { useState } from 'react'
import type { ParticipantInfo } from '../types'

interface Props {
  onNext: (info: ParticipantInfo) => void
}

const GRADES = [
  '대학교 1학년', '대학교 2학년', '대학교 3학년', '대학교 4학년',
  '대학원생', '기타',
]

const LIKERT_LABELS = ['전혀 없다', '별로 없다', '보통이다', '있는 편이다', '매우 많다']

export default function BasicInfoPage({ onNext }: Props) {
  const [age,             setAge]             = useState('')
  const [grade,           setGrade]           = useState('')
  const [major,           setMajor]           = useState('')
  const [phone,           setPhone]           = useState('')
  const [gender,          setGender]          = useState('')
  const [usInterestLevel, setUsInterestLevel] = useState<number | null>(null)

  const canNext =
    age.trim() !== '' &&
    grade !== '' &&
    major.trim() !== '' &&
    phone.trim().length >= 10 &&
    gender !== '' &&
    usInterestLevel !== null

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 3)  return digits
    if (digits.length <= 7)  return `${digits.slice(0,3)}-${digits.slice(3)}`
    return `${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7)}`
  }

  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>기본 정보 입력</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>
          실험 참여 전 기본 정보를 입력해 주세요.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* 나이 */}
          <div>
            <label style={labelStyle}>나이 <Required /></label>
            <input
              type="number" min={10} max={99}
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="예: 22"
              style={inputStyle}
            />
          </div>

          {/* 학년 */}
          <div>
            <label style={labelStyle}>학년 <Required /></label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {GRADES.map(g => (
                <button key={g} onClick={() => setGrade(g)} style={chipStyle(grade === g)}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* 전공 */}
          <div>
            <label style={labelStyle}>전공 <Required /></label>
            <input
              type="text"
              value={major}
              onChange={e => setMajor(e.target.value)}
              placeholder="예: 정치외교학과"
              style={inputStyle}
            />
          </div>

          {/* 성별 */}
          <div>
            <label style={labelStyle}>성별 <Required /></label>
            <div style={{ display: 'flex', gap: 12 }}>
              {['남', '여'].map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  style={{
                    flex: 1, padding: '12px 0', borderRadius: 8, fontSize: 15,
                    border: `2px solid ${gender === g ? '#374151' : '#e5e7eb'}`,
                    background: gender === g ? '#374151' : '#fff',
                    color: gender === g ? '#fff' : '#374151',
                    cursor: 'pointer', fontWeight: gender === g ? 700 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* 핸드폰 */}
          <div>
            <label style={labelStyle}>핸드폰 번호 <Required /></label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(formatPhone(e.target.value))}
              placeholder="010-0000-0000"
              style={inputStyle}
            />
            <p style={couponNoticeStyle}>
              📱 핸드폰 번호를 정확하게 기입하셔야 실험 참여 완료 후 <strong>쿠폰을 수령</strong>하실 수 있습니다.
            </p>
          </div>

          {/* 미국정치 관심도 */}
          <div>
            <label style={labelStyle}>미국 정치에 대한 관심도 <Required /></label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setUsInterestLevel(n)}
                    style={{
                      flex: 1, padding: '12px 0', borderRadius: 8, fontSize: 16,
                      fontWeight: 700,
                      border: `2px solid ${usInterestLevel === n ? '#374151' : '#e5e7eb'}`,
                      background: usInterestLevel === n ? '#374151' : '#fff',
                      color: usInterestLevel === n ? '#fff' : '#374151',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 2px' }}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>{LIKERT_LABELS[0]}</span>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>{LIKERT_LABELS[4]}</span>
              </div>
            </div>
          </div>

        </div>

        <button
          onClick={() => canNext && onNext({ age, grade, major, phone, gender, usInterestLevel })}
          disabled={!canNext}
          style={{
            width: '100%', padding: '14px 0', borderRadius: 10, border: 'none',
            background: canNext ? '#374151' : '#e5e7eb',
            color: canNext ? '#fff' : '#9ca3af',
            fontWeight: 700, fontSize: 16, cursor: canNext ? 'pointer' : 'not-allowed',
            marginTop: 28, transition: 'all 0.2s',
          }}
        >
          실험 시작하기 →
        </button>
      </div>
    </div>
  )
}

function Required() {
  return <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>
}

function chipStyle(active: boolean): React.CSSProperties {
  return {
    padding: '8px 14px', borderRadius: 8, fontSize: 13,
    border: `2px solid ${active ? '#374151' : '#e5e7eb'}`,
    background: active ? '#374151' : '#fff',
    color: active ? '#fff' : '#374151',
    cursor: 'pointer', fontWeight: active ? 700 : 400,
    transition: 'all 0.15s',
  }
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

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 14, fontWeight: 600,
  color: '#374151', marginBottom: 8,
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 8,
  border: '1.5px solid #e5e7eb', fontSize: 15,
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
}

const couponNoticeStyle: React.CSSProperties = {
  fontSize: 12, color: '#f59e0b', marginTop: 6,
  background: '#fffbeb', padding: '8px 12px', borderRadius: 6,
  border: '1px solid #fde68a', lineHeight: 1.6,
}
