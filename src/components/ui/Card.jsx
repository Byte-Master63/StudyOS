export default function Card({ title, children }) {
  return (
    <div>
      {title && <h3>{title}</h3>}
      <div>{children}</div>
    </div>
  );
}
