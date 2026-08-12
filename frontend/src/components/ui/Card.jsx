export default function Card({ title, accentColor = "border-ink", children }) {
  return (
    <div className={`bg-white border-l-4 ${accentColor} rounded-r-md shadow-sm p-5 mb-4`}>
      {title && (
        <h3 className="font-display text-base text-ink mb-3 tracking-tight">
          {title}
        </h3>
      )}
      <div className="font-body text-sm text-ink/90">{children}</div>
    </div>
  );
}
