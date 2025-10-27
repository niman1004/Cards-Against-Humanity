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
import BlackCard from "./card_components/BlackCard.jsx";
import WhiteCardBtn from "./card_components/WhiteCardBtn.jsx";
import Container from "./container/Container.jsx";

function Playground() {
  const [roomCode, setRoomCode] = useState("");
  const [username, setUsername] = useState("");
  const [players, setPlayers] = useState([]);
  const [hand, setHand] = useState([]);
  const [blackCard, setBlackCard] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isCzar, setIsCzar] = useState(false);
  const [logs, setLogs] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [roomJoined, setRoomJoined] = useState(false);
  const [chosenCard, setChosenCard] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    registerListeners({
      onPlayerListUpdate: (players) => {
        setPlayers(players);
        log(
          "players updated",
          players.map((p) => p.name)
        );
      },
      onGameStarted: () => {
        setGameStarted(true);
        log("game started for everyone!");
      },
      onNewRound: (data) => {
        setSubmitted(false);
        setChosenCard(null);
        setBlackCard(data.blackCard);
        setPlayers(data.players);
        const me = data.players.find((p) => p.id === socket.id);
        setIsCzar(me?.isCzar || false);
        log("new round started", data);
      },
      onUpdateHand: (hand) => {
        setHand(hand);
        log("your hand updated", hand);
      },
      onJudgeRound: (subs) => {
        setSubmissions(subs);
        log("you are czar", subs);
      },
      onRoundResult: (result) => {
        log("round result", result);
        setSubmissions([]);
      },
      onSubmissionsUpdate: (subs) => {
        setSubmissions(subs);
        log("submissions updated", subs);
      },
    });

    return () => {
      socket.off();
    };
  }, []);

  function log(msg, data) {
    setLogs((prev) => [...prev, `${msg}: ${JSON.stringify(data)}`]);
  }

  function handleJoin() {
    emitJoinRoom(roomCode, username);
    setRoomJoined(true);
  }

  function startGame() {
    emitStartGame(roomCode);
  }

  function submitCard() {
    emitSubmitCard(roomCode, chosenCard);
    setSubmitted(true);
  }

  return (
    <div className=" flex items-start justify-center w-screen h-screen text-2xl text-white font-bold ">
      {!roomJoined ? (
        <EnterRoomBox
          roomCode={roomCode}
          setRoomCode={setRoomCode}
          username={username}
          setUsername={setUsername}
          onJoin={handleJoin}
        />
      ) : (
        <div className="w-full  bg-[#101010] rounded-lg shadow-lg p-6 flex flex-col gap-6">
          {/* Top Bar */}
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-10">
              <p className="font-bold text-2xl">Username: {username}</p>
              <p className=" text-2xl text-gray-400">Room: {roomCode}</p>
            </div>
            {!gameStarted && (
              <button
                className="px-4 py-2 bg-[#804385] rounded-md hover:bg-[#69396e]"
                onClick={startGame}
              >
                Start Game
              </button>
            )}
          </div>

          {/* Players */}
          <div className="bg-[#1a1a1a] p-4 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2 mt-1">
              Players ({players.length})
            </h2>
            <ul className=" ml-3 text-2xl flex flex-row gap-5">
              {players.map((p) => (
                <li
                  key={p.id}
                  className={`${p.isCzar ? "text-[#c084fc]" : "text-white"}`}
                >
                  {p.name} {p.isCzar ? "(Czar)" : ""} — score: {p.score}
                </li>
              ))}
            </ul>
          </div>

          {/* Game Area */}
          {/* black card */}
          {gameStarted && (
            <div className="bg-[#1a1a1a] p-4 rounded-lg flex flex-row gap-4">
              <div className="p-8 flex flex-col">
                <BlackCard blackCard={blackCard} />
                <button
                  className="bg-[#804385] px-4 py-2 rounded-md hover:bg-[#69396e] mt-3"
                  disabled={!chosenCard}
                  onClick={() => submitCard()}
                >
                  Submit
                </button>
              </div>

              {!isCzar && !submitted && (
                <div>
                  <h2 className="font-bold mb-2">Your Hand</h2>
                  <div className="flex flex-wrap gap-2">
                    {hand.map((c, i) => (
                      <WhiteCardBtn
                        key={i}
                        disabled={chosenCard === c}
                        text={c}
                        viewOnly={false}
                        onClick={() => setChosenCard(c)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {((submitted && submissions.length > 0) || isCzar) && (
                <div>
                  <h2 className="font-bold mb-2">
                    {submissions.length == 0
                      ? "Waiting for players to submit  *cue elevator music*"
                      : "Submissions"}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {submissions.map((s, i) => (
                      <WhiteCardBtn
                        key={i}
                        disabled={!isCzar}
                        onClick={() => emitPickWinner(roomCode, s.playerId)}
                        text={s.card}
                        viewOnly={!isCzar}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Logs */}
          <div className="bg-[#1a1a1a] p-3 rounded-lg h-40 overflow-y-auto text-2xl text-[#804385] text-center font-mono">
            {logs.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Playground;
