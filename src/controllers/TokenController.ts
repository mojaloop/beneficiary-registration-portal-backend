import {
  ID_TYPE_ALIAS,
  PTA_URL,
  MOJALOOP_GETPARTIES_URL,
  MOJALOOP_SDK_URL,
  ESIGNET_TOKEN_URL,
  ESIGNET_USERINFO_URL,
} from '../constants';
import {MLParty, TFetchUserDataRes, TGetUserTokenData} from "../types/types";


/**
 * Register a token mapping in PTA.
 *
 * @param {string} idType - The type of the account holder's ID
 * @param {string} payeeId - The account holder's ID
 * @param {string} psut - The ID token obtained from eSignet (sub-field)
 * @returns {Promise<string | null>} The modelId of the newly registered account, or null if registration failed
 */
export const registerToken = async (
  idType: string,
  payeeId: string,
  psut: string
): Promise<string | null> => {

  const token = await generateRandomToken(psut);

  const apiUrl = `${PTA_URL}/tokens`;
  const requestBody = {
    payeeId: payeeId,
    payeeIdType: idType,
    paymentToken: token
  };

  try {

    const response = await fetch(apiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
    console.log('token is registered', { token, apiUrl, requestBody, response });

    return token;
  } catch (error) {
    console.error('Error registering token:', error); // Log error
    return null;
  }
};


/**
 * Register a new account with the MojaLoop account service.
 *
 * @param {string} token - Alias token
 * @param {string} currency - Account currency
 * @returns {string | null} The modelId of the newly registered account, or null if registration failed
 */
export const registerAccount = async (token: string, currency: string): Promise<string | null> => {
  const apiUrl = `${MOJALOOP_SDK_URL}/accounts`;
  const requestBody = [
    {
      idType: ID_TYPE_ALIAS,
      idValue: token,
      currency,
    }
  ];

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const responseData = await response.json();
    console.log('alias account is registered', { apiUrl, requestBody, responseData });
    return responseData;

    /**
     * If the response is successful, return a success message or relevant data.
     * In this case, we return the modelId of the newly registered account.
     */
  } catch (error) {
    console.error('Error registering account:', error);
    /**
     * If the response is not successful, handle the error.
     * In this case, we return null to indicate that account registration failed.
     */
    return null;
  }
};

/**
 * Generate a random token based on the given ID token.
 *
 * @param {string} idToken - The ID token to use as the basis for the random token
 * @returns {string} The generated random token
 */
const generateRandomToken = async (idToken: string): Promise<string> => {

  // The characters to use for generating the random token
  const characters = idToken;
  // The length of the random token to generate
  const length = 10;
  let result = '';
  // Build the random token one character at a time
  for (let i = 0; i < length; i++) {
    // Get a random character from the given ID token
    const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
    // Add the random character to the result
    result += randomChar;
  }
  // Return the generated random token
  return result;
};

/**
 * Fetches the user token from the eSignet OAuth2 server
 *
 * @param {string} code - The authorization code
 * @param {string} client_id - The client ID
 * @param {string} client_assertion - The client assertion
 * @param {string} redirect_uri - The redirect URI
 * @returns {any} The JSON object containing the user token
 */
export const getUserToken = async (
  code: string,
  client_id: string,
  client_assertion: string,
  redirect_uri: string
): Promise<TGetUserTokenData> => {
  console.log('getUserToken args:', { code, client_id, client_assertion, redirect_uri, ESIGNET_TOKEN_URL });

  try {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const body = new URLSearchParams({
      'grant_type': 'authorization_code',
      'code': code, // Replace with your actual code
      'client_id': client_id, // Replace with your actual client_id
      'client_assertion_type': 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      'client_assertion': client_assertion, // Replace with your actual client_assertion
      redirect_uri,
    });

    const response = await fetch(ESIGNET_TOKEN_URL!, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('getUserToken response error:', error);
      return { error: `Failed to fetch user token: ${error.error_description || response.statusText}` };
    }

    const data = await response.json();

    return {token:data.access_token};
  } catch (error) {
    console.error('Error fetching user token:', error);
    return { error: 'Error fetching user token' };
  }
};


/**
 * Fetches user data from the identity provider
 * @param token - Access token to be used for fetching user data
 * @returns Parsed JSON object containing the user's data
 */
export const fetchUserData = async (token: string): Promise<TFetchUserDataRes> => {

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Use the provided access token
    };

    const response = await fetch(ESIGNET_USERINFO_URL!, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      const errorMessage = `Failed to fetch: ${response.status} ${response.statusText}`;
      console.error("errorMessage", errorMessage, ESIGNET_USERINFO_URL, response);
      return { error: errorMessage };
    }

    const data = await response.text(); // Parse the response as text (assuming it's a token)

    return {token:data}; // Return the token
  } catch (error) {
    console.error('Error:', error);
    return { error: 'Failed to fetch' };
  }
}

export const GetParties = async (selectedPaymentType: string, payeeId: string) : Promise <MLParty> => {
  try {
    const apiUrl = `${MOJALOOP_GETPARTIES_URL}/parties/${selectedPaymentType}/${payeeId}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error('response is not ok:', response);
      return { error: `Failed to fetch data due to ${response.status} ${response.statusText}` };
    }

    const respData = await response.json();
    console.log('getParties response:', { respData, apiUrl });
    return respData;
  } catch (error) {
    console.error(`error in GetParties: `, error);
    return { error: 'Failed to fetch from payment adapter' };
  }

}
