export interface Sentence {
  id: number
  text: string
}

export interface Article {
  article_id: string
  domain: string
  version: string
  sentences: Sentence[]
}

export interface Session {
  participant_id: string
  articles: Article[]
}

export interface ParticipantInfo {
  age: string
  grade: string
  major: string
  phone: string
  gender: string
  usInterestLevel: number | null
}

export interface ResponsePayload {
  participant_id: string
  article_id: string
  domain: string
  version: string
  q1_label: string
  q2_sentence: number
  q3_bi: string
  q3_other: string | null
}

export interface LikertAnswers {
  [questionId: string]: number
}

export interface AnalyzePayload {
  participant_id: string
  responses: ResponsePayload[]
}

export type AppStage = 'intro' | 'consent' | 'basic_info' | 'experiment' | 'likert' | 'completed'

export type Orientation = 'conservative' | 'progressive' | null
export type Step = 0 | 1 | 2

export const BI_OPTIONS = [
  { code: 'BI1', label: '자극적이거나 평가적인 단어 때문에 성향이 느껴짐' },
  { code: 'BI2', label: '기자나 서술자의 해석이 사실처럼 제시되어 성향이 느껴짐' },
  { code: 'BI3', label: '특정 정치인, 정당, 정책, 가치가 긍정적 또는 부정적으로 묘사됨' },
  { code: 'BI4', label: '한쪽 입장은 강조되고 반대 관점은 약하게 제시되거나 빠져 있음' },
  { code: 'BI5', label: '특정 입장의 인물, 기관, 자료만 인용되어 성향이 느껴짐' },
  { code: 'BI6', label: '일부 사실, 수치, 사례만 선택적으로 제시되어 성향이 느껴짐' },
  { code: '기타', label: '기타 (직접 입력)' },
] as const
