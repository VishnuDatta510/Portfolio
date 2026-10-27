"use client";
import { useEffect, useState } from "react";

const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** Live clock in IST; renders a placeholder on the server. */
export default function LocalTime() {
  const [now, setNow] = useState("--:--:--");

  useEffect(() => {
    const tick = () => setNow(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return <time suppressHydrationWarning>{now}</time>;
}
