import { useState } from 'react'
import { NameInput } from './components/NameInput'
import { ModuleSelect } from './components/ModuleSelect'
import { Quiz } from './components/Quiz'
import { Result } from './components/Result'
import { GuideText } from './components/GuideText'
import { questions } from './data/questions'
import type { Question } from './data/questions'
import './App.css'

export type Screen = 'name' | 'home' | 'guide' | 'quiz' | 'result'

export type QuizState = {
  selectedModule: number | 'all'
  questions: Question[]
  currentIndex: number
  answers: (number | null)[]
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('name')
  const [userName, setUserName] = useState('')
  const [quizState, setQuizState] = useState<QuizState | null>(null)

  function handleNameSubmit(name: string) {
    setUserName(name)
    setScreen('home')
  }

  function startQuiz(module: number | 'all') {
    const qs = module === 'all'
      ? [...questions].sort(() => Math.random() - 0.5)
      : questions.filter(q => q.module === module).sort(() => Math.random() - 0.5)
    setQuizState({
      selectedModule: module,
      questions: qs,
      currentIndex: 0,
      answers: new Array(qs.length).fill(null),
    })
    setScreen('quiz')
  }

  function submitAnswer(index: number) {
    if (!quizState) return
    const newAnswers = [...quizState.answers]
    newAnswers[quizState.currentIndex] = index

    if (quizState.currentIndex + 1 >= quizState.questions.length) {
      setQuizState({ ...quizState, answers: newAnswers })
      setScreen('result')
    } else {
      setQuizState({
        ...quizState,
        answers: newAnswers,
        currentIndex: quizState.currentIndex + 1,
      })
    }
  }

  function restart() {
    setQuizState(null)
    setScreen('home')
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <span className="header-logo">白笹鼓</span>
          <h1 className="header-title">公認ガイド認証テスト</h1>
          <span className="header-sub">金井酒造店</span>
        </div>
      </header>

      <main className="app-main">
        {screen === 'name' && <NameInput onNext={handleNameSubmit} />}
        {screen === 'home' && (
          <ModuleSelect
            userName={userName}
            onStart={startQuiz}
            onGuide={() => setScreen('guide')}
          />
        )}
        {screen === 'guide' && <GuideText onBack={() => setScreen('home')} />}
        {screen === 'quiz' && quizState && (
          <Quiz state={quizState} onAnswer={submitAnswer} />
        )}
        {screen === 'result' && quizState && (
          <Result state={quizState} userName={userName} onRestart={restart} />
        )}
      </main>
    </div>
  )
}
