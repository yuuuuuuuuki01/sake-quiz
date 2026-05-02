import { useState } from 'react'
import type { QuizState } from '../App'
import { MODULE_NAMES } from '../data/questions'
import './Quiz.css'

type Props = {
  state: QuizState
  onAnswer: (index: number) => void
}

export function Quiz({ state, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const q = state.questions[state.currentIndex]
  const progress = ((state.currentIndex) / state.questions.length) * 100
  const isLast = state.currentIndex + 1 === state.questions.length

  function handleSelect(i: number) {
    if (confirmed) return
    setSelected(i)
  }

  function handleConfirm() {
    if (selected === null) return
    setConfirmed(true)
  }

  function handleNext() {
    onAnswer(selected!)
    setSelected(null)
    setConfirmed(false)
  }

  const isCorrect = confirmed && selected === q.answer

  return (
    <div className="quiz card">
      {/* progress */}
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="quiz-meta">
        <span className="quiz-module-tag">{MODULE_NAMES[q.module]?.split('：')[1] ?? ''}</span>
        <span className="quiz-counter">{state.currentIndex + 1} / {state.questions.length}</span>
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
            <button key={i} className={cls} onClick={() => handleSelect(i)}>
              <span className="choice-label">{String.fromCharCode(65 + i)}</span>
              <span className="choice-text">{choice}</span>
            </button>
          )
        })}
      </div>

      {confirmed && (
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
        ) : (
          <button className="btn btn-primary btn-full" onClick={handleNext}>
            {isLast ? '結果を見る' : '次の問題'}
          </button>
        )}
      </div>
    </div>
  )
}
