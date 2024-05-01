import express from 'express';
import { Request, Response } from 'express';
import { decodeJWTToken, decodeToken, signJWTToken } from './JWTService';
import { GetParties, compareKYCData, fetchUserData, getUserToken, registerAccount, registerToken } from './TokenService';
import { SaveDataToDB } from './saveDataToDB';
import dotenv from 'dotenv';
import { KYCData, KYCInformation } from './models';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Environment variables
const {
  CLIENT_ID,
  ESIGNET_TOKEN_URL,
  RETURN_URL,
  PAYMENT_ADAPTER_URL,
  MOJALOOP_GETPARTIES_URL,
} = process.env;


// Ensure all required environment variables are defined
if (!CLIENT_ID || !ESIGNET_TOKEN_URL || !RETURN_URL || !PAYMENT_ADAPTER_URL || !MOJALOOP_GETPARTIES_URL) {
  console.error('One or more required environment variables are not defined');
  process.exit(1);
}



app.get('/', (req: Request, res: Response) => {
  return res.send('Hello, World!');
});

// Routes
app.post('/getUserInfo', async (req: Request, res: Response) => {
  try {
    const { CLIENT_ID, ESIGNET_TOKEN_URL, RETURN_URL, MOJALOOP_GETPARTIES_URL } = process.env;

    // Ensure all required environment variables are defined
    if (!CLIENT_ID || !ESIGNET_TOKEN_URL || !RETURN_URL || !MOJALOOP_GETPARTIES_URL) {
      console.error('One or more required environment variables are not defined');
      return res.status(500).json({ error: 'Environment variables not defined' });
    }

    const jwtToken = await signJWTToken(CLIENT_ID, ESIGNET_TOKEN_URL);
    if (!jwtToken) return res.status(500).json({ error: 'Error generating JWT token' });

    const esignetToken = await getUserToken(req.body.code, CLIENT_ID, jwtToken, RETURN_URL);
    if (esignetToken.error){      
       return res.status(500).json({ error: 'Error getting ESigNet token' })
      };


    const userToken = await fetchUserData(esignetToken);
    if (userToken.error) return res.status(500).json({ error: 'Error fetching user data' });


    const userTokenData = await decodeToken(userToken);
    //const userTokenData = await decodeJWTToken(userToken);
    if (!userTokenData) return res.status(500).json({ error: 'Error decoding user token' });

    const userData = new KYCInformation(userTokenData);

  

    const getPatiesData = await GetParties(req.body.selectedPaymentType, req.body.payeeId);
    if (getPatiesData.error) return res.status(500).json({ error: 'Error fetching user data from SDK' });

    const kycData = new KYCData(getPatiesData.kycData);


    const isMatch = await compareKYCData(userData, kycData);
    if (!isMatch) return res.status(400).json({ error: 'KYC information does not match' });

    const token = await registerToken(req.body.selectedPaymentType, req.body.payeeId, userData.sub);
    if (!token){ 
     
      return res.status(500).json({ error: 'Error registering token' })};

    const account = await registerAccount(req.body.selectedPaymentType, req.body.payeeId);
    if (!account) return res.status(500).json({ error: 'Error registering account' });

    const tokenData = { psut: userData.sub, token };
    const success = await SaveDataToDB(tokenData);
    if (success) {
      return res.json({ name: userData.name, tokenData });
  } else {
      return res.status(500).json({ error: 'Failed to save data' });
  }
  } catch (error) {
    console.error('An error occurred while fetching party details:', error);
    return res.status(500).json({ error: "An error occurred while fetching beneficiary details:" });
  }
});


// Start server
const port =  process.env.PORT || 8081;
app.listen(port, () => {

  console.log(`Server started on port ${port}`);
});