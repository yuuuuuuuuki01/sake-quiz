import { useState } from 'react'
import { guideSections } from '@guide-data/guide'
import './GuideText.css'

type Props = {
  onBack: () => void
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
            if (para.startsWith('⚠️')) {
              return (
                <div key={i} className="guide-warning">
                  {para}
                </div>
              )
            }
            if (para.startsWith('【')) {
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
              ← 前へ
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
              次へ →
            </button>
          )}
        </div>
      </article>
    </div>
  )
}
