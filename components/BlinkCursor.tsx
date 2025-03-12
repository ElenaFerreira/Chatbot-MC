import React from "react";

interface BlinkCursorProps {
  text: string;
}

const BlinkCursor: React.FC<BlinkCursorProps> = ({ text }) => {
  return (
    <p>
      <span className="text-white/0">{text}</span>
      <span className="animate-blink">_</span>
    </p>
  );
};

export default BlinkCursor;
