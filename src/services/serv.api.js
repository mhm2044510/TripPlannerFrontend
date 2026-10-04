import axios from "axios";
const api = axios.create({ baseURL: "https://tripplanner-gm2n.onrender.com" });
export async function getCities() {
  const res = await api.get("/api/trips/cities/");
  return res.data;
}
export async function GetGeoCode(payload) {
  const res = await api.post("/api/trips/GetGeoCode/", payload);
  return res.data;
}
export async function GetRoute(payload) {
  const res = await api.post("/api/trips/GetRoute/", payload);
  return res.data;
}
export async function PlanTrip(payload) {
  const res = await api.post("/api/trips/PlanTrip/", payload);
  return res.data;
}
