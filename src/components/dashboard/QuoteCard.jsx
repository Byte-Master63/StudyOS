import Card from "../ui/Card";
import { quotes } from "../../data/quotes";
import { getDailyIndex } from "../../utils/getDailyIndex";

export default function QuoteCard() {
  const todayQuote = quotes[getDailyIndex(quotes.length)];

  return (
    <Card title="Quote" accentColor="border-mustard">
      <p className="italic text-ink/80 font-body">"{todayQuote}"</p>
    </Card>
  );
}
