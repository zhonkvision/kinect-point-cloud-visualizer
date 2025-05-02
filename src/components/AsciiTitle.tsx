
import React, { useEffect, useState } from 'react';

const AsciiTitle: React.FC = () => {
  const [frame, setFrame] = useState(0);
  const totalFrames = 6;

  // ASCII art frames for animation
  const asciiFrames = [
    `
┏━━┓╻ ╻┏━┓┏┓╻╻┏    ╻ ╻╻┏━┓╻┏━┓┏┓╻
┃  ┣┫ ┃┃ ┃┃┗┫┃┃    ┃┏┛┃┗━┓┃┃ ┃┃┗┫
┗━━┛┗━┛┗━┛╹ ╹╹┗━┛  ┗┛ ╹┗━┛╹┗━┛╹ ╹
    `,
    `
┏━━┓╻ ╻┏━┓┏┓╻╻┏━┓  ╻ ╻╻┏━┓╻┏━┓┏┓╻
┃  ┣┫ ┃┃ ┃┃┗┫┃┃ ┃  ┃┏┛┃┗━┓┃┃ ┃┃┗┫
┗━━┛┗━┛┗━┛╹ ╹╹┗━┛  ┗┛ ╹┗━┛╹┗━┛╹ ╹
    `,
    `
┏━━┓╻ ╻┏━┓┏┓╻╻┏━┓  ╻ ╻╻┏━┓╻┏━┓┏┓╻╻
┃  ┣┫ ┃┃ ┃┃┗┫┃┃ ┃  ┃┏┛┃┗━┓┃┃ ┃┃┗┫┃
┗━━┛┗━┛┗━┛╹ ╹╹┗━┛  ┗┛ ╹┗━┛╹┗━┛╹ ╹╹
    `,
    `
┏━━┓╻ ╻┏━┓┏┓╻╻┏━┓  ╻ ╻╻┏━┓╻┏━┓┏┓╻╻┏━┓
┃  ┣┫ ┃┃ ┃┃┗┫┃┃ ┃  ┃┏┛┃┗━┓┃┃ ┃┃┗┫┃┃ ┃
┗━━┛┗━┛┗━┛╹ ╹╹┗━┛  ┗┛ ╹┗━┛╹┗━┛╹ ╹╹┗━┛
    `,
    `
┏━━┓╻ ╻┏━┓┏┓╻╻┏━┓  ╻ ╻╻┏━┓╻┏━┓┏┓╻╻┏━┓╻┏━┓
┃  ┣┫ ┃┃ ┃┃┗┫┃┃ ┃  ┃┏┛┃┗━┓┃┃ ┃┃┗┫┃┃ ┃┃┃ ┃
┗━━┛┗━┛┗━┛╹ ╹╹┗━┛  ┗┛ ╹┗━┛╹┗━┛╹ ╹╹┗━┛╹┗━┛
    `,
    `
┏━━┓╻ ╻┏━┓┏┓╻╻┏━┓  ╻ ╻╻┏━┓╻┏━┓┏┓╻
┃  ┣┫ ┃┃ ┃┃┗┫┃┃ ┃  ┃┏┛┃┗━┓┃┃ ┃┃┗┫
┗━━┛┗━┛┗━┛╹ ╹╹┗━┛  ┗┛ ╹┗━┛╹┗━┛╹ ╹
    `
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % totalFrames);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 p-4 z-10">
      <pre className="text-cyan-400 font-mono text-xs sm:text-sm md:text-base whitespace-pre leading-none">
        {asciiFrames[frame]}
      </pre>
    </div>
  );
};

export default AsciiTitle;
