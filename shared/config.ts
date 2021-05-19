export const PORT: string = process.env.VUE_APP_API_PORT || 80;
export const API: string =
  "http://" +
    process.env.VUE_APP_HOSTNAME +
    ":" +
    PORT +
    process.env.VUE_APP_API || "/api";
