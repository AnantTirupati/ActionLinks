import axios from "axios";
import { ENV } from "../config/env";

export const api = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true,
  adapter: "fetch",
  headers: {
    "Content-Type": "application/json",
  },
});
