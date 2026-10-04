import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";

const colors = {
  DRIVING: "#3b82f6",
  PICKUP: "#10b981",
  DROPOFF: "#f43f5e",
  BREAK: "#f59e0b",
  RESTART: "#8b5cf6",
  "OFF DUTY": "#475569",
};
const fallbackColor = "#64748b";

const legend = [
  ["bg-blue-500", "Driving"],
  ["bg-emerald-500", "Pickup"],
  ["bg-rose-500", "Drop-off"],
  ["bg-amber-500", "Break"],
  ["bg-violet-500", "Restart"],
  ["bg-slate-600", "Off duty"],
];

// 1.5 -> "1h 30m", 0.5 -> "30m", 13 -> "13h"
function formatDuration(hours) {
  const total = Math.round(hours * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

// hour within the day -> "06:30" (24 -> "24:00")
function formatClock(hours) {
  const total = Math.round(hours * 60);
  if (total >= 1440) return "24:00";
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const clamp = (value) => Math.min(Math.max(value, 0), 24);

// days[] -> one row per day; each event becomes segment i (d0, d1, ...)
function buildRows(days) {
  const rows = days.map((day) => {
    const offset = (day.day - 1) * 24; // events use absolute trip hours
    const segments = (day.events ?? [])
      .map((event) => {
        const start = clamp(event.start - offset);
        const end = clamp(event.end - offset);
        return {
          name: event.label,
          start,
          end,
          duration: end - start,
          color: colors[event.label] ?? fallbackColor,
        };
      })
      .filter((segment) => segment.duration > 0);

    const row = { day: `Day ${day.day}`, segments };
    segments.forEach((segment, i) => {
      row[`d${i}`] = segment.duration;
    });
    return row;
  });

  const maxSegments = Math.max(0, ...rows.map((row) => row.segments.length));
  return { rows, maxSegments };
}

function DayTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;

  return (
    <div className="rounded-xl border border-white/10 bg-slate-950 p-3 text-xs text-slate-200 shadow-xl">
      <p className="mb-2 font-bold">{row.day}</p>
      <ul className="space-y-1.5">
        {row.segments.map((segment, i) => (
          <li className="flex items-center gap-2" key={i}>
            <span
              className="size-2 shrink-0 rounded-sm"
              style={{ background: segment.color }}
            />
            <span className="w-16 font-semibold">{segment.name}</span>
            <span className="text-slate-400">
              {formatClock(segment.start)} – {formatClock(segment.end)}
            </span>
            <span className="ml-auto pl-3 font-semibold">
              {formatDuration(segment.duration)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TripTimelineChart({ days = [] }) {
  const { rows, maxSegments } = useMemo(() => buildRows(days), [days]);

  if (!rows.length) return null;

  // keep each day's bar a readable height
  const chartHeight = rows.length * 56 + 56;

  return (
    <article className="rounded-3xl border border-white/10 bg-slate-900 p-5 sm:p-6 h-fit">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Trip timeline
          </p>
          <h2 className="mt-2 text-lg font-bold">
            {rows.length > 1 ? "Daily activity" : "Day 1 activity"}
          </h2>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {legend.map(([color, label]) => (
            <span
              className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400"
              key={label}
            >
              <span className={`size-2 rounded-sm ${color}`} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 min-w-0" style={{ height: chartHeight }}>
        <ResponsiveContainer height="100%" width="100%">
          <BarChart
            data={rows}
            layout="vertical"
            margin={{ bottom: 8, left: 0, right: 12, top: 8 }}
          >
            <CartesianGrid horizontal={false} stroke="rgba(148,163,184,.1)" />
            <XAxis
              axisLine={false}
              domain={[0, 24]}
              tick={{ fill: "#64748b", fontSize: 10 }}
              tickFormatter={(value) => `${String(value).padStart(2, "0")}:00`}
              tickLine={false}
              ticks={[0, 3, 6, 9, 12, 15, 18, 21, 24]}
              type="number"
            />
            <YAxis
              axisLine={false}
              dataKey="day"
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
              tickLine={false}
              type="category"
              width={52}
            />
            <ChartTooltip
              content={<DayTooltip />}
              cursor={{ fill: "rgba(255,255,255,.04)" }}
            />
            {Array.from({ length: maxSegments }, (_, i) => (
              <Bar
                barSize={26}
                dataKey={`d${i}`}
                isAnimationActive={false}
                key={i}
                stackId="day"
              >
                {rows.map((row) => (
                  <Cell
                    fill={row.segments[i]?.color ?? "transparent"}
                    key={row.day}
                  />
                ))}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Hover over a day to see every segment with its exact times.
      </p>
    </article>
  );
}
