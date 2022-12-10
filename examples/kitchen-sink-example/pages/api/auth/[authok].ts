import { handleAuth } from '@authok/nextjs-authok';

export default handleAuth({
  onError(req, res, error) {
    console.error(error);
    res.status(error.status || 500).end('Check the console for the error');
  }
});
