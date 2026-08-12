import { useState } from "react";
import Card from "../ui/Card";
import { quotes } from "../../data/quotes";

export default function QuoteCard() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * quotes.length));

  return (
    <Card title="Quote" accentColor="border-mustard">
      <p className="italic text-ink/80 font-body">"{quotes[index]}"</p>
      <button onClick={() => setIndex((current) => (current + 1 + Math.floor(Math.random() * (quotes.length - 1))) % quotes.length)} className="text-xs font-mono text-moss mt-3 hover:underline">Another quote</button>
    </Card>
  );
}
