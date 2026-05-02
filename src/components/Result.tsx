import { useRef } from 'react'
import type { QuizState } from '../App'
import { MODULE_NAMES, PASS_SCORE } from '../data/questions'
import './Result.css'

type Props = {
  state: QuizState
  userName: string
  onRestart: () => void
}

export function Result({ state, userName, onRestart }: Props) {
  const { questions, answers } = state
  const certRef = useRef<HTMLDivElement>(null)

  const correct = answers.filter((a, i) => a === questions[i].answer).length
  const total = questions.length
  const score = Math.round((correct / total) * 100)
  const passed = score >= PASS_SCORE

  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  const moduleName = state.selectedModule === 'all'
    ? '全モジュール'
    : MODULE_NAMES[state.selectedModule as number]

  function handlePrint() {
    window.print()
  }

  return (
    <div className="result card">
      {/* スコア */}
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
            <strong>おめでとうございます、{userName} さん！</strong>
            <p>合格ラインの{PASS_SCORE}点をクリアしました。認証書を印刷または保存して、金井酒造店へご連絡ください。</p>
          </>
        ) : (
          <>
            <strong>あと少しです</strong>
            <p>合格ラインは{PASS_SCORE}点です。テキストを見直して再チャレンジしてください。</p>
          </>
        )}
      </div>

      {/* 認証書 */}
      {passed && (
        <>
          <div className="certificate" ref={certRef}>
            <div className="cert-outer">
              <div className="cert-inner">
                <div className="cert-header">
                  <p className="cert-org">金井酒造店</p>
                  <div className="cert-title-wrap">
                    <div className="cert-line" />
                    <h2 className="cert-title">公認ガイド認証書</h2>
                    <div className="cert-line" />
                  </div>
                  <p className="cert-level">ベーシック認証</p>
                </div>

                <div className="cert-body">
                  <p className="cert-sentence">以下の者は、金井酒造店公認ガイド認証テストに合格し、</p>
                  <p className="cert-sentence">蔵見学ガイドとして必要な知識を有することを証明します。</p>

                  <div className="cert-name-block">
                    <p className="cert-name">{userName}</p>
                    <div className="cert-name-line" />
                  </div>

                  <div className="cert-meta">
                    <div className="cert-meta-item">
                      <span className="cert-meta-label">受験範囲</span>
                      <span className="cert-meta-value">{moduleName}</span>
                    </div>
                    <div className="cert-meta-item">
                      <span className="cert-meta-label">スコア</span>
                      <span className="cert-meta-value">{score}点（{correct}/{total}問）</span>
                    </div>
                    <div className="cert-meta-item">
                      <span className="cert-meta-label">取得日</span>
                      <span className="cert-meta-value">{today}</span>
                    </div>
                  </div>
                </div>

                <div className="cert-footer">
                  <div className="cert-seal">
                    <div className="cert-seal-inner">
                      <p className="cert-seal-text">白笹鼓</p>
                      <p className="cert-seal-sub">金井酒造店</p>
                    </div>
                  </div>
                  <div className="cert-sign">
                    <div className="cert-sign-line" />
                    <p className="cert-sign-label">金井酒造店 蔵元</p>
                  </div>
                </div>

                <p className="cert-note">※ この認証書は申請資格の証明です。正式な認証書は実地審査合格後に発行されます。</p>
              </div>
            </div>
          </div>

          <div className="cert-actions">
            <button className="btn btn-primary" onClick={handlePrint}>
              印刷・保存する
            </button>
            <a
              className="btn btn-outline"
              href="mailto:matsuzaki@kaneishuzo.co.jp?subject=公認ガイド認証申請&body=お名前：%0A受験日：%0Aスコア："
            >
              申請メールを送る
            </a>
          </div>
        </>
      )}

      {/* 振り返り */}
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
                  <p className="breakdown-ans">正解：{q.choices[q.answer]}</p>
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
