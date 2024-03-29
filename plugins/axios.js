import axios from "axios";
import jscookie from "js-cookie";

const mainAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});
const mediaAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MEDIA_API,
});

if (jscookie.get("fo_sas_tk")) {
  mainAPI.defaults.headers.common.Authorization = `Bearer ${jscookie.get(
    "fo_sas_tk"
  )}`;
}

export { mainAPI, mediaAPI };
