import { questions } from '../data/questions'
import { PASS_SCORE } from '../data/questions'
import './ModuleSelect.css'

type Props = {
  userName: string
  onStart: (module: number | 'all') => void
  onGuide: () => void
}

export function ModuleSelect({ userName, onStart, onGuide }: Props) {
  return (
    <div className="module-select card">
      <div className="module-hero">
        <p className="module-welcome"><strong>{userName}</strong> さん、ようこそ</p>
        <p className="module-tagline">テスト開始前に、蔵見学テキストで知識を確認しましょう</p>
      </div>

      <button className="guide-entry-btn" onClick={onGuide}>
        蔵見学テキストを読む（学習コンテンツ）
      </button>

      <div className="module-info-grid">
        <div className="module-info-item">
          <span className="module-info-num">{questions.length}問</span>
          <span className="module-info-label">全問出題</span>
        </div>
        <div className="module-info-divider" />
        <div className="module-info-item">
          <span className="module-info-num">{PASS_SCORE}点</span>
          <span className="module-info-label">合格ライン</span>
        </div>
        <div className="module-info-divider" />
        <div className="module-info-item">
          <span className="module-info-num">30秒</span>
          <span className="module-info-label">1問の制限時間</span>
        </div>
      </div>

      <button className="btn btn-primary btn-full module-start-btn" onClick={() => onStart('all')}>
        テストをスタートする
      </button>

      <div className="module-note">
        制限時間を超えると自動的に次の問題へ進みます
      </div>
    </div>
  )
}
