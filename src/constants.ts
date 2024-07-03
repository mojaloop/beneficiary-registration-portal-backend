import { readFileSync } from "fs";
import config from "./config";

export const ID_TYPE_ALIAS = "ALIAS";
export const PTA_URL = config.get("backendConfig.PTA_URL");
export const MOJALOOP_GETPARTIES_URL = config.get(
  "backendConfig.MOJALOOP_GETPARTIES_URL",
);
export const MOJALOOP_SDK_URL = config.get("backendConfig.MOJALOOP_SDK_URL");
export const ESIGNET_TOKEN_URL = config.get("backendConfig.ESIGNET_TOKEN_URL");
export const ESIGNET_USERINFO_URL = config.get(
  "backendConfig.ESIGNET_USERINFO_URL",
);
export const CURRENCY = "EUR";
export const KEY_FILE_PATH = config.get("backendConfig.KEY_FILE_PATH");

export const PRIVATE_KEY = readFileSync(KEY_FILE_PATH, "utf-8");
