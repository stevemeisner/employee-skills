const env = import.meta.env.MODE
// For production, use the Heroku URL without trailing slash
const API_ROOT =
  env === 'development'
    ? ''
    : 'https://emplyee-skillz-02c1fdc7b405.herokuapp.com'

export { env, API_ROOT }
