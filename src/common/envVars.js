const env = process.env.NODE_ENV
// Use relative path in development to leverage the webpack proxy
const API_ROOT =
  env === 'development'
    ? ''
    : 'https://emplyee-skillz-02c1fdc7b405.herokuapp.com/'

export { env, API_ROOT }
