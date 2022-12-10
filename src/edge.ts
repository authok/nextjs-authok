import { NextMiddleware, NextRequest, NextResponse } from 'next/server';
import { default as CookieStore } from './authok-session/cookie-store';
import MiddlewareCookies from './utils/middleware-cookies';
import Session from './session/session';
import SessionCache from './session/cache';
import {
  WithMiddlewareAuthRequired,
  default as withMiddlewareAuthRequiredFactory
} from './helpers/with-middleware-auth-required';
import { getConfig, ConfigParameters } from './config';
import { setIsUsingNamedExports, setIsUsingOwnInstance } from './utils/instance-check';

export type AuthokEdge = { withMiddlewareAuthRequired: WithMiddlewareAuthRequired; getSession: GetSession };

export type GetSession = (req: NextRequest, res: NextResponse) => Promise<Session | null | undefined>;

export type InitAuthok = (params?: ConfigParameters) => AuthokEdge;

export { WithMiddlewareAuthRequired };

let instance: AuthokEdge;

function getInstance(params?: ConfigParameters): AuthokEdge {
  setIsUsingNamedExports();
  if (instance) {
    return instance;
  }
  instance = _initAuthok(params);
  return instance;
}

export const initAuthok: InitAuthok = (params?) => {
  setIsUsingOwnInstance();
  return _initAuthok(params);
};

const _initAuthok: InitAuthok = (params?) => {
  const { baseConfig, nextConfig } = getConfig(params);

  // Init base layer (with base config)
  const cookieStore = new CookieStore<NextRequest, NextResponse>(baseConfig, MiddlewareCookies);
  const sessionCache = new SessionCache(baseConfig, cookieStore);

  // Init Next layer (with next config)
  const getSession: GetSession = (req, res) => sessionCache.get(req, res);
  const withMiddlewareAuthRequired = withMiddlewareAuthRequiredFactory(nextConfig.routes, () => sessionCache);

  return {
    getSession,
    withMiddlewareAuthRequired
  };
};

export const getSession: GetSession = (...args) => getInstance().getSession(...args);
export const withMiddlewareAuthRequired: WithMiddlewareAuthRequired = (middleware?: NextMiddleware) =>
  getInstance().withMiddlewareAuthRequired(middleware);
