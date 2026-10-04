export default function Loader({ size = "md", text = "Loading..." }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-7 w-7 border-2",
    lg: "h-10 w-10 border-[3px]",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-white/10 border-t-lime-400`}
      />

      {text && (
        <span className="text-xs font-semibold tracking-wide text-slate-500">
          {text}
        </span>
      )}
    </div>
  );
}
