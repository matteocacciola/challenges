import axios, { type AxiosResponse } from "axios";
import { APISettings } from "./config";
import { useAuthStore, useNotificationStore } from "../stores";

type ApiData = {
  query: string;
  variables?: any;
};

const process = async (
  response: AxiosResponse,
  authStore: any,
  notificationStore: any,
) => {
  const data = response.data.data;
  if (data) {
    return data;
  }

  const error = response.data.errors?.[0]?.extensions.originalError?.statusCode || 500;

  if (error === 401) {
    authStore.logout();
    return false;
  }

  if (error == 403) {
    notificationStore.notifications.push({
      type: "error",
      description: "Forbidden",
      timeout: 5000,
    });
    return false;
  }

  if (error == 404) {
    notificationStore.notifications.push({
      type: "error",
      description: "Not found",
      timeout: 5000,
    });
    return false;
  }

  if (error >= 400 && error < 500) {
    notificationStore.notifications.push({
      type: "error",
      description:
        "An error occurred. Please, try again later or contact the administrator.",
      timeout: 5000,
    });
    return false;
  }

  notificationStore.notifications.push({
    type: "error",
    description: response.data.errors?.[0]?.message || "Internal error. Please, contact the administrator.",
    timeout: 5000,
  });
  return false;
};

export async function api({ query, variables }: ApiData): Promise<any> {
  const authStore = useAuthStore();
  const notificationStore = useNotificationStore();
  const apiSettings = APISettings();

  try {
    const response = await axios.post(
      apiSettings.baseURL,
      { query, variables },
      { headers: apiSettings.headers },
    );

    return process(response, authStore, notificationStore);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
