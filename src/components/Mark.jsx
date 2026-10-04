import Icon from "./Icon";

export default function Mark() {
  return (
    <div className="flex items-center gap-3.5 select-none">
      {/* Icon Container with Glow & Gradient */}
      <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-lime-300 to-lime-500 text-slate-950 shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-transform duration-200 hover:scale-105">
        <Icon className="size-5">
          {/* Modern Semi-Truck / Logistics SVG Path */}
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <path d="M15 18H9" />
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.63l-2.4-3A1 1 0 0 0 18.6 9H14v9" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="17" cy="18" r="2" />
        </Icon>
      </div>

      {/* Typography Section */}
      <div className="flex flex-col justify-center">
        <div className="text-base font-extrabold leading-none tracking-tight text-white antialiased">
          Night <span className="text-lime-400">Route</span>
        </div>
        <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-slate-400/90">
          ELD Command
        </div>
      </div>
    </div>
  );
}
