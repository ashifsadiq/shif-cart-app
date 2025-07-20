import React, { useEffect, useState } from "react";

export const CountdownTimer: React.FC<{ endTime: string | Date }> = ({ endTime }) => {
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    const end = new Date(endTime).getTime();
    const update = () => setRemaining(Math.max(0, end - Date.now()));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [endTime]);

  const sec = Math.floor(remaining / 1000) % 60;
  const min = Math.floor(remaining / 1000 / 60) % 60;
  const hr = Math.floor(remaining / 1000 / 60 / 60);

  return <span className="font-mono text-sm text-red-600">{hr}h {min}m {sec}s</span>;
};
