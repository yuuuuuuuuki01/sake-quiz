import { MODULE_NAMES, questions } from '../data/questions'
import './ModuleSelect.css'

type Props = {
  userName: string
  onStart: (module: number | 'all') => void
  onGuide: () => void
}

export function ModuleSelect({ userName, onStart, onGuide }: Props) {
  const modules = Object.entries(MODULE_NAMES)

  return (
    <div className="module-select card">
      <div className="module-hero">
        <p className="module-tagline"><strong>{userName}</strong> さん、ようこそ。テストを選択してください。</p>
      </div>

      <button className="guide-entry-btn" onClick={onGuide}>
        蔵見学テキストを読む（学習コンテンツ）
      </button>

      <h2 className="module-heading">テストを選択してください</h2>

      <div className="module-list">
        {modules.map(([num, name]) => {
          const moduleNum = Number(num)
          const count = questions.filter(q => q.module === moduleNum).length
          return (
            <button
              key={num}
              className="module-item"
              onClick={() => onStart(moduleNum)}
            >
              <span className="module-num">Module {num}</span>
              <span className="module-name">{name.replace(`Module ${num}：`, '')}</span>
              <span className="module-count">{count}問</span>
            </button>
          )
        })}
      </div>

      <div className="module-divider">または</div>

      <button className="btn btn-primary btn-full" onClick={() => onStart('all')}>
        全モジュール まとめてテスト（{questions.length}問）
      </button>

      <div className="module-note">
        <strong>合格ライン：80%以上</strong>
        <br />
        合格するとベーシック認証の申請が可能になります
      </div>
    </div>
  )
}
