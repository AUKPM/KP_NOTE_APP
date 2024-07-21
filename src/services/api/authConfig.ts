// src/services/auth0Config.js
// export const auth0Config = {
//   domain: 'dev-yg.us.auth0.com', // Auth0 domain
//   clientId: 'H9F6QG5SzTKMv0tbmgxLj9LjG1EKVllA', // Auth0 client ID
//   redirectUri: 'https://localhost:3000://callback', // Custom URI scheme for mobile apps
//   audience: 'https://dev-yg.us.auth0.com/api/v2/', // API Audience
//   scopes: ['openid', 'profile', 'email', 'offline_access'],
// };

// org.reactjs.native.example.rnauthzero://wern.auth0.com/ios/org.reactjs.native.example.RNAuthZero/callback



export const auth0Config = {
  issuer: 'https://dev-yg.us.auth0.com/',
  clientId: 'H9F6QG5SzTKMv0tbmgxLj9LjG1EKVllA',
  redirectUri: 'org.reactjs.native.example.KP-NOTE-APP://wern.auth0.com/ios/org.reactjs.native.example.KP-NOTE-APP/callback', // ตรวจสอบให้ตรงกับ URL ที่กำหนดใน Auth0
  scopes: ['openid', 'profile', 'email', 'offline_access'],
  audience: 'https://dev-yg.us.auth0.com/api/v2/',
  responseType: 'code', // หรือ 'id_token', 'token' ขึ้นอยู่กับการตั้งค่า}
};
