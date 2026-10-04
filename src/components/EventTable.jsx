import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatClock, formatDuration } from "../services/helpers";

const eventPillStyles = {
  DRIVING: "bg-blue-500/15 text-blue-300 ring-blue-400/20",
  PICKUP: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20",
  DROPOFF: "bg-rose-500/15 text-rose-300 ring-rose-400/20",
  "OFF DUTY": "bg-slate-500/15 text-slate-300 ring-slate-400/20",
};

export default function EventTable({ events, current, pickup, dropoff }) {
  console.log(events, "this is event");
  const data = useMemo(
    () =>
      events.map((event) => ({
        ...event,
        day: event.day ?? Math.floor(event.start / 24) + 1,
        reason:
          event.reason === "Route: current → pickup"
            ? `Route: ${current} → ${pickup}`
            : event.reason === "Route: pickup → dropoff"
              ? `Route: ${pickup} → ${dropoff}`
              : event.reason,
      })),
    [events, current, pickup, dropoff],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "day",
        header: "Day",
        cell: ({ getValue }) => `Day ${getValue()}`,
      },
      {
        accessorKey: "start",
        header: "Start",
        cell: ({ getValue }) => formatClock(getValue()),
      },
      {
        accessorKey: "end",
        header: "End",
        cell: ({ getValue }) => formatClock(getValue()),
      },
      {
        accessorKey: "label",
        header: "Event",
        cell: ({ getValue }) => {
          const value = getValue();
          return (
            <span
              className={`inline-flex rounded-md px-2 py-1 text-[10px] font-bold ring-1 ring-inset ${eventPillStyles[value]}`}
            >
              {value}
            </span>
          );
        },
      },
      {
        id: "duration",
        header: "Duration",
        cell: ({ row }) =>
          formatDuration(row.original.end - row.original.start),
      },
      { accessorKey: "reason", header: "Reason" },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <article className="rounded-3xl border border-white/10 bg-slate-900 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Trip event table
          </p>
          <h2 className="mt-2 text-lg font-bold">Daily event details</h2>
        </div>
        <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-400">
          {data.length} events
        </span>
      </div>
      <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="bg-slate-950/80">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                className="border-t border-white/5 transition hover:bg-white/[0.025]"
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    className="whitespace-nowrap px-4 py-3 text-xs text-slate-300"
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-600 sm:hidden">
        Swipe horizontally to see all columns.
      </p>
    </article>
  );
}
