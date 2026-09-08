'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Swords, X } from 'lucide-react';
import { isCorrectAnswer, QUESTIONS } from '@/lib/questions';
import { SiteHeader } from '@/components/site-header';

export function SoloQuiz() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const question = QUESTIONS[questionIndex];

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!answer.trim() || result) return;
    const correct = isCorrectAnswer(question, answer);
    setScore((current) => current + (correct ? 10 : -5));
    setResult(correct ? 'correct' : 'wrong');
  }

  function nextQuestion() {
    setQuestionIndex((current) => (current + 1) % QUESTIONS.length);
    setAnswer('');
    setResult(null);
  }

  return (
    <main className="app-shell">
      <SiteHeader active="practice" />
      <section className="solo-layout">
        <div className="mode-heading">
          <p className="eyebrow">Solo practice</p>
          <h1>Build your recall.</h1>
          <p>Correct answers earn +10. Misses cost −5.</p>
        </div>
        <article className="question-card solo-card">
          <div className="question-meta">
            <span className="category-chip">{question.category}</span>
            <span>{questionIndex + 1} / {QUESTIONS.length}</span>
          </div>
          <h2>{question.prompt}</h2>
          <form onSubmit={submit} className="answer-form">
            <label htmlFor="solo-answer">Your answer</label>
            <div className="answer-row">
              <input id="solo-answer" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Type your answer…" disabled={result !== null} autoComplete="off" />
              {!result ? <button className="primary-button" type="submit">Check answer</button> : <button className="primary-button" type="button" onClick={nextQuestion}>Next <ArrowRight size={18} /></button>}
            </div>
          </form>
          {result && <div className={`result-banner ${result}`} role="status">{result === 'correct' ? <Check size={20} /> : <X size={20} />}<span>{result === 'correct' ? 'Correct — +10' : `Not quite — −5. Answer: ${question.answer}`}</span></div>}
        </article>
        <aside className="solo-score-card">
          <span>Score</span><strong>{score}</strong>
          <div className="score-rule"><span>Correct</span><b>+10</b></div>
          <div className="score-rule"><span>Incorrect</span><b>−5</b></div>
          <Link href="/head-to-head" className="versus-link"><Swords size={20} /> Play head to head <ArrowRight size={18} /></Link>
        </aside>
      </section>
    </main>
  );
}
