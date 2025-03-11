const env = import.meta.env.MODE
// Use relative path in development to leverage the proxy
const API_ROOT =
  env === 'development' ? '' : 'https://employee-skillz.herokuapp.com'

export { env, API_ROOT }
