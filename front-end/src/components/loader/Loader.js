// components/Loader.jsx
export default function Loader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/20 backdrop-blur-[2px] z-[9999]">
      {/* Container for the Spinner */}
      <div className="relative flex items-center justify-center">
        {/* Outer Glow / Pulse */}
        <div className="absolute h-12 w-12 animate-ping rounded-full bg-primary opacity-10"></div>

        {/* Main Spinning Ring */}
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-primary"></div>

        {/* Stationary Inner Circle for stability look */}
        <div className="absolute h-6 w-6 rounded-full border border-slate-100/50"></div>
      </div>

      {/* Subtle Loading Text */}
      <span className="mt-4 text-[10px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
        Loading ...
      </span>
    </div>
  );
}
