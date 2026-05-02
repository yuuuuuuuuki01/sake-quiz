import { useState, useEffect, useCallback } from 'react'
import type { QuizState } from '../App'
import './Quiz.css'

const TIME_LIMIT = 30 // 秒

type Props = {
  state: QuizState
  onAnswer: (index: number | null) => void
}

export function Quiz({ state, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [timedOut, setTimedOut] = useState(false)

  const q = state.questions[state.currentIndex]
  const progress = (state.currentIndex / state.questions.length) * 100
  const isLast = state.currentIndex + 1 === state.questions.length

  const handleNext = useCallback(() => {
    onAnswer(selected)
    setSelected(null)
    setConfirmed(false)
    setTimeLeft(TIME_LIMIT)
    setTimedOut(false)
  }, [selected, onAnswer])

  // タイマー
  useEffect(() => {
    if (confirmed) return
    if (timeLeft <= 0) {
      setTimedOut(true)
      setConfirmed(true)
      return
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, confirmed])

  // タイムアウト後、1秒待って自動で次へ
  useEffect(() => {
    if (!timedOut) return
    const timer = setTimeout(() => handleNext(), 1500)
    return () => clearTimeout(timer)
  }, [timedOut, handleNext])

  function handleSelect(i: number) {
    if (confirmed) return
    setSelected(i)
  }

  function handleConfirm() {
    if (selected === null || confirmed) return
    setConfirmed(true)
  }

  const isCorrect = confirmed && selected !== null && selected === q.answer
  const timerRatio = timeLeft / TIME_LIMIT
  const timerColor = timerRatio > 0.5 ? 'var(--sake-green)' : timerRatio > 0.25 ? '#f59e0b' : '#ef4444'

  return (
    <div className="quiz card">
      {/* 進捗バー */}
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="quiz-meta">
        <span className="quiz-counter">{state.currentIndex + 1} / {state.questions.length}問</span>

        {/* タイマー */}
        <div className="quiz-timer" style={{ '--timer-color': timerColor } as React.CSSProperties}>
          <svg className="timer-ring" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke={timerColor}
              strokeWidth="3"
              strokeDasharray={`${timerRatio * 100} 100`}
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
              style={{ transition: 'stroke-dasharray 0.9s linear, stroke 0.3s' }}
            />
          </svg>
          <span className="timer-num" style={{ color: timerColor }}>{timeLeft}</span>
        </div>
      </div>

      <p className="quiz-question">{q.question}</p>

      <div className="quiz-choices">
        {q.choices.map((choice, i) => {
          let cls = 'quiz-choice'
          if (confirmed) {
            if (i === q.answer) cls += ' correct'
            else if (i === selected) cls += ' wrong'
          } else if (i === selected) {
            cls += ' selected'
          }
          return (
            <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={confirmed}>
              <span className="choice-label">{String.fromCharCode(65 + i)}</span>
              <span className="choice-text">{choice}</span>
            </button>
          )
        })}
      </div>

      {timedOut && (
        <div className="quiz-explanation exp-timeout">
          <strong>時間切れ</strong>
          <p>正解：{q.choices[q.answer]}</p>
          <p>{q.explanation}</p>
        </div>
      )}

      {confirmed && !timedOut && (
        <div className={`quiz-explanation ${isCorrect ? 'exp-correct' : 'exp-wrong'}`}>
          <strong>{isCorrect ? '正解！' : '不正解'}</strong>
          <p>{q.explanation}</p>
        </div>
      )}

      <div className="quiz-actions">
        {!confirmed ? (
          <button
            className="btn btn-primary btn-full"
            onClick={handleConfirm}
            disabled={selected === null}
          >
            回答する
          </button>
        ) : !timedOut ? (
          <button className="btn btn-primary btn-full" onClick={handleNext}>
            {isLast ? '結果を見る' : '次の問題'}
          </button>
        ) : (
          <p className="auto-next-msg">次の問題へ移動します…</p>
        )}
      </div>
    </div>
  )
}
