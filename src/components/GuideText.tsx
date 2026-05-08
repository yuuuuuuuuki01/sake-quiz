import { useState } from 'react'
import { guideSections } from '@guide-data/guide'
import type { GuideQuiz } from '@guide-data/guide'
import './GuideText.css'

type Props = {
  onBack: () => void
}

function MiniQuiz({ quiz }: { quiz: GuideQuiz[] }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const q = quiz[current]

  function handleAnswer() {
    if (selected === null) return
    setAnswered(true)
    if (selected === q.answer) setScore(s => s + 1)
  }

  function handleNext() {
    if (current + 1 >= quiz.length) {
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  function handleRetry() {
    setCurrent(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setFinished(false)
  }

  if (finished) {
    const allCorrect = score === quiz.length
    return (
      <div className="mini-quiz">
        <div className="mini-quiz-header">
          <span className="mini-quiz-icon">{allCorrect ? '\u2705' : '\u{1F4DD}'}</span>
          <span className="mini-quiz-label">確認テスト結果</span>
        </div>
        <div className={`mini-quiz-result ${allCorrect ? 'perfect' : ''}`}>
          <span className="mini-result-score">{score} / {quiz.length} 問正解</span>
          {allCorrect
            ? <p className="mini-result-msg">すべて正解です！</p>
            : <p className="mini-result-msg">テキストを見直してもう一度チャレンジしてみましょう</p>
          }
        </div>
        {!allCorrect && (
          <button className="btn btn-outline mini-quiz-btn" onClick={handleRetry}>
            もう一度
          </button>
        )}
      </div>
    )
  }

  const isCorrect = answered && selected === q.answer

  return (
    <div className="mini-quiz">
      <div className="mini-quiz-header">
        <span className="mini-quiz-icon">{'\u{1F4DD}'}</span>
        <span className="mini-quiz-label">確認テスト（{current + 1}/{quiz.length}）</span>
      </div>

      <p className="mini-quiz-question">{q.question}</p>

      <div className="mini-quiz-choices">
        {q.choices.map((choice, i) => {
          let cls = 'mini-choice'
          if (answered) {
            if (i === q.answer) cls += ' correct'
            else if (i === selected) cls += ' wrong'
          } else if (i === selected) {
            cls += ' selected'
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => !answered && setSelected(i)}
              disabled={answered}
            >
              {choice}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className={`mini-quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
          <strong>{isCorrect ? '\u2B55 正解！' : '\u274C 不正解'}</strong>
          <p>{q.explanation}</p>
        </div>
      )}

      <div className="mini-quiz-actions">
        {!answered ? (
          <button
            className="btn btn-primary mini-quiz-btn"
            onClick={handleAnswer}
            disabled={selected === null}
          >
            回答する
          </button>
        ) : (
          <button className="btn btn-primary mini-quiz-btn" onClick={handleNext}>
            {current + 1 >= quiz.length ? '結果を見る' : '次の問題'}
          </button>
        )}
      </div>
    </div>
  )
}

export function GuideText({ onBack }: Props) {
  const [active, setActive] = useState<string>(guideSections[0].id)
  const section = guideSections.find(s => s.id === active)!

  return (
    <div className="guide-wrap">
      {/* サイドナビ */}
      <nav className="guide-nav card">
        <p className="guide-nav-title">見学ルート</p>
        {guideSections.map(s => (
          <button
            key={s.id}
            className={`guide-nav-item ${s.id === active ? 'active' : ''}`}
            onClick={() => setActive(s.id)}
          >
            {s.title}
            {s.badge && (
              <span className={`guide-badge ${s.badge === '60分のみ' ? 'badge-60' : 'badge-both'}`}>
                {s.badge}
              </span>
            )}
          </button>
        ))}
        <button className="btn btn-outline guide-back-btn" onClick={onBack}>
          テストへ戻る
        </button>
      </nav>

      {/* コンテンツ */}
      <article className="guide-content card">
        <div className="guide-content-header">
          <h2 className="guide-content-title">{section.title}</h2>
          {section.badge && (
            <span className={`guide-badge ${section.badge === '60分のみ' ? 'badge-60' : 'badge-both'}`}>
              {section.badge}
            </span>
          )}
        </div>

        <div className="guide-body">
          {section.content.split('\n\n').map((para, i) => {
            if (para.startsWith('\u26A0\uFE0F')) {
              return (
                <div key={i} className="guide-warning">
                  {para}
                </div>
              )
            }
            if (para.startsWith('\u3010')) {
              const [label, ...rest] = para.split('\n')
              return (
                <div key={i} className="guide-block60">
                  <span className="guide-block60-label">{label}</span>
                  {rest.length > 0 && <p>{rest.join('\n')}</p>}
                </div>
              )
            }
            return <p key={i} className="guide-para">{para}</p>
          })}
        </div>

        {/* 確認テスト */}
        {section.quiz && section.quiz.length > 0 && (
          <MiniQuiz key={section.id} quiz={section.quiz} />
        )}

        {/* 前後ナビ */}
        <div className="guide-pager">
          {guideSections.findIndex(s => s.id === active) > 0 && (
            <button
              className="btn btn-outline"
              onClick={() => {
                const idx = guideSections.findIndex(s => s.id === active)
                setActive(guideSections[idx - 1].id)
              }}
            >
              \u2190 前へ
            </button>
          )}
          <span />
          {guideSections.findIndex(s => s.id === active) < guideSections.length - 1 && (
            <button
              className="btn btn-primary"
              onClick={() => {
                const idx = guideSections.findIndex(s => s.id === active)
                setActive(guideSections[idx + 1].id)
              }}
            >
              次へ \u2192
            </button>
          )}
        </div>
      </article>
    </div>
  )
}
