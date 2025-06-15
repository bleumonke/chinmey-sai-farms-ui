const awsconfig = {
  Auth: {
    Cognito: {
      userPoolClientId: '645vnb5no65htd30mf3c017ku3',
      userPoolId: 'us-east-1_ba5EAo1g2',
      loginWith: {
        oauth: {
          domain: 'us-east-1ba5eao1g2.auth.us-east-1.amazoncognito.com',
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: ['http://localhost:3000/', "https://dev.d2g8xj2nqdnqxg.amplifyapp.com/"],
          redirectSignOut: ['http://localhost:3000/' ,"https://dev.d2g8xj2nqdnqxg.amplifyapp.com/"],
          responseType: 'code' as 'code',
        }
      }
    }
  }
}

export default awsconfig;