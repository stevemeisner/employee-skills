const env = process.env.NODE_ENV
// Use relative path in development to leverage the webpack proxy
const API_ROOT =
  env === 'development' ? '' : 'https://employee-skillz.herokuapp.com'

export { env, API_ROOT }
