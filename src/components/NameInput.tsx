import { useState } from 'react'
import { questions, PASS_SCORE } from '@guide-data/questions'
import './NameInput.css'

type Props = {
  onNext: (name: string) => void
  onGuide: () => void
}

export function NameInput({ onNext, onGuide }: Props) {
  const [name, setName] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (name.trim()) onNext(name.trim())
  }

  return (
    <div className="name-wrap card">
      <div className="name-hero">
        <p className="name-kura">金井酒造店</p>
        <h2 className="name-title">公認ガイド<br />認証テスト</h2>
        <p className="name-sub">蔵見学ガイドとしての知識を証明しましょう</p>
      </div>

      <button className="guide-entry-btn name-guide-btn" onClick={onGuide}>
        蔵見学テキストを読む（事前学習）
      </button>

      <form className="name-form" onSubmit={handleSubmit}>
        <label className="name-label" htmlFor="name">
          お名前
          <span className="name-required">必須</span>
        </label>
        <input
          id="name"
          className="name-input"
          type="text"
          placeholder="例：山田 太郎"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />
        <p className="name-hint">認証書に印字されます</p>

        <button
          className="btn btn-primary btn-full name-submit"
          type="submit"
          disabled={!name.trim()}
        >
          テストをはじめる
        </button>
      </form>

      <div className="name-info">
        <div className="name-info-item">
          <span className="name-info-num">{questions.length}問</span>
          <span className="name-info-label">全モジュール</span>
        </div>
        <div className="name-info-divider" />
        <div className="name-info-item">
          <span className="name-info-num">{PASS_SCORE}点</span>
          <span className="name-info-label">合格ライン</span>
        </div>
        <div className="name-info-divider" />
        <div className="name-info-item">
          <span className="name-info-num">何度でも</span>
          <span className="name-info-label">再挑戦OK</span>
        </div>
      </div>
    </div>
  )
}
