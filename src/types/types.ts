import {TokenData} from "../models/TokenData";

export type TGetUserTokenData = {
    token?: string;
    error?: string;
}

export type TFetchUserDataRes = {
    token?: string;
    error?: string;
}

export type MLSuccessfulParty = {
    party: {
        body: {
            partyIdInfo: {
                partyIdType: string; // "MSISDN"
                partyIdentifier: string; // "16135551212"
                partySubIdOrType: string; // "string"
                fspId: string; // "string"
                extensionList: {
                    extension: Array<{
                        key: string; // "string"
                        value: string; // "string"
                    }>
                }
            };
            merchantClassificationCode: string; // "0"
            name: string; // "string"
            personalInfo: {
                complexName: {
                    firstName: string; // "Henrik"
                    middleName: string; // "Johannes"
                    lastName: string; // "Karlsson"
                };
                dateOfBirth: string; // "1966-06-16"
            }
        };
        headers: object; // {}
    };
    currentState: string; // "WAITING_FOR_ACTION"
}

export type MLPartyError = {
    "error": string
}

export type MLParty = MLSuccessfulParty | MLPartyError

export type TKYCData = {
    name: string;
    dob: string;
    gender: string;
    address: string;
    email: string;
    phone: string;
    nationality: string;
    passport_number: string;
    issue_date: string;
    expiry_date: string;
    bank_account_number: string;
    bank_name: string;
    employer: string;
    occupation: string;
    income: string;
    marital_status: string;
    dependents: number;
    risk_level: string;
}

export type TKycInfo = {
    sub: string;
    birthdate: string;
    address: {
        locality: string;
    };
    gender: string;
    name: string;
    phoneNumber: string;
    email: string;
    picture: string;
}

export type TAppConfig = {
    CLIENT_ID: string;
    ESIGNET_TOKEN_URL: string;
    RETURN_URL: string;
    DB_HOST: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;
    REACT_APP_KYC_PROPERTIES_TO_COMPARE: string;
    REACT_APP_JWT_SECRET_KEY: string;
    JWT_SECRET_KEY: string;
    JWT_PRIVATE_KEY: string;
    JWT_PUBLIC_KEY: string;
    PTA_URL: string;
    MOJALOOP_GETPARTIES_URL: string;
    MOJALOOP_SDK_URL: string;
    ESIGNET_USERINFO_URL: string;
    KEY_FILE_PATH: string;
    PORT: number;
}

export type TRouteHandlerDeps = {
    client_id: string,
    esignet_url: string,
    return_url: string
}

export type TStorageRepoDeps = {
    host: string,
    user: string,
    password: string,
    database: string
}
export interface IStorageRepo {
    init(): Promise<void>;
    destroy(): Promise<void>;
    SaveDateToDB (tokenData: TokenData): Promise<TokenData | { error: string }>;
}