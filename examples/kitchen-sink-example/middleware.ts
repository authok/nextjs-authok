import { withMiddlewareAuthRequired } from '@authok/nextjs-authok/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: ['/profile-mw', '/api/hello-world-mw']
};
