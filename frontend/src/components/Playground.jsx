import React, { useEffect, useState } from "react";
import {
  socket,
  registerListeners,
  emitJoinRoom,
  emitStartGame,
  emitSubmitCard,
  emitPickWinner,
} from "../controlers/socket.js";
import EnterRoomBox from "./EnterRoomBox.jsx";
import ConfettiExplosion from "react-confetti-explosion";
import "./css_aryan/playground.css";

function Playground() {
  // ── State ──────────────────────────────────────────────────────────────────

  const [roomCode, setRoomCode] = useState("");       // room code the player typed in
  const [username, setUsername] = useState("");        // player's display name
  const [players, setPlayers] = useState([]);          // live player list from server (name, id, score, isCzar)
  const [hand, setHand] = useState([]);                // this player's white cards
  const [blackCard, setBlackCard] = useState(null);   // current round's black card text
  const [submissions, setSubmissions] = useState([]); // white cards submitted by all players this round
  const [isCzar, setIsCzar] = useState(false);        // true if this player is the Card Czar this round
  const [logs, setLogs] = useState([]);                // activity log entries (shown in the bottom bar)
  const [gameStarted, setGameStarted] = useState(false);     // flips to true once the host starts the game
  const [roomJoined, setRoomJoined] = useState(false);       // flips to true after joining a room (hides the join screen)
  const [chosenCard, setChosenCard] = useState(null);         // the white card this player has selected but not yet submitted
  const [submitted, setSubmitted] = useState(false);          // true after this player submits their card for the round
  const [confetti, setConfetti] = useState(false);            // triggers the confetti animation on round win
  const [roundWinner, setRoundWinner] = useState(null);       // name of the player who won the last round
  const [showWinnerDialog, setShowWinnerDialog] = useState(false); // controls visibility of the winner overlay

  // ── Socket listeners ───────────────────────────────────────────────────────
  // Registers all server event handlers once on mount.
  // Each handler updates local state so React re-renders the UI automatically.
  useEffect(() => {
    registerListeners({
      // Server sent an updated player list (someone joined or left)
      onPlayerListUpdate: (players) => {
        setPlayers(players);
        log("players updated", players.map((p) => p.name));
      },

      // Server confirmed the game has started for everyone in the room
      onGameStarted: () => {
        setGameStarted(true);
        log("game started for everyone!");
      },

      // Server started a new round — reset per-round state and update czar
      onNewRound: (data) => {
        setSubmitted(false);
        setChosenCard(null);
        setBlackCard(data.blackCard);
        setPlayers(data.players);
        const me = data.players.find((p) => p.id === socket.id);
        setIsCzar(me?.isCzar || false);
        log("new round started", data);
      },

      // Server dealt new white cards to this player
      onUpdateHand: (hand) => {
        setHand(hand);
        log("your hand updated", hand);
      },

      // Server told this player they are the Czar and sent all submissions to judge
      onJudgeRound: (subs) => {
        setSubmissions(subs);
        log("you are czar", subs);
      },

      // Server announced the round winner — show dialog + confetti for 3.5s
      onRoundResult: (result) => {
        log("round result", result);
        const winner = result.winner;
        setRoundWinner(winner);
        setShowWinnerDialog(true);
        setConfetti(true);
        setTimeout(() => setConfetti(false), 3500);
        setSubmissions([]);
        setTimeout(() => {
          setShowWinnerDialog(false);
          setRoundWinner(null);
        }, 3500);
      },

      // Server pushed a mid-round submissions update (another player submitted)
      onSubmissionsUpdate: (subs) => {
        setSubmissions(subs);
        log("submissions updated", subs);
      },
    });

    // Remove all socket listeners when the component unmounts
    return () => {
      socket.off();
    };
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────

  // Appends a message to the activity log shown in the bottom bar
  function log(msg, data) {
    setLogs((prev) => [...prev, `${msg}: ${JSON.stringify(data)}`]);
  }

  // Sends join-room event to the server and switches to the game view
  function handleJoin() {
    emitJoinRoom(roomCode, username);
    setRoomJoined(true);
  }

  // Tells the server to start the game (only the host should call this)
  function startGame() {
    emitStartGame(roomCode);
  }

  // Sends this player's chosen white card to the server and locks in the submission
  function submitCard() {
    emitSubmitCard(roomCode, chosenCard);
    setSubmitted(true);
  }

  // ── Derived values ─────────────────────────────────────────────────────────
  const czar = players.find((p) => p.isCzar);    // current Czar player object
  const recentLogs = logs.slice(-5);              // only show the last 5 log lines

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="pg-root">
      {/* Show the join screen until the player has entered a room */}
      {!roomJoined ? (
        <EnterRoomBox
          roomCode={roomCode}
          setRoomCode={setRoomCode}
          username={username}
          setUsername={setUsername}
          onJoin={handleJoin}
        />
      ) : (
        <div className="pg-shell">

          {/* Top Nav — Leave button | Room code (always centered) | Player avatar */}
          <nav className="pg-topnav">
            <button className="pg-btn-leave">&lt; Leave Room</button>
            <span className="pg-room-title">ROOM: {roomCode}</span>
            <div className="pg-player-info">
              <div className="pg-avatar">👤</div>
              <span>{username}</span>
            </div>
          </nav>

          {/* Main game area — left col (black card) + right col (white cards) */}
          <div className="pg-main">

            {/* Left column: round info, the black card, czar label, start button */}
            <div className="pg-left-col">
              <div className="pg-round-row">
                <span>Round [ ]</span>
                <div className="pg-timer"><span>[sec]</span><span>⏱</span></div>
              </div>

              {/* Black card — shows the prompt for this round */}
              <div className="pg-black-card">
                <p>{blackCard || "Waiting for game to start…"}</p>
                <span className="pg-card-tag">cards against humanity</span>
              </div>

              {/* Shows which player is the Czar this round */}
              <div className="pg-czar-label">
                {czar ? `Czar: ${czar.name}` : "[Czar Name]"}
              </div>

              {/* Start Game button — only visible before game begins */}
              {!gameStarted && (
                <button className="pg-btn-start" onClick={startGame}>
                  Start Game
                </button>
              )}
            </div>

            {/* Right column: submit row + card grid (hand, submissions, or waiting message) */}
            <div className="pg-right-col">

              {/* Submit row — button is disabled until a card is selected, or if already submitted/czar */}
              <div className="pg-submit-row">
                <button
                  className="pg-btn-submit"
                  disabled={!chosenCard || submitted || isCzar}
                  onClick={() => submitCard()}
                >
                  Submit
                </button>
                {/* Shows how many cards selected out of required (always 1 in standard rules) */}
                <div className="pg-progress">
                  <span>{chosenCard ? "1" : "0"}/1</span>
                  <span className="pg-check">✔</span>
                </div>
              </div>

              <div className="pg-cards-grid">
                {/* Player's hand — visible when not czar and hasn't submitted yet */}
                {!isCzar && !submitted &&
                  hand.map((c, i) => (
                    <button
                      key={i}
                      className={`pg-white-card${chosenCard === c ? " selected" : ""}`}
                      onClick={() => setChosenCard(c)}
                    >
                      <span>{c}</span>
                      <span className="pg-card-tag">cards against humanity</span>
                    </button>
                  ))
                }

                {/* Submissions — shown to the Czar (to pick winner) or to a player after they submit */}
                {((submitted && submissions.length > 0) || isCzar) &&
                  submissions.map((s, i) => (
                    <button
                      key={i}
                      className="pg-white-card"
                      disabled={!isCzar}
                      onClick={() => isCzar && emitPickWinner(roomCode, s.playerId)}
                    >
                      <span>{s.card}</span>
                      <span className="pg-card-tag">cards against humanity</span>
                    </button>
                  ))
                }

                {/* Waiting message for regular players after submitting, before czar picks */}
                {submitted && submissions.length === 0 && !isCzar && (
                  <div className="pg-waiting">
                    Waiting for players to submit… *cue elevator music*
                  </div>
                )}

                {/* Waiting message for the Czar before any submissions arrive */}
                {isCzar && submissions.length === 0 && (
                  <div className="pg-czar-wait">
                    <span className="pg-czar-wait-title">You are the Czar</span>
                    <span className="pg-czar-wait-sub">Waiting for players to submit *cue elevator music*</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom bar — Players table | Activity log | Leaderboard */}
          <div className="pg-bottom">

            {/* Players panel — lists all players in the room with their scores */}
            <div className="pg-players-panel">
              <table>
                <thead>
                  <tr>
                    <th>Players</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((p) => (
                    <tr key={p.id}>
                      {/* Czar is highlighted in purple with a star */}
                      <td className={p.isCzar ? "pg-czar-player" : ""}>
                        {p.name}{p.isCzar ? " ★" : ""}
                      </td>
                      <td>{p.score ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr><td>{players.length} players</td></tr>
                </tfoot>
              </table>
            </div>

            {/* Activity log — last 5 events, oldest entry dimmed */}
            <div className="pg-log-panel">
              <h3>Activity</h3>
              {recentLogs.map((line, i) => (
                <p key={i} className={i < recentLogs.length - 1 ? "dim" : ""}>
                  {line}
                </p>
              ))}
            </div>

            {/* Leaderboard — top 3 players sorted by score */}
            <div className="pg-leaderboard-panel">
              <h3>Leaderboard</h3>
              {[...players]
                .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
                .slice(0, 3)
                .map((p, i) => (
                  <div key={p.id} className="pg-leaderboard-row">
                    <span>{["🥇", "🥈", "🥉"][i]} {p.name}</span>
                    <span>{p.score ?? 0}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Winner overlay — shown for 3.5s after the Czar picks a winner */}
          {showWinnerDialog && (
            <div className="pg-winner-overlay">
              <div className="pg-winner-box">
                <h2>🎉 {roundWinner} has Humor! 🎉</h2>
                <p>Onto the next round…</p>
              </div>
            </div>
          )}

          {/* Confetti explosion — fires alongside the winner overlay */}
          {confetti && (
            <div className="pg-confetti">
              <ConfettiExplosion duration={3000} />
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default Playground;
