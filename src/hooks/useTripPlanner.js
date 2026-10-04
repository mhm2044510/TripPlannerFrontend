import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGeoCode,
  useRoute,
  usePlanTrip,
  DEFAULT_LOCATIONS,
  DEFAULT_RULES,
  DEFAULT_CYCLE_USED,
} from "./useTripQueries";

// Used for the form's initialValues AND the first API call
export const DEFAULT_FORM = {
  current: DEFAULT_LOCATIONS.current_location,
  pickup: DEFAULT_LOCATIONS.pickup,
  dropoff: DEFAULT_LOCATIONS.dropoff,
  cycleUsed: DEFAULT_CYCLE_USED,
  rules: DEFAULT_RULES,
};

// form values -> shape the queries use
const toSubmitted = (v) => ({
  locations: {
    current_location: v.current,
    pickup: v.pickup,
    dropoff: v.dropoff,
  },
  cycleUsed: Number(v.cycleUsed),
  rules: v.rules,
});

export default function useTripPlanner() {
  const queryClient = useQueryClient();

  // Initialized with defaults => the API is called on first render
  const [submitted, setSubmitted] = useState(() => toSubmitted(DEFAULT_FORM));

  // 1) geocode
  const geoQuery = useGeoCode(submitted.locations);
  const geo = geoQuery.data;

  // 2) route (waits for geocode)
  const routeQuery = useRoute(
    geo && {
      current: geo.current_location,
      pickup: geo.pickup,
      dropoff: geo.dropoff,
    },
    !!geo,
  );
  const routeData = routeQuery.data;

  // 3) plan (waits for route)
  const planQuery = usePlanTrip(
    {
      route: routeData,
      cycleUsed: submitted.cycleUsed,
      rules: submitted.rules,
    },
    !!routeData,
  );
  const plan = planQuery.data;

  // Called by antd Form's onFinish(values)
  function submit(values) {
    const next = toSubmitted(values);
    if (JSON.stringify(next) === JSON.stringify(submitted)) {
      // same values -> query keys don't change, so force a refetch
      queryClient.invalidateQueries({ queryKey: ["trip"] });
    } else {
      setSubmitted(next);
    }
  }

  return {
    submit,
    submitted, // { locations, cycleUsed, rules } currently displayed

    // coordinates
    currentPoint: geo?.current_location,
    pickupPoint: geo?.pickup,
    dropoffPoint: geo?.dropoff,

    // route
    route: routeData?.geometry ?? [], // [[lat, lng], ...]
    legs: routeData?.legs ?? [],

    // plan
    distance: Math.round(plan?.summary.distanceMiles ?? 0),
    driveHours: plan?.summary.drivingHours ?? 0,
    totalHours: plan?.summary.durationHours ?? 0,
    cycleEnd: plan?.summary.cycleEnd ?? submitted.cycleUsed,
    tripDays: plan?.summary.days ?? 1,
    stops: plan?.stops ?? [],
    events: plan?.events ?? [],
    days: plan?.days ?? [],
    steps: plan?.steps ?? [],
    planned: !!plan,

    // request state
    isLoading:
      geoQuery.isLoading || routeQuery.isLoading || planQuery.isLoading,
    isFetching:
      geoQuery.isFetching || routeQuery.isFetching || planQuery.isFetching,
    error: geoQuery.error || routeQuery.error || planQuery.error,
  };
}
