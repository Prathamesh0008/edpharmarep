export default function EuropeBounceCircle() {
  return (
    <div className="relative flex justify-center items-center py-20">

      {/* ANIMATED BOUNCING CIRCLE */}
      <div className="
        w-50 h-70 
        sm:w-56 sm:h-56 
        md:w-45 md:h-45 
        rounded-full 
        flex items-center justify-center text-center
        text-white text-xl sm:text-2xl font-bold
        shadow-xl drop-shadow-2xl
        bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500
        animate-bounceSmooth
      ">
        EUROPE<br />TO<br />EUROPE
      </div>

      {/* CUSTOM BOUNCE ANIMATION */}
      <style>{`
        @keyframes bounceSmooth {
          0%   { transform: translateY(0); }
          20%  { transform: translateY(-15px); }
          40%  { transform: translateY(0); }
          60%  { transform: translateY(-8px); }
          80%  { transform: translateY(0); }
          100% { transform: translateY(0); }
        }

        .animate-bounceSmooth {
          animation: bounceSmooth 3s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
}
