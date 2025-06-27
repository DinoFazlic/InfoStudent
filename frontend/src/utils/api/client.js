import axios from "axios";
const BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window === "undefined" ? "http://127.0.0.1:8000" : "");

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  /* cookie-based auth → */
  withCredentials: true,
});