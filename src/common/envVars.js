const env = process.env.NODE_ENV;
const API_ROOT = env === 'development' ? 'http://localhost:3000' : 'https://employee-skillz.herokuapp.com';

export { env, API_ROOT };
