import dotenv from "dotenv";

dotenv.config();

import express, {Express} from "express";
import {IStorageRepo} from "../types/types";
import {SaveService} from "./SaveService";
import {OpenAPIBackend, Request as OpenAPIRequest} from "openapi-backend";
import {RouteHandlers} from "../routes/tokenRoutes";
import cors from "cors";
import morgan from 'morgan';
import {Server} from "node:http";
import config from "../config";

let server: Server;

const API_SPEC_FILE = './src/api-spec/openapi.yaml';

export class ApiService {
    static app: Express;
    static storageRepo: IStorageRepo;
    static handler: RouteHandlers;

    static async start(storageRepo?: IStorageRepo){
        if(!storageRepo){
            storageRepo = SaveService.getInstance({
                host: config.get("backendConfig.DB_HOST"),
                user: config.get("backendConfig.DB_USER"),
                password: config.get("backendConfig.DB_PASSWORD"),
                database: config.get("backendConfig.DB_DATABASE")
            });
        }
        this.storageRepo = storageRepo;
        await this.storageRepo.init();
        this.handler = RouteHandlers.getInstance({
            client_id: config.get("backendConfig.CLIENT_ID"),
            esignet_url: config.get("backendConfig.ESIGNET_TOKEN_URL"),
            return_url: config.get("backendConfig.RETURN_URL")
        });
        await this.setUpAndStartExpressServer();
    }

    static async setUpAndStartExpressServer(){
        this.app = express();
        const api = new OpenAPIBackend({
            definition: API_SPEC_FILE,
            handlers:{
                getHealth: this.handler.getHealth.bind(this),
                getUserInfo: this.handler.getUserInfo.bind(this),
                validationFail: async (context, req, h) => h.response({ error: context.validation.errors }).code(412),
                notFound: async (context, req, h) => h.response({ error: 'Not found' }).code(404),
            }
        });
        await api.init();
        this.app.use(cors())
        this.app.use(morgan("combined"))
        this.app.use(express.json());
        this.app.use((req, res) => api.handleRequest(req as OpenAPIRequest, req, res));
        const port =  config.get("backendConfig.PORT");
        server = this.app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    }

    static async stop(){
        await this.storageRepo.destroy();
        server.close();
    }
}

const stopServer = async (signal: string) => {
    console.log(`${signal} received!`)
    await ApiService.stop();
}

['SIGTERM', 'SIGINT'].map(sig => process.on(sig, () => stopServer(sig)));

process.on('uncaughtException',(err: Error) => {
    console.error(`uncaughtException: ${err?.message}`, err);
    process.exit(2);
});

process.on('unhandledRejection', (err: Error) => {
    console.error(`unhandledRejection: ${err?.message}`, err);
    process.exit(3);
});