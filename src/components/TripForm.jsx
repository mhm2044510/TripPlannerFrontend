import { useMemo, useState } from "react";
import { ConfigProvider, Form, Select } from "antd";
import Icon from "./Icon";
import { DEFAULT_FORM } from "../hooks/useTripPlanner";
import { useGetCities } from "../hooks/useLookup";

const ruleFields = [
  { key: "maxDrivingHours", label: "Max driving", suffix: "hrs" },
  { key: "maxDutyWindowHours", label: "Duty window", suffix: "hrs" },
  { key: "requiredRestHours", label: "Required rest", suffix: "hrs" },
  { key: "breakAfterDrivingHours", label: "Break after", suffix: "hrs" },
  {
    key: "requiredBreakHours",
    label: "Break duration",
    suffix: "hrs",
    step: 0.5,
  },
  { key: "maxCycleHours", label: "Max cycle", suffix: "hrs" },
  { key: "restartHours", label: "Cycle restart", suffix: "hrs" },
  { key: "fuelIntervalMiles", label: "Fuel interval", suffix: "mi" },
  { key: "fuelStopHours", label: "Fuel stop", suffix: "hrs", step: 0.5 },
  { key: "pickupHours", label: "Pickup time", suffix: "hrs", step: 0.5 },
  { key: "dropoffHours", label: "Drop-off time", suffix: "hrs", step: 0.5 },
  { key: "startHour", label: "Start hour", suffix: ":00" },
];

// Makes antd's inputs match the dark design
const formTheme = {
  token: {
    colorPrimary: "#a3e635",
    colorBgContainer: "rgba(2, 6, 23, 0.65)",
    colorBgElevated: "#0f172a",
    colorBorder: "rgba(255, 255, 255, 0.1)",
    colorText: "#ffffff",
    colorTextPlaceholder: "#475569",
    borderRadius: 12,
    fontSize: 14,
  },
  components: {
    Form: {
      itemMarginBottom: 0,
      verticalLabelPadding: "0 0 8px",
      labelHeight: 16,
    },
    Select: {
      controlHeightLG: 46,
      selectorBg: "rgba(2, 6, 23, 0.65)",
      optionSelectedBg: "rgba(163, 230, 53, 0.12)",
      optionSelectedColor: "#ffffff",
    },
  },
};

const toNumber = (event) => Number(event.target.value);

function CityField({ label, name, options, loading }) {
  return (
    <Form.Item
      label={
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </span>
      }
      name={name}
      rules={[{ required: true, message: "Select a city" }]}
    >
      <Select
        loading={loading}
        optionFilterProp="label"
        options={options}
        placeholder="Select a city"
        prefix={
          <Icon className="size-4 text-slate-500">
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </Icon>
        }
        showSearch
        size="large"
        suffixIcon={
          <Icon className="size-4 text-slate-500">
            <path d="m6 9 6 6 6-6" />
          </Icon>
        }
      />
    </Form.Item>
  );
}

export default function TripForm({ onSubmit, loading = false }) {
  const [showRules, setShowRules] = useState(false);
  const [form] = Form.useForm();

  // cities come from the API (cached by react-query)
  const { data: cities = [], isLoading: citiesLoading } = useGetCities();
  const cityOptions = useMemo(
    () => cities.map((city) => ({ value: city, label: city })),
    [cities],
  );

  // live values, so the progress bar updates while typing
  const cycleUsed = Form.useWatch("cycleUsed", form) ?? DEFAULT_FORM.cycleUsed;
  const maxCycle =
    Form.useWatch(["rules", "maxCycleHours"], form) ??
    DEFAULT_FORM.rules.maxCycleHours;

  return (
    <ConfigProvider theme={formTheme}>
      <Form
        className="self-start! rounded-3xl! border! border-white/10! bg-slate-900! p-5! sm:p-7!"
        form={form}
        initialValues={DEFAULT_FORM}
        layout="vertical"
        onFinish={onSubmit}
        requiredMark={false}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              New trip
            </p>
            <h2 className="mt-2 text-xl font-bold">Route details</h2>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <CityField
            label="Current location"
            loading={citiesLoading}
            name="current"
            options={cityOptions}
          />
          <CityField
            label="Pickup location"
            loading={citiesLoading}
            name="pickup"
            options={cityOptions}
          />
          <CityField
            label="Drop-off location"
            loading={citiesLoading}
            name="dropoff"
            options={cityOptions}
          />
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/65 p-4">
          <div className="flex items-center justify-between gap-5">
            <div>
              <label
                className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
                htmlFor="cycle"
              >
                Cycle used
              </label>
              <p className="mt-1 text-xs text-slate-500">
                Hours already logged this cycle
              </p>
            </div>
            <div className="flex items-center rounded-lg border border-white/10 bg-slate-900">
              <Form.Item getValueFromEvent={toNumber} name="cycleUsed" noStyle>
                <input
                  className="w-16 bg-transparent px-3 py-2 text-right text-sm font-bold outline-none"
                  id="cycle"
                  max={maxCycle}
                  min="0"
                  step="0.5"
                  type="number"
                />
              </Form.Item>
              <span className="pr-3 text-xs text-slate-500">hrs</span>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-lime-400 to-amber-400"
              style={{
                width: `${Math.min((cycleUsed / maxCycle) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        <button
          className="mt-4 flex w-full items-center justify-between rounded-xl border border-white/10 bg-slate-950/65 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-white/20"
          onClick={() => setShowRules((value) => !value)}
          type="button"
        >
          <span className="flex items-center gap-2">
            <Icon className="size-4 text-slate-500">
              <path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
              <circle cx="12" cy="12" r="4" />
            </Icon>
            Hours of Service rules
          </span>
          <Icon
            className={`size-4 transition ${showRules ? "rotate-180" : ""}`}
          >
            <path d="m6 9 6 6 6-6" />
          </Icon>
        </button>

        {/* Always rendered so values stay registered; hidden while collapsed */}
        <div
          className={`mt-3 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-slate-950/65 p-4 ${
            showRules ? "" : "hidden"
          }`}
        >
          {ruleFields.map((field) => (
            <label key={field.key}>
              <span className="mb-1.5 block text-[11px] font-semibold text-slate-500">
                {field.label}
              </span>
              <span className="flex items-center rounded-lg border border-white/10 bg-slate-900 focus-within:border-lime-400/50">
                <Form.Item
                  getValueFromEvent={toNumber}
                  name={["rules", field.key]}
                  noStyle
                >
                  <input
                    className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm font-semibold outline-none"
                    min="0"
                    step={field.step ?? 1}
                    type="number"
                  />
                </Form.Item>
                <span className="pr-2.5 text-[10px] text-slate-600">
                  {field.suffix}
                </span>
              </span>
            </label>
          ))}
        </div>

        <button
          className="primary-button mt-5 disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          <Icon className="size-4">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </Icon>
          {loading ? "Planning..." : "Generate trip plan"}
        </button>
      </Form>
    </ConfigProvider>
  );
}
