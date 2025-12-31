export default function HexBg() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.15] animate-pulse">
      <svg
        viewBox="0 0 800 400"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="#0ea5e9" strokeWidth="2" fill="none">
          <polygon points="80,60 110,60 125,85 110,110 80,110 65,85" />
          <polygon points="140,60 170,60 185,85 170,110 140,110 125,85" />
          <polygon points="110,20 140,20 155,45 140,70 110,70 95,45" />
        </g>

        <circle cx="260" cy="120" r="6" fill="#38bdf8" />
        <circle cx="340" cy="160" r="4" fill="#0ea5e9" />
        <circle cx="420" cy="100" r="7" fill="#38bdf8" />
      </svg>
    </div>
  );
}
