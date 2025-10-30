import { useState, useEffect } from "react";

export default function Typewriter({ words }) {
  const [index, setIndex] = useState(0);       // which word
  const [subIndex, setSubIndex] = useState(0); // letter count
  const [deleting, setDeleting] = useState(false); // type/delete state
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    // stop when typing finished
    if (subIndex === words[index].length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), 1000); // pause before deleting
      return;
    }

    // stop when deleting finished
    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % words.length); // next word
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex(prev => prev + (deleting ? -1 : 1));
    }, deleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, words, index]);

  // cursor blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(prev => !prev);
    }, 500);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <h2 className="mt-2 text-3xl">
      {words[index].substring(0, subIndex)}
      <span style={{ opacity: blink ? 1 : 0 }}>|</span>
    </h2>
  );
}
