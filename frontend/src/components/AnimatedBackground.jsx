
export default function AnimatedBackground() {
  return (
    <div className="area" aria-hidden="true">
      <ul className="circles">
        {Array.from({ length: 10 }, (_, index) => (
          <li key={index} />
        ))}
      </ul>
    </div>
  );
}
