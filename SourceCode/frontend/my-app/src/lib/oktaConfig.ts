export const oktaConfig ={

        clientId: '0oa9xsvywdZ3XMQ4Z5d7' , 

        issuer: 'https://dev-97956062.okta.com/oauth2/default',

        redirectUri: 'http://localhost:3001/login/callback',

        scopes:['openid', 'profile', 'email'],
        
        pkce: true,

        disableHttpsCheck: true,

}