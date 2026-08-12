import { useState } from "react";

export default function Card({ title, accentColor = "border-ink", children, preview, collapsible = false }) {
  const [isOpen, setIsOpen] = useState(!collapsible);
  return (
    <article className={`saas-card student-card bg-white/90 border-l-4 ${accentColor} p-5 mb-4`}>
      {title && (
        <div className="flex items-start gap-3 mb-3">
          {collapsible ? <button onClick={() => setIsOpen((open) => !open)} className="text-left flex-1 group" aria-expanded={isOpen}><h3 className="font-display text-base text-ink tracking-tight group-hover:text-violet-700">{title}</h3>{preview && <p className="text-xs text-slate mt-1">{preview}</p>}</button> : <div className="flex-1"><h3 className="font-display text-base text-ink tracking-tight">{title}</h3>{preview && <p className="text-xs text-slate mt-1">{preview}</p>}</div>}
          {collapsible && <button onClick={() => setIsOpen((open) => !open)} className="rounded-full bg-violet-100 text-violet-700 size-7 text-sm" aria-label={`Toggle ${title}`}>{isOpen ? "−" : "+"}</button>}
        </div>
      )}
      {isOpen && <div className="font-body text-sm text-ink/90">{children}</div>}
    </article>
  );
}
