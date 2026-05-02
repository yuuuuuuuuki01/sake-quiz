import type { QuizState } from '../App'
import { MODULE_NAMES, PASS_SCORE } from '../data/questions'
import './Result.css'

type Props = {
  state: QuizState
  onRestart: () => void
}

export function Result({ state, onRestart }: Props) {
  const { questions, answers } = state
  const correct = answers.filter((a, i) => a === questions[i].answer).length
  const total = questions.length
  const score = Math.round((correct / total) * 100)
  const passed = score >= PASS_SCORE

  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="result card">
      <div className={`result-badge ${passed ? 'pass' : 'fail'}`}>
        {passed ? '合格' : '不合格'}
      </div>

      <div className="result-score">
        <span className="score-num">{score}</span>
        <span className="score-unit">点</span>
        <span className="score-detail">（{correct} / {total} 問正解）</span>
      </div>

      <div className={`result-message ${passed ? 'pass' : 'fail'}`}>
        {passed ? (
          <>
            <strong>おめでとうございます！</strong>
            <p>合格ラインの{PASS_SCORE}点をクリアしました。金井酒造店までご連絡いただき、ベーシック認証の申請手続きを進めてください。</p>
          </>
        ) : (
          <>
            <strong>あと少しです</strong>
            <p>合格ラインは{PASS_SCORE}点です。学習コンテンツを見直して再チャレンジしてください。</p>
          </>
        )}
      </div>

      {passed && (
        <div className="certificate">
          <div className="cert-border">
            <p className="cert-label">認証申請資格証明</p>
            <h2 className="cert-title">金井酒造店 公認ガイド</h2>
            <p className="cert-subtitle">ベーシック認証</p>
            <div className="cert-divider" />
            <p className="cert-module">
              {state.selectedModule === 'all'
                ? '全モジュール'
                : MODULE_NAMES[state.selectedModule as number]}
            </p>
            <p className="cert-score">スコア：{score}点 / {total}問中{correct}問正解</p>
            <p className="cert-date">受験日：{today}</p>
            <p className="cert-note">※ この画面をスクリーンショットして金井酒造店にご提出ください</p>
          </div>
        </div>
      )}

      <div className="result-breakdown">
        <h3 className="breakdown-title">問題の振り返り</h3>
        {questions.map((q, i) => {
          const userAnswer = answers[i]
          const isCorrect = userAnswer === q.answer
          return (
            <div key={q.id} className={`breakdown-item ${isCorrect ? 'ok' : 'ng'}`}>
              <span className="breakdown-mark">{isCorrect ? '○' : '✕'}</span>
              <div className="breakdown-body">
                <p className="breakdown-q">{q.question}</p>
                {!isCorrect && (
                  <p className="breakdown-ans">
                    正解：{q.choices[q.answer]}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="result-actions">
        <button className="btn btn-outline btn-full" onClick={onRestart}>
          トップへ戻る
        </button>
      </div>
    </div>
  )
}
