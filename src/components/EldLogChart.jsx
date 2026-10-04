import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";

const levels = { OFF_DUTY: 3, SLEEPER: 2, DRIVING: 1, ON_DUTY: 0 };
const labels = { 0: "ON DUTY", 1: "DRIVING", 2: "SLEEPER", 3: "OFF DUTY" };

const totalCards = [
  ["OFF_DUTY", "Off duty", "text-slate-300"],
  ["SLEEPER", "Sleeper", "text-violet-300"],
  ["DRIVING", "Driving", "text-blue-300"],
  ["ON_DUTY", "On duty", "text-amber-300"],
];

// 19.54 -> "19h 33m", 0 -> "0h", 0.5 -> "30m"
function formatDuration(hours = 0) {
  const total = Math.round(hours * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  if (m) return `${m}m`;
  return "0h";
}

// 6.5 -> "06:30" (hour within the day, 0-24)
function formatClock(hours) {
  const total = Math.round(hours * 60);
  if (total >= 1440) return "24:00";
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// One day's events -> points for a step chart, positioned 0-24
function buildChartData(day) {
  const offset = (day.day - 1) * 24; // events use absolute trip hours
  const events = day.events ?? [];

  const points = events.map((event) => ({
    hour: Math.min(Math.max(event.start - offset, 0), 24),
    level: levels[event.status],
    event: event.label,
  }));

  // close the line at midnight with the last status
  const last = events[events.length - 1];
  if (last) {
    points.push({
      hour: 24,
      level: levels[last.status],
      event: last.label,
    });
  }
  return points;
}

function DayChart({ day, totalDays }) {
  const chartData = buildChartData(day);

  return (
    <article className="rounded-3xl border border-white/10 bg-slate-900 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            ELD log
          </p>
          <h2 className="mt-2 text-lg font-bold">Day {day.day} status graph</h2>
        </div>
        <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-400">
          Day {day.day} of {totalDays}
        </span>
      </div>

      <div className="mt-5 h-72 min-w-0">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart
            data={chartData}
            margin={{ bottom: 8, left: 12, right: 12, top: 8 }}
          >
            <CartesianGrid stroke="rgba(148,163,184,.12)" />
            <XAxis
              axisLine={false}
              dataKey="hour"
              domain={[0, 24]}
              tick={{ fill: "#64748b", fontSize: 10 }}
              tickLine={false}
              ticks={[0, 3, 6, 9, 12, 15, 18, 21, 24]}
              type="number"
            />
            <YAxis
              axisLine={false}
              domain={[0, 3]}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              tickFormatter={(value) => labels[value]}
              tickLine={false}
              ticks={[0, 1, 2, 3]}
              width={68}
            />
            <ChartTooltip
              contentStyle={{
                background: "#020617",
                border: "1px solid rgba(255,255,255,.1)",
                borderRadius: 12,
                color: "#e2e8f0",
              }}
              formatter={(_, __, item) => [item.payload.event, "Status"]}
              labelFormatter={(value) => formatClock(Number(value) * 1)}
            />
            <Line
              activeDot={{
                fill: "#a3e635",
                r: 5,
                stroke: "#020617",
                strokeWidth: 2,
              }}
              dataKey="level"
              dot={false}
              stroke="#a3e635"
              strokeWidth={3}
              type="stepAfter"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {totalCards.map(([key, label, color]) => (
          <div className="rounded-xl bg-slate-950/60 px-3 py-2.5" key={key}>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              {label}
            </p>
            <p className={`mt-1 text-sm font-bold ${color}`}>
              {formatDuration(day.totals?.[key])}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function EldLogChart({ days = [] }) {
  if (!days.length) return null;

  return (
    <div className="grid gap-6 xl:grid-cols-1">
      {days.map((day) => (
        <DayChart day={day} key={day.day} totalDays={days.length} />
      ))}
    </div>
  );
}
