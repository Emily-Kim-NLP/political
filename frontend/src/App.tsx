import { useState, useEffect } from 'react'
import axios from 'axios'
import StepIndicator from './components/StepIndicator'
import ArticlePanel from './components/ArticlePanel'
import QuestionPanel from './components/QuestionPanel'
import IntroPage from './components/IntroPage'
import ConsentPage from './components/ConsentPage'
import BasicInfoPage from './components/BasicInfoPage'
import LikertPage from './components/LikertPage'
import OrientationPage from './components/OrientationPage'
import type {
  Session, ResponsePayload, Orientation, Step,
  ParticipantInfo, LikertAnswers, AppStage,
} from './types'

export default function App() {
  // ── App stage ─────────────────────────────────────────────────
  const [stage, setStage]               = useState<AppStage>('intro')

  // ── Session ───────────────────────────────────────────────────
  const [session, setSession]           = useState<Session | null>(null)
  const [loading, setLoading]           = useState(true)
  const [initError, setInitError]       = useState<string | null>(null)

  // ── Experiment state ──────────────────────────────────────────
  const [articleIndex, setArticleIndex] = useState(0)
  const [step, setStep]                 = useState<Step>(0)
  const [q1, setQ1]                     = useState<Orientation>(null)
  const [q2, setQ2]                     = useState<number | null>(null)
  const [q3, setQ3]                     = useState<string | null>(null)
  const [q3Other, setQ3Other]           = useState('')
  const [responses, setResponses]       = useState<ResponsePayload[]>([])

  // ── Saving state ──────────────────────────────────────────────
  const [saving, setSaving]             = useState(false)
  const [saveError, setSaveError]       = useState<string | null>(null)
  const [likertSaving, setLikertSaving] = useState(false)


  // session은 앱 시작 시 바로 발급
  useEffect(() => { initSession() }, [])

  async function initSession() {
    setLoading(true)
    setInitError(null)
    try {
      const res = await axios.get<Session>('/session')
      setSession(res.data)
    } catch {
      setInitError('세션을 초기화하는 데 실패했습니다. 페이지를 새로 고침해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  // ── Handlers ──────────────────────────────────────────────────

  async function handleBasicInfoNext(info: ParticipantInfo) {
    if (!session) return
    setStage('orientation')  // 즉시 전환 → 버튼 중복 클릭 방지
    try {
      await axios.post('/participant', {
        participant_id:    session.participant_id,
        age:               info.age,
        grade:             info.grade,
        major:             info.major,
        phone:             info.phone,
        gender:            info.gender,
        us_interest_level: info.usInterestLevel,
        consent:           true,
      })
    } catch {
      // 저장 실패해도 실험은 진행
    }
  }

  function handleDisagree() {
    // ConsentPage가 자체적으로 비동의 화면 표시
  }

  async function handleSubmitArticle() {
    if (!session || !currentArticle || !q1 || q2 == null || !q3) return
    setSaving(true)
    setSaveError(null)

    const payload: ResponsePayload = {
      participant_id: session.participant_id,
      article_id:     currentArticle.article_id,
      domain:         currentArticle.domain,
      version:        currentArticle.version,
      category:       currentArticle.category,
      q1_label:       q1,
      q2_sentence:    q2,
      q3_bi:          q3,
      q3_other:       q3 === '기타' ? q3Other : null,
    }

    try {
      await axios.post('/response', payload)
      const allResponses = [...responses, payload]
      setResponses(allResponses)

      if (articleIndex + 1 >= totalArticles) {
        setStage('likert')
      } else {
        setArticleIndex(i => i + 1)
        setStep(0)
        setQ1(null)
        setQ2(null)
        setQ3(null)
        setQ3Other('')
      }
    } catch {
      setSaveError('저장에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setSaving(false)
    }
  }

  async function handleLikertSubmit(answers: LikertAnswers) {
    if (!session) return
    setLikertSaving(true)
    try {
      await axios.post('/likert', { participant_id: session.participant_id, answers })
    } catch {
      // 저장 실패해도 완료 처리
    } finally {
      setLikertSaving(false)
    }
    setStage('completed')
  }

  function handleNext() {
    if (step < 2) setStep(s => (s + 1) as Step)
    else handleSubmitArticle()
  }

  const accentColor =
    q1 === 'conservative' ? '#b91c1c' :
    q1 === 'progressive'  ? '#1d4ed8' :
    '#6b7280'

  const currentArticle = session?.articles[articleIndex]
  const totalArticles  = session?.articles.length ?? 0

  const canNext =
    step === 0 ? q1 !== null :
    step === 1 ? q2 !== null :
    q3 !== null && (q3 !== '기타' || q3Other.trim().length > 0)

  // ── Loading ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={centerStyle}>
        <div className="spinner" />
        <p style={{ marginTop: 16, color: '#6b7280', fontSize: 14 }}>초기화 중...</p>
      </div>
    )
  }

  if (initError) {
    return (
      <div style={centerStyle}>
        <p style={{ color: '#b91c1c', marginBottom: 16 }}>{initError}</p>
        <button onClick={initSession} style={retryBtnStyle}>다시 시도</button>
      </div>
    )
  }

  // ── Stage: intro ──────────────────────────────────────────────
  if (stage === 'intro') {
    return <IntroPage onNext={() => setStage('consent')} />
  }

  // ── Stage: consent ────────────────────────────────────────────
  if (stage === 'consent') {
    return <ConsentPage onAgree={() => setStage('basic_info')} onDisagree={handleDisagree} />
  }

  // ── Stage: basic_info ─────────────────────────────────────────
  if (stage === 'basic_info') {
    return <BasicInfoPage onNext={handleBasicInfoNext} />
  }

  // ── Stage: completed ──────────────────────────────────────────
  if (stage === 'completed') {
    return (
      <div style={centerStyle}>
        <div style={{
          background: '#fff', borderRadius: 16,
          padding: '40px 48px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          textAlign: 'center', maxWidth: 520, width: '100%',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>실험 완료!</h2>
          <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: 8 }}>
            모든 기사에 응답해 주셔서 감사합니다.
          </p>
          <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 24 }}>
            참여자 ID: <strong style={{ color: '#374151' }}>{session?.participant_id}</strong>
          </p>

        </div>
      </div>
    )
  }

  // ── Stage: likert ─────────────────────────────────────────────
  if (stage === 'likert') {
    return <LikertPage onSubmit={handleLikertSubmit} saving={likertSaving} />
  }

  // ── Stage: orientation ───────────────────────────────────────
  if (stage === 'orientation') {
    return <OrientationPage onNext={() => setStage('experiment')} />
  }

  // ── Stage: experiment ─────────────────────────────────────────
  if (!currentArticle) return null

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 20,
      }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>뉴스 기사 이념 판단 실험</h1>
          <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
            ID: {session?.participant_id}
          </p>
        </div>
        <div style={{
          padding: '6px 16px', borderRadius: 20,
          background: accentColor, color: '#fff',
          fontSize: 13, fontWeight: 700, transition: 'background 0.3s',
        }}>
          {articleIndex + 1} / {totalArticles}
        </div>
      </div>

      <div style={{ height: 4, background: '#e5e7eb', borderRadius: 4, marginBottom: 20 }}>
        <div style={{
          height: '100%', borderRadius: 4,
          width: `${(articleIndex / totalArticles) * 100}%`,
          background: accentColor, transition: 'width 0.4s, background 0.3s',
        }} />
      </div>

      <StepIndicator step={step} accentColor={accentColor} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>
        <ArticlePanel
          article={currentArticle}
          step={step}
          selectedSentence={q2}
          onSelectSentence={setQ2}
          accentColor={accentColor}
        />
        <QuestionPanel
          step={step}
          category={currentArticle.category}
          q1={q1} setQ1={setQ1}
          q2={q2}
          q3={q3} setQ3={setQ3}
          q3Other={q3Other} setQ3Other={setQ3Other}
          accentColor={accentColor}
          onPrev={() => setStep(s => Math.max(0, s - 1) as Step)}
          onNext={handleNext}
          canNext={canNext}
          saving={saving}
          saveError={saveError}
          isLast={step === 2}
        />
      </div>
    </div>
  )
}

const centerStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center',
  minHeight: '100vh',
}

const retryBtnStyle: React.CSSProperties = {
  padding: '10px 24px', borderRadius: 8,
  background: '#374151', color: '#fff',
  border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
}
