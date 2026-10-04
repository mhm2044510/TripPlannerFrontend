import Icon from "./Icon";
export default function CitySelect({ label, value, onChange, cities }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-500">
          <Icon className="size-4">
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </Icon>
        </span>
        <select
          className="field appearance-none pl-11 pr-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {Object.keys(cities).map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
          <Icon className="size-4">
            <path d="m6 9 6 6 6-6" />
          </Icon>
        </span>
      </div>
    </label>
  );
}
