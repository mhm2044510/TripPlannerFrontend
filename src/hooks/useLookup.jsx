import { useQuery } from "@tanstack/react-query";
import { getCities } from "../services/serv.api";

export const useGetCities = () => {
  return useQuery({
    queryKey: ["cities"],
    queryFn: getCities,
  });
};
