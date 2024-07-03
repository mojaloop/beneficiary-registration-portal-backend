import {Context} from "openapi-backend";
import { Request, Response } from 'express';
import { decodeToken, signJWTToken } from '../services/JWTService';
import { GetParties, fetchUserData, getUserToken, registerAccount, registerToken } from '../controllers/TokenController';
import { KYCInformation } from '../models/KYCInformation';
import { CURRENCY } from '../constants';
import {ApiService} from "../services/ApiService";
import {TRouteHandlerDeps} from "../types/types";

export class RouteHandlers {

  private readonly CLIENT_ID: string ;
  private readonly ESIGNET_TOKEN_URL: string;
  private readonly RETURN_URL: string;
  private static instance: RouteHandlers

  static getInstance(deps: TRouteHandlerDeps){
   if(!this.instance){
     return new RouteHandlers(deps.client_id,deps.esignet_url,deps.return_url);
   }else{
     return this.instance
   }
  }

  private constructor(client_id: string, esignet_url: string, return_url: string) {
    this.CLIENT_ID = client_id;
    this.ESIGNET_TOKEN_URL = esignet_url;
    this.RETURN_URL = return_url;
  }

  getHealth(c: Context, req: Request, res: Response) {
    return res.send('Token Registration API');
  }

  async getUserInfo(c: Context, req: Request, res: Response){
    /*
    *Get user info endpoint
    This endpoint is called by the frontend to get the user information and
    register a token and account with the payment adapter.
    The user is verified against the information stored in the Mojaloop SDK
    and if the information matches, a token and account are registered with
    the payment adapter and the information is saved to the database.
    The response will contain the user's name and the token data.
    * */
    try {
      // Generate JWT token
      const jwtToken = await signJWTToken(this.CLIENT_ID, this.ESIGNET_TOKEN_URL);
      if (!jwtToken) {
        console.error('no jwtToken');
        return res.status(500).json({ error: 'Error generating JWT token' });
      }

      // Get ESigNet token
      const esignetToken = await getUserToken(req.body.code, this.CLIENT_ID, jwtToken, this.RETURN_URL);
      if (esignetToken.error) {
        console.error('esignetToken error:', esignetToken);
        return res.status(500).json({ error: 'Error getting ESigNet token' });
      }

      // Get user data
      if(!esignetToken.token){
        console.error('esignetToken error:', esignetToken);
        return res.status(500).json({ error: 'Error getting ESigNet token' });
      }
      const userToken = await fetchUserData(esignetToken.token);
      if (userToken.error)  {
        return res.status(500).json({ error: 'Error fetching user data' });
      }
      console.log('userToken is got');

      // Decode user token
      if(!userToken.token){
        return res.status(500).json({ error: 'Error fetching user data' });
      }
      const userTokenData = await decodeToken(userToken.token);
      if (!userTokenData) {
        console.error('no userTokenData:', userTokenData);
        return res.status(500).json({ error: 'Error decoding user token' });
      }

      // Create user data object
      const userData = new KYCInformation(userTokenData);
      console.log('userData:', { ...userData, picture: null  });

      // Get party information from Mojaloop SDK
      const getPatiesData = await GetParties(req.body.selectedPaymentType, req.body.payeeId);
      if ('error' in getPatiesData && getPatiesData.error) {
        return res.status(500).json({ error: 'Error fetching user data from SDK' });
      }

      // todo: move to a separate method
      const mlUserName = ('party' in getPatiesData ? getPatiesData.party?.body?.name : '');
      if (!mlUserName || mlUserName !== userData.name) {
        const errMessage = 'User details from Mojaloop and MOSIP do not match!';
        console.error(errMessage, { mlUserName });
        return res.status(403).json({ error: errMessage });
      }

      // Register token and account with the payment adapter
      const token = await registerToken(req.body.selectedPaymentType, req.body.payeeId, userData.sub);
      if (!token) {
        return res.status(500).json({ error: 'Error registering token' });
      }

      const account = await registerAccount(token, CURRENCY);
      // todo: get CURRENCY from party response?
      if (!account) {
        return res.status(500).json({ error: 'Error registering account' });
      }

      // Save token data to the database
      const tokenData = { psut: userData.sub, token };
      const success = await ApiService.storageRepo.SaveDateToDB(tokenData);
      console.log('success and tokenData:', { success, tokenData });

      if (success) {
        return res.json({ name: userData.name, tokenData });
      } else {
        return res.status(500).json({ error: 'Failed to save data' });
      }
    } catch (error) {
      console.error('An error occurred while fetching party details:', error);
      return res.status(500).json({ error: "An error occurred while fetching beneficiary details:" });
    }
  }
}

