import React, { useEffect, useState } from "react";
import "../components/css_aryan/general.css";
import "../components/css_aryan/homepage.css";
import "../components/css_aryan/styles.css"
import { Link } from "react-router-dom";


//dont touch any of the css or it will break :)

function Homepage() {
  const [tagline, setTagline] = useState("");
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const taglines = [
      "A party game for horrible people.",
      "Do NOT feel free to laugh.",
      "Weird to have this as your favourite game.",
      "Your favourite guilty pleasure.",
      "You again? Ew.",
      "Your presence here says a lot about you.",
      '"Erm Actually! It\'s called Dark Humor 🤓"',
      "Here again? Do you like being insulted?",
    ];

    const randomIndex = Math.floor(Math.random() * taglines.length);
    setTagline(taglines[randomIndex]);
  }, []);

  return (
    <div className="flex flex-row w-full gap-11 justify-around">
      <div className="flex flex-col  m-0 p-0 items-start mr-[100px] mt-[100px] mb-[100px]">
        <h1 className="font-bold text-[10rem] p-0 leading-none">
          cards </h1>
         <h1 className="font-bold text-[10rem] p-0 mt-0 leading-none">against </h1> 
         <h1 className="font-bold text-[10rem] p-0 mt-0 leading-none"> humanity
        </h1>
        <h2 className="mt-2 text-3xl">{tagline}</h2>
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
              <li>Room Settings</li>
              <li>About</li>
            </ul>
          </div>
          <div className="card-tag">cards against humanity</div>
        </div>

        {/* Card 2 */}
        <div
          className={`card2 cards ${hovered ? "card2-passive" : ""}`}
        >
          <div className="card-menu">
            <ul>
              <li>
                <Link to="/playground"  className="link-style">Play</Link>
              </li>
              <li>Join Room</li>
            </ul>
          </div>
          <div className="card-tag">cards against humanity</div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
