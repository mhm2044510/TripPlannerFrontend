import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { GetGeoCode, GetRoute, PlanTrip } from "../services/serv.api";

export const DEFAULT_LOCATIONS = {
  current_location: "Philadelphia, PA",
  pickup: "New York, NY",
  dropoff: "Newark, NJ",
};

export const DEFAULT_RULES = {
  maxDrivingHours: 11,
  maxDutyWindowHours: 14,
  requiredRestHours: 10,
  breakAfterDrivingHours: 8,
  requiredBreakHours: 0.5,
  maxCycleHours: 70,
  restartHours: 34,
  fuelIntervalMiles: 1000,
  fuelStopHours: 0.5,
  pickupHours: 1,
  dropoffHours: 1,
  startHour: 6,
};

export const DEFAULT_CYCLE_USED = 65;

// 1) Addresses -> coordinates
export function useGeoCode(locations = DEFAULT_LOCATIONS) {
  return useQuery({
    queryKey: ["trip", "geocode", locations],
    queryFn: () => GetGeoCode(locations),
    staleTime: Infinity, // same address = same coordinates
    placeholderData: keepPreviousData,
  });
}
// 2) Coordinates -> route (runs only once geocode is done)
export function useRoute(points, enabled = true) {
  return useQuery({
    queryKey: ["trip", "route", points],
    queryFn: () => GetRoute(points),
    enabled: enabled && !!points,
    placeholderData: keepPreviousData,
  });
}
// 3) Route + cycle + rules -> HOS plan (runs only once route is done)
export function usePlanTrip(
  { route, cycleUsed = DEFAULT_CYCLE_USED, rules = DEFAULT_RULES },
  enabled = true,
) {
  // send only what the API expects, not the heavy geometry array
  const payload = route && {
    route: {
      distanceMiles: route.distanceMiles,
      drivingHours: route.drivingHours,
      legs: route.legs,
    },
    cycleUsed,
    rules,
  };

  return useQuery({
    queryKey: ["trip", "plan", payload],
    queryFn: () => PlanTrip(payload),
    enabled: enabled && !!payload,
    placeholderData: keepPreviousData,
  });
}
