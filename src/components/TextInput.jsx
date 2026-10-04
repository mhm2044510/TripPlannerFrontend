export default function TextInput({ label, placeholder, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </span>
      <input className="field" placeholder={placeholder} type={type} />
    </label>
  )
}
