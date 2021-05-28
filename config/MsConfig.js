export const msalConfig = {
    auth: {
      clientId: 'f5486f8a-8c98-44c6-9cf1-7fdfd216b477',
      authority: 'https://login.microsoftonline.com/common',
      redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URL,
      clientSecret: '6J..7bnK5iSntBR_N_l1LFu-cq40NNegRQ',
      identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false,
    },
  }
   
  export const requestScopes = {
    scopes: ['user.read', 'mail.send', 'profile'],
  }
   
  export const graphConfig = {
    graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  }
  