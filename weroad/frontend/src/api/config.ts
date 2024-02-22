import { AxiosHeaders } from "axios";
import { useAuthStore } from "../stores";

export const APISettings = () => {
  const authStore = useAuthStore();
  let baseURL = import.meta.env.VITE_API_BASE_URL || '';
  if (!baseURL) {
    throw new Error("No API URL");
  }
  return {
    headers: new AxiosHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + authStore.getToken,
    }),
    baseURL,
  };
};
