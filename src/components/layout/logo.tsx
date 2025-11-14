export function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 20,80 Q 50,20 80,80"
        stroke="hsl(var(--primary))"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 30,60 Q 50,40 70,60"
        stroke="hsl(var(--accent))"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="50" cy="25" r="8" fill="hsl(var(--primary))" />
    </svg>
  );
}
