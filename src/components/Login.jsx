import Mark from "./Mark"
import Icon from "./Icon"
import TextInput from "./TextInput"

export default function Login({ onLogin }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 py-10 text-white">
      <div className="login-glow absolute inset-0" />
      <div className="grid-overlay absolute inset-0 opacity-25" />
      <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-9">
        <Mark />
        <div className="mt-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-400">
            Welcome back
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready for the road?
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Sign in to plan your route and keep every mile compliant.
          </p>
        </div>
        <form
          className="mt-8 space-y-5"
          onSubmit={(event) => {
            event.preventDefault()
            onLogin()
          }}
        >
          <TextInput
            label="Email or driver ID"
            placeholder="driver@nightroute.com"
          />
          <TextInput
            label="Password"
            placeholder="Enter anything"
            type="password"
          />
          <button className="primary-button" type="submit">
            Enter command center
            <Icon className="size-4">
              <path d="m9 18 6-6-6-6" />
            </Icon>
          </button>
        </form>
        <p className="mt-5 text-center text-xs text-slate-500">
          Demo mode — any credentials will work.
        </p>
      </section>
    </main>
  )
}
