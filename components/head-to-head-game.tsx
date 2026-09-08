'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, RotateCcw, X } from 'lucide-react';
import { isCorrectAnswer, QUESTIONS } from '@/lib/questions';
import { SiteHeader } from '@/components/site-header';

type Player = 1 | 2;

export function HeadToHeadGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<Player, number>>({ 1: 0, 2: 0 });
  const [buzzedPlayer, setBuzzedPlayer] = useState<Player | null>(null);
  const [passedPlayers, setPassedPlayers] = useState<Record<Player, boolean>>({ 1: false, 2: false });
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const answerRef = useRef<HTMLInputElement>(null);
  const question = QUESTIONS[questionIndex];

  function buzz(player: Player) {
    if (buzzedPlayer !== null || result !== null || passedPlayers[player]) return;
    setBuzzedPlayer(player);
  }

  function pass(player: Player) {
    if (buzzedPlayer !== null || result !== null || passedPlayers[player]) return;
    const otherPlayer: Player = player === 1 ? 2 : 1;
    if (passedPlayers[otherPlayer]) {
      nextQuestion();
      return;
    }
    setPassedPlayers((current) => ({ ...current, [player]: true }));
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      const key = event.key.toLowerCase();
      if (key === 'a' || key === 'l') {
        event.preventDefault();
        buzz(key === 'a' ? 1 : 2);
      }
      if (key === 'q' || key === 'p') {
        event.preventDefault();
        pass(key === 'q' ? 1 : 2);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [buzzedPlayer, result, passedPlayers]);

  useEffect(() => {
    if (buzzedPlayer) answerRef.current?.focus();
  }, [buzzedPlayer]);

  function submitAnswer(event: FormEvent) {
    event.preventDefault();
    scoreResponse(answer);
  }

  function scoreResponse(response: string) {
    if (!buzzedPlayer || !response.trim() || result) return null;
    const correct = isCorrectAnswer(question, response);
    const scoreChange = correct ? 10 : -5;
    setScores((current) => ({ ...current, [buzzedPlayer]: current[buzzedPlayer] + (correct ? 10 : -5) }));
    setResult(correct ? 'correct' : 'wrong');
    setAnswer(response);
    return { player: buzzedPlayer, correct, scoreChange, acceptedAnswer: question.answer };
  }

  function nextQuestion() {
    setQuestionIndex((current) => (current + 1) % QUESTIONS.length);
    setBuzzedPlayer(null); setPassedPlayers({ 1: false, 2: false }); setAnswer(''); setResult(null);
  }

  function resetMatch() {
    setQuestionIndex(0); setScores({ 1: 0, 2: 0 }); setBuzzedPlayer(null); setPassedPlayers({ 1: false, 2: false }); setAnswer(''); setResult(null);
  }

  useEffect(() => {
    const context = (document as Document & {
      modelContext?: {
        registerTool: (tool: Record<string, unknown>, options?: { signal?: AbortSignal }) => void | Promise<void>;
      };
    }).modelContext;
    if (!context?.registerTool) return;

    const lifecycle = new AbortController();
    const reportError = (error: unknown) => console.warn('Quiz Arena tool registration failed', error);

    const registrations = [
      context.registerTool({
        name: 'buzz_player',
        title: 'Buzz in a player',
        description: 'Lock the current question to Player 1 or Player 2. Only use before anyone has buzzed.',
        inputSchema: {
          type: 'object',
          properties: { player: { type: 'integer', enum: [1, 2] } },
          required: ['player'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input: unknown) {
          const player = (input as { player?: unknown })?.player;
          if (player !== 1 && player !== 2) throw new Error('Player must be 1 or 2.');
          if (buzzedPlayer !== null || result !== null) throw new Error('This question is already locked.');
          buzz(player);
          return { buzzedPlayer: player, question: question.prompt };
        },
      }, { signal: lifecycle.signal }),
      context.registerTool({
        name: 'pass_player',
        title: 'Pass for a player',
        description: 'Mark Player 1 or Player 2 as passed on the current question. When both pass, move to the next question with no score change.',
        inputSchema: {
          type: 'object',
          properties: { player: { type: 'integer', enum: [1, 2] } },
          required: ['player'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input: unknown) {
          const player = (input as { player?: unknown })?.player;
          if (player !== 1 && player !== 2) throw new Error('Player must be 1 or 2.');
          if (buzzedPlayer !== null || result !== null) throw new Error('A player has already buzzed.');
          if (passedPlayers[player]) throw new Error(`Player ${player} has already passed.`);
          const advancesQuestion = passedPlayers[player === 1 ? 2 : 1];
          pass(player);
          return { passedPlayer: player, advancesQuestion, scoreChange: 0 };
        },
      }, { signal: lifecycle.signal }),
      context.registerTool({
        name: 'submit_player_answer',
        title: 'Submit player answer',
        description: 'Submit the answer for the player who buzzed first and apply the +10 or −5 score change.',
        inputSchema: {
          type: 'object',
          properties: { answer: { type: 'string', minLength: 1 } },
          required: ['answer'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: true },
        execute(input: unknown) {
          const response = (input as { answer?: unknown })?.answer;
          if (typeof response !== 'string' || !response.trim()) throw new Error('Answer must be a non-empty string.');
          if (!buzzedPlayer) throw new Error('A player must buzz before answering.');
          if (result) throw new Error('This question has already been scored.');
          return scoreResponse(response);
        },
      }, { signal: lifecycle.signal }),
    ];

    for (const registration of registrations) Promise.resolve(registration).catch(reportError);
    return () => lifecycle.abort();
  }, [buzzedPlayer, result, questionIndex, scores, passedPlayers]);

  return (
    <main className="app-shell versus-shell">
      <SiteHeader active="versus" />
      <section className="versus-stage">
        <div className="versus-topline">
          <div><p className="eyebrow">Head to head</p><h1>First buzz gets the floor.</h1></div>
          <button className="ghost-button" type="button" onClick={resetMatch}><RotateCcw size={17} /> Reset match</button>
        </div>
        <div className="scoreboard" aria-label="Scoreboard">
          <button className={`player-panel player-one ${buzzedPlayer === 1 ? 'buzzed' : ''} ${passedPlayers[1] ? 'passed' : ''}`} type="button" onClick={() => buzz(1)} disabled={buzzedPlayer !== null || result !== null || passedPlayers[1]} aria-label="Player 1: A to buzz, Q to pass">
            <span className="player-label"><i /> Player 1</span><strong>{scores[1]}</strong><span className="buzz-key">{passedPlayers[1] ? 'Passed' : <><kbd>A</kbd> buzz <em>·</em> <kbd>Q</kbd> pass</>}</span>
          </button>
          <div className="versus-badge" aria-hidden="true">VS</div>
          <button className={`player-panel player-two ${buzzedPlayer === 2 ? 'buzzed' : ''} ${passedPlayers[2] ? 'passed' : ''}`} type="button" onClick={() => buzz(2)} disabled={buzzedPlayer !== null || result !== null || passedPlayers[2]} aria-label="Player 2: L to buzz, P to pass">
            <span className="player-label"><i /> Player 2</span><strong>{scores[2]}</strong><span className="buzz-key">{passedPlayers[2] ? 'Passed' : <><kbd>L</kbd> buzz <em>·</em> <kbd>P</kbd> pass</>}</span>
          </button>
        </div>
        <article className="question-card versus-question-card">
          <div className="question-meta"><span className="category-chip">{question.category}</span><span>Question {questionIndex + 1} of {QUESTIONS.length}</span></div>
          <h2>{question.prompt}</h2>
          {!buzzedPlayer ? <div className="waiting-state" role="status"><span className="pulse-dot" /> {passedPlayers[1] ? 'Player 1 passed — waiting for Player 2…' : passedPlayers[2] ? 'Player 2 passed — waiting for Player 1…' : 'Waiting for a buzz…'}</div> : (
            <form className="answer-form versus-answer" onSubmit={submitAnswer}>
              <label htmlFor="versus-answer">Player {buzzedPlayer} answers <span>Opponent locked out</span></label>
              <div className="answer-row">
                <input ref={answerRef} id="versus-answer" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Type the answer…" disabled={result !== null} autoComplete="off" />
                {!result ? <button className="primary-button" type="submit">Submit answer</button> : <button className="primary-button" type="button" onClick={nextQuestion}>Next <ArrowRight size={18} /></button>}
              </div>
            </form>
          )}
          {result && <div className={`result-banner ${result}`} role="status">{result === 'correct' ? <Check size={20} /> : <X size={20} />}<span>Player {buzzedPlayer} {result === 'correct' ? 'is correct — +10' : `missed — −5. Answer: ${question.answer}`}</span></div>}
        </article>
        <p className="rules-line"><b>Scoring</b><span>Correct +10</span><span>Incorrect −5</span><span>Q / P to pass</span><span>Only the first buzz can answer</span></p>
      </section>
    </main>
  );
}
