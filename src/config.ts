import Convict from "convict";
import { TAppConfig } from "./types/types";

interface IConfigSchema {
  backendConfig: TAppConfig;
}

const config = Convict<IConfigSchema>({
  backendConfig: {
    CLIENT_ID: {
      doc: "e Signet Client ID",
      format: String,
      default: null, // required
      env: "CLIENT_ID",
    },
    ESIGNET_TOKEN_URL: {
      doc: "e Signet Token url",
      format: String,
      default: null, // required
      env: "ESIGNET_TOKEN_URL",
    },
    RETURN_URL: {
      doc: "e Signet return url",
      format: String,
      default: null, // required
      env: "RETURN_URL",
    },
    DB_HOST: {
      doc: "DB host",
      format: String,
      default: null, // required
      env: "HOST",
    },
    DB_USER: {
      doc: "DB user",
      format: String,
      default: null, // required
      env: "USER",
    },
    DB_PASSWORD: {
      doc: "DB password",
      format: String,
      default: null, // required
      env: "PASSWORD",
    },
    DB_DATABASE: {
      doc: "DB database name",
      format: String,
      default: null, // required
      env: "DATABASE",
    },
    REACT_APP_KYC_PROPERTIES_TO_COMPARE: {
      doc: "KYC Properties",
      format: String,
      default: null, // required
      env: "REACT_APP_KYC_PROPERTIES_TO_COMPARE",
    },
    REACT_APP_JWT_SECRET_KEY: {
      doc: "React JWT Secret key",
      format: String,
      default: null, // required
      env: "REACT_APP_JWT_SECRET_KEY",
    },
    JWT_SECRET_KEY: {
      doc: "JWT Secret key",
      format: String,
      default: null, // required
      env: "JWT_SECRET_KEY",
    },
    JWT_PRIVATE_KEY: {
      doc: "JWT Private key",
      format: String,
      default: null, // required
      env: "JWT_PRIVATE_KEY",
    },
    JWT_PUBLIC_KEY: {
      doc: "JWT Public key",
      format: String,
      default: null, // required
      env: "JWT_PUBLIC_KEY",
    },
    PTA_URL: {
      doc: "Payment Token Adapter URL",
      format: String,
      default: null, // required
      env: "PTA_URL",
    },
    MOJALOOP_GETPARTIES_URL: {
      doc: "Mojaloop Get Parties URL",
      format: String,
      default: null, // required
      env: "MOJALOOP_GETPARTIES_URL",
    },
    MOJALOOP_SDK_URL: {
      doc: "Mojaloop SDK URL",
      format: String,
      default: null, // required
      env: "MOJALOOP_SDK_URL",
    },
    ESIGNET_USERINFO_URL: {
      doc: "E Signet User Info URL",
      format: String,
      default: null, // required
      env: "ESIGNET_USERINFO_URL",
    },
    KEY_FILE_PATH: {
      doc: "JWT Private Key File Path",
      format: String,
      default: null, // required
      env: "KEY_FILE_PATH",
    },
    PORT: {
      doc: "brp backend server port",
      format: Number,
      default: 8081,
      env: "PORT",
    },
  },
});

config.validate({ allowed: "strict" });

export type TConfig = Convict.Config<IConfigSchema>;

export default config;
