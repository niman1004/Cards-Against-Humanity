import React, { useEffect, useState } from "react";
import "../components/css_aryan/general.css";
import "../components/css_aryan/homepage.css";
import "../components/css_aryan/styles.css";
import { Link } from "react-router-dom";
import Typewriter from "./Typewriter";

//dont touch any of the css or it will break :)

function Homepage() {
  const [hovered, setHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setClosing(false);
    }, 300);
  };

  const taglines = [
    "a party game for horrible people.",
    "do NOT feel free to laugh.",
    "weird to have this as your favourite game.",
    "your favourite guilty pleasure.",
    "you again? ew.",
    "your presence here says a lot about you.",
    '"erm actually! it\'s called dark humor 🤓"',
    "here again? to be humiliated? is this a kink?",
    "didn't know we allowed [REDACTED] here.",
  ];

  return (
    <div className="flex items-center justify-center h-screen w-[100%]">
      <div className="flex flex-row w-full gap-[15rem] justify-around">
        <div className="flex flex-col  m-0 p-0 items-start mr-[100px] mt-[100px] mb-[100px]">
          <h1 className="font-bold text-[10rem] p-0 leading-none">cards </h1>
          <h1 className="font-bold text-[10rem] p-0 mt-0 leading-none">
            against{" "}
          </h1>
          <h1 className="font-bold text-[10rem] p-0 mt-0 leading-none">
            {" "}
            humanity
          </h1>
          {/* <h2 className="mt-2 text-3xl">{tagline}</h2> */}
          <Typewriter words={taglines} />
        </div>

        <div className="cards-container gap-11 ml-20">
          {/* Card 1 */}
          <div
            className={`card1 cards ${hovered ? "card1-active" : ""}`}
            onMouseOver={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className="card-menu">
              <ul>
                <li>room settings</li>
                <li>about</li>
                <li
                  onClick={() => setShowModal(true)}
                  style={{ cursor: "pointer" }}
                >
                  how to play
                </li>
              </ul>
            </div>
            <div className="card-tag">cards against humanity</div>
          </div>

          {/* Card 2 */}
          <div className={`card2 cards ${hovered ? "card2-passive" : ""}`}>
            <div className="card-menu">
              <ul>
                <li>play</li>
                <li>
                  <Link to="/playground" className="link-style">
                    join room
                  </Link>
                </li>
                <li>create room</li>
              </ul>
            </div>
            <div className="card-tag">cards against humanity</div>
          </div>
        </div>
      </div>
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          className={closing ? "modal-overlay closing" : "modal-overlay"}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "2px solid white",
              borderRadius: "2rem",
              padding: "3rem",
              width: "70vw",
              height: "70vh",
              color: "white",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* header row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <div style={{ flex: 1 }}></div>
              <h2 style={{ fontSize: "4rem", margin: 0 }}>how to play</h2>
              <div
                style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
              >
                <button
                  onClick={closeModal}
                  style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    fontSize: "2rem",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* scrollable content */}
            <div
              style={{
                overflowY: "auto",
                flex: 1,
                fontSize: "2rem",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <ol>
                <li>
                  draw a black card: the card czar draws a black card and reads
                  it aloud. this card usually contains a fill-in-the-blank
                  statement or a question.
                </li>
                <li>
                  select answer cards: all other players choose one (or more,
                  depending on the black card) white answer card from their hand
                  that they think best responds to the prompt.
                </li>
                <li>
                  submit answers: once everyone has chosen their answer, players
                  pass their selected white cards face down to the card czar.
                </li>
                <li>
                  czar reads answers: the card czar shuffles the submitted white
                  cards and reads them aloud in response to the black card.
                </li>
                <li>
                  czar picks the best answer: after reading all the responses,
                  the card czar chooses the funniest or best answer. the player
                  who submitted that card wins the round.
                </li>
                <li>
                  score points: the winning player receives 1 point (or 1
                  “awesome card” as a token, if you prefer).
                </li>
                <li>
                  next round: the role of the card czar rotates clockwise, and
                  everyone draws back up to 10 white cards.
                </li>
                <li>
                  end of game: continue playing until a set number of points is
                  reached (e.g., 5 or 10) or until players decide to stop. the
                  player with the most points wins!
                </li>
              </ol>
              tips:
              <ul>
                <li>
                  rules: feel free to create house rules to suit your group’s
                  style. this could include adding in bonus points for
                  particularly clever answers or allowing multiple white cards
                  for longer prompts.
                </li>
                <li>
                  keep it fun: remember, the spirit of the game is to be
                  humorous and enjoy the absurdity!
                </li>
                <li>
                  ps: please don't cancel people for this. it's a game ffs
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
