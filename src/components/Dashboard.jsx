import Mark from "./Mark";
import Icon from "./Icon";
import RouteMap from "./RouteMap";
import TripTimelineChart from "./TripTimelineChart";
import EldLogChart from "./EldLogChart";
import EventTable from "./EventTable";
import TripForm from "./TripForm";
import useTripPlanner from "../hooks/useTripPlanner";

// 6.5 -> "06:30"
const fmt = (h) => {
  let hours = Math.floor(h);
  let minutes = Math.round((h - hours) * 60);
  if (minutes === 60) {
    hours += 1;
    minutes = 0;
  }
  return `${String(hours % 24).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const statusColors = {
  DRIVING: "bg-sky-400",
  ON_DUTY: "bg-amber-400",
  OFF_DUTY: "bg-violet-400",
  SLEEPER: "bg-indigo-400",
};

export default function Dashboard({ onSignOut }) {
  const {
    submit,
    submitted,
    currentPoint,
    pickupPoint,
    dropoffPoint,
    route,
    distance,
    driveHours,
    totalHours,
    cycleEnd,
    tripDays,
    events,
    days,
    planned,
    isLoading,
    isFetching,
    error,
  } = useTripPlanner();

  const { current_location: current, pickup, dropoff } = submitted.locations;
  const rules = submitted.rules;

  // the timeline shows trip activity only (hide the OFF_DUTY filler blocks)
  const timelineEvents = events.filter((e) => !e.filler);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-[1000] border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Mark />
          <div className="flex items-center gap-3">
            <button
              aria-label="Sign out"
              className="grid size-9 place-items-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white "
              onClick={onSignOut}
            >
              <Icon>
                <path d="M10 17l5-5-5-5M15 12H3M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
              </Icon>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-400">
              Trip workspace
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Build your trip plan
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Enter your pickup, drop-off, and current cycle hours to generate
              your route, driving schedule, rest breaks, and ELD logs.
            </p>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-400">
            {error.message}
          </p>
        )}
        {isLoading && (
          <p className="mb-4 text-sm text-slate-400">
            Planning trip… the first request can take about 30 seconds while the
            server wakes up.
          </p>
        )}

        <div className="grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">
          <TripForm loading={isFetching} onSubmit={submit} />

          <section className="min-w-0 space-y-6">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
              <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-lime-400 shadow-[0_0_12px_rgba(163,230,53,.75)]" />
                    <h2 className="font-bold">Route preview</h2>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {current} → {pickup} → {dropoff}
                  </p>
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="text-slate-500">
                    Distance{" "}
                    <strong className="ml-1 text-slate-200">
                      {distance} mi
                    </strong>
                  </span>
                  <span className="text-slate-500">
                    Drive{" "}
                    <strong className="ml-1 text-slate-200">
                      {driveHours.toFixed(1)} hr
                    </strong>
                  </span>
                </div>
              </div>
              <div className="relative min-h-[360px] bg-slate-950 sm:min-h-[470px]">
                {currentPoint && pickupPoint && dropoffPoint && (
                  <RouteMap
                    current={currentPoint}
                    dropoff={dropoffPoint}
                    pickup={pickupPoint}
                    route={route}
                  />
                )}
                <div className="pointer-events-none absolute bottom-4 left-4 z-[500] flex gap-2 rounded-xl border border-white/10 bg-slate-950/90 p-2 text-[10px] font-bold backdrop-blur">
                  {[
                    ["bg-sky-400", "Current"],
                    ["bg-amber-400", "Pickup"],
                    ["bg-lime-400", "Drop-off"],
                  ].map(([color, label]) => (
                    <span
                      className="flex items-center gap-1.5 px-1.5"
                      key={label}
                    >
                      <span className={`size-2 rounded-full ${color}`} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {planned && (
              <>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {[
                    ["Total distance", `${distance} mi`, "route"],
                    ["Trip duration", `${totalHours.toFixed(1)} hr`, "clock"],
                    [
                      "Cycle at arrival",
                      `${cycleEnd.toFixed(1)} / ${rules.maxCycleHours} hr`,
                      "cycle",
                    ],
                    [
                      "Trip days",
                      `${tripDays} day${tripDays > 1 ? "s" : ""}`,
                      "calendar",
                    ],
                  ].map(([label, value, icon]) => (
                    <article
                      className="rounded-2xl border border-white/10 bg-slate-900 p-4"
                      key={label}
                    >
                      <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-white/5 text-lime-400">
                        <span className="text-[10px] font-black uppercase">
                          {icon.slice(0, 2)}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-500">
                        {label}
                      </p>
                      <p className="mt-1 text-lg font-bold">{value}</p>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>

        {planned && (
          <section className="mt-6 space-y-6">
            <TripTimelineChart days={days} />
            <div className="grid gap-6 grid-cols-1">
              <EldLogChart days={days} events={events} />
            </div>
            <EventTable
              current={current}
              dropoff={dropoff}
              events={events}
              pickup={pickup}
            />
          </section>
        )}
      </main>

      <footer className="mt-10 border-t border-white/10">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Mark />
          <p className="text-xs text-slate-600">© 2025 NightRoute Systems</p>
        </div>
      </footer>
    </div>
  );
}
