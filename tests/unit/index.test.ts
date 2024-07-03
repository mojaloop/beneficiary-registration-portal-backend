import {afterAll, beforeAll, describe, test, expect} from "@jest/globals";
import {ApiService} from "../../src/services/ApiService";
// @ts-ignore
import {StorageRepoMock} from "./StorageRepoMock";
import {afterEach} from "node:test";
import fetchMock from "fetch-mock";
import axios from "axios";

const storageRepoMock = new StorageRepoMock();

const defaultHeaders = new Headers();
defaultHeaders.append("Content-Type", "application/json");

describe("BRP Backend Tests",  ()=>{
    beforeAll(async () => {
        await ApiService.start(storageRepoMock);
    });

    afterAll(async ()=>{
        await ApiService.stop();
    });

    afterEach(async ()=>{
       fetchMock.restore();
    });

    test("test get health ", async ()=>{
        const reqInit: RequestInit = {
            method: "GET",
        };
        const res = await fetch(`http://localhost:${process.env.PORT || 8080}`, reqInit);
        expect(res.status).toBe(200);
    });

    test("test register user info", async () => {
        fetchMock.mock('https://esignet.collab.mosip.net/v1/esignet/oauth/token', {"access_token": "secret"});
        fetchMock.mock("https://esignet.collab.mosip.net/v1/esignet/oidc/userinfo", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
        fetchMock.mock("https://test-g2pxpayee.devpm.devbaremetal.moja-onprem.net/mlcon-outbound/parties/MSISDN/0723638883", {
            party: {
                body: {
                    name: "John Doe"
                }
            }
        });
        fetchMock.mock("https://pta-portal-g2pxpayee.devpm.devbaremetal.moja-onprem.net/tokens", 201);
        fetchMock.mock("https://test-g2pxpayee.devpm.devbaremetal.moja-onprem.net/mlcon-outbound/accounts", {});
        const reqPayload = {
            "code": "12345",
            "selectedPaymentType": "MSISDN",
            "payeeId": "0723638883"
        };
        const res = await axios.post(`http://localhost:${process.env.PORT || 8080}/getUserInfo`, reqPayload, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log(res.data);
        expect(res.data.name).toEqual("John Doe");
    });

});