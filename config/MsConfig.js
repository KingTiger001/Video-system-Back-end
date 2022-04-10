export const msalConfig = {
   auth: {
      clientId: "0ad03875-a897-4f04-bfab-959fd9693d0e",
      authority: "https://login.microsoftonline.com/common",
      redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URL,
      clientSecret: "X1XTEcMga.~2y16fo-zDE.3n3cIr1a-f06",
      identityMetadata:
         "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
   },
   cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
   },
};

export const requestScopes = {
   scopes: ["user.read", "mail.send", "profile"],
};

export const graphConfig = {
   graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
