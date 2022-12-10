import { IncomingMessage } from 'http';
import type { AuthorizationParameters as OidcAuthorizationParameters } from 'openid-client';
import type { LoginOptions } from './authok-session/config';
import { DeepPartial, get as getBaseConfig } from './authok-session/get-config';

/**
 * @category server
 */
export interface BaseConfig {
  /**
   * The secret(s) used to derive an encryption key for the user identity in a session cookie and
   * to sign the transient cookies used by the login callback.
   * Provide a single string secret, but if you want to rotate the secret you can provide an array putting
   * the new secret first.
   * You can also use the `AUTHOK_SECRET` environment variable.
   */
  secret: string | Array<string>;

  /**
   * Object defining application session cookie attributes.
   */
  session: SessionConfig;

  /**
   * Boolean value to enable Authok's proprietary logout feature.
   * Since this SDK is for Authok, it's set to `true`by default.
   */
  authokLogout: boolean;

  /**
   *  URL parameters used when redirecting users to the authorization server to log in.
   *
   *  If this property is not provided by your application, its default values will be:
   *
   * ```js
   * {
   *   response_type: 'code',
   *   scope: 'openid profile email'
   * }
   * ```
   *
   * New values can be passed in to change what is returned from the authorization server
   * depending on your specific scenario. Additional custom parameters can be added as well.
   *
   * **Note:** You must provide the required parameters if this object is set.
   *
   * ```js
   * {
   *   response_type: 'code',
   *   scope: 'openid profile email',
   *
   *   // Additional parameters
   *   acr_value: 'tenant:test-tenant',
   *   custom_param: 'custom-value'
   * };
   * ```
   */
  authorizationParams: AuthorizationParameters;

  /**
   * The root URL for the application router, for example `https://localhost`.
   * You can also use the `AUTHOK_BASE_URL` environment variable.
   * If you provide a domain, we will prefix it with `https://`. This can be useful when assigning it to
   * `VERCEL_URL` for Vercel deploys.
   */
  baseURL: string;

  /**
   * The Client ID for your application.
   * You can also use the `AUTHOK_CLIENT_ID` environment variable.
   */
  clientID: string;

  /**
   * The Client Secret for your application.
   * Required when requesting access tokens.
   * You can also use the `AUTHOK_CLIENT_SECRET` environment variable.
   */
  clientSecret?: string;

  /**
   * Integer value for the system clock's tolerance (leeway) in seconds for ID token verification.`
   * Defaults to `60` seconds.
   * You can also use the `AUTHOK_CLOCK_TOLERANCE` environment variable.
   */
  clockTolerance: number;

  /**
   * Integer value for the HTTP timeout in milliseconds for authentication requests.
   * Defaults to `5000` ms.
   * You can also use the `AUTHOK_HTTP_TIMEOUT` environment variable.
   */
  httpTimeout: number;

  /**
   * Boolean value to opt-out of sending the library and node version to your authorization server
   * via the `Authok-Client` header. Defaults to `true`.
   * You can also use the `AUTHOK_ENABLE_TELEMETRY` environment variable.
   */
  enableTelemetry: boolean;

  /**
   * Function that returns an object with URL-safe state values for login.
   * Used for passing custom state parameters to your authorization server.
   * Can also be passed in to {@link HandleLogin}.
   *
   * ```js
   * {
   *   ...
   *   getLoginState(req, options) {
   *     return {
   *       returnTo: options.returnTo || req.originalUrl,
   *       customState: 'foo'
   *     };
   *   }
   * }
   * ```
   */
  getLoginState: (req: IncomingMessage, options: LoginOptions) => Record<string, any>;

  /**
   * Array value of claims to remove from the ID token before storing the cookie session.
   * Defaults to `['aud', 'iss', 'iat', 'exp', 'nbf', 'nonce', 'azp', 'auth_time', 's_hash', 'at_hash', 'c_hash']`.
   * You can also use the `AUTHOK_IDENTITY_CLAIM_FILTER` environment variable.
   */
  identityClaimFilter: string[];

  /**
   * Boolean value to log the user out from the identity provider on application logout. Defaults to `true`.
   * You can also use the `AUTHOK_IDP_LOGOUT` environment variable.
   */
  idpLogout: boolean;

  /**
   * String value for the expected ID token algorithm. Defaults to 'RS256'.
   * You can also use the `AUTHOK_ID_TOKEN_SIGNING_ALG` environment variable.
   */
  idTokenSigningAlg: string;

  /**
   * **REQUIRED** The root URL for the token issuer with no trailing slash.
   * This is `https://` plus your Authok domain.
   * You can also use the `AUTHOK_ISSUER_BASE_URL` environment variable.
   */
  issuerBaseURL: string;

  /**
   * Set a fallback cookie with no `SameSite` attribute when `response_mode` is `form_post`.
   * The default `response_mode` for this SDK is `query` so this defaults to `false`
   * You can also use the `AUTHOK_LEGACY_SAME_SITE_COOKIE` environment variable.
   */
  legacySameSiteCookie: boolean;

  /**
   * Boolean value to automatically install the login and logout routes.
   */
  routes: {
    /**
     * Either a relative path to the application or a valid URI to an external domain.
     * This value must be registered on the authorization server.
     * The user will be redirected to this after a logout has been performed.
     * You can also use the `AUTHOK_POST_LOGOUT_REDIRECT` environment variable.
     */
    postLogoutRedirect: string;

    /**
     * Relative path to the application callback to process the response from the authorization server.
     * Defaults to `/api/auth/callback`.
     * You can also use the `AUTHOK_CALLBACK` environment variable.
     */
    callback: string;
  };
}

/**
 * Configuration parameters used for the application session.
 *
 * @category Server
 */
export interface SessionConfig {
  /**
   * String value for the cookie name used for the internal session.
   * This value must only include letters, numbers, and underscores.
   * Defaults to `appSession`.
   * You can also use the `AUTHOK_SESSION_NAME` environment variable.
   */
  name: string;

  /**
   * If you want your session duration to be rolling, resetting everytime the
   * user is active on your site, set this to `true`. If you want the session
   * duration to be absolute, where the user gets logged out a fixed time after login
   * regardless of activity, set this to `false`.
   * Defaults to `true`.
   * You can also use the `AUTHOK_SESSION_ROLLING` environment variable.
   */
  rolling: boolean;

  /**
   * Integer value, in seconds, for application session rolling duration.
   * The amount of time for which the user must be idle for then to be logged out.
   * Should be `false` when rolling is `false`.
   * Defaults to `86400` seconds (1 day).
   * You can also use the AUTHOK_SESSION_ROLLING_DURATION environment variable.
   */
  rollingDuration: number | false;

  /**
   * Integer value, in seconds, for application absolute rolling duration.
   * The amount of time after the user has logged in that they will be logged out.
   * Set this to `false` if you don't want an absolute duration on your session.
   * Defaults to `604800` seconds (7 days).
   * You can also use the `AUTHOK_SESSION_ABSOLUTE_DURATION` environment variable.
   */
  absoluteDuration: boolean | number;

  /**
   * Boolean value to store the ID token in the session. Storing it can make the session cookie too
   * large.
   * Defaults to `true`.
   */
  storeIDToken: boolean;

  cookie: CookieConfig;
}

/**
 * Configure how the session cookie and transient cookies are stored.
 *
 * @category Server
 */
export interface CookieConfig {
  /**
   * Domain name for the cookie.
   * You can also use the `AUTHOK_COOKIE_DOMAIN` environment variable.
   */
  domain?: string;

  /**
   * Path for the cookie.
   * Defaults to `/`.
   * You should change this to be more restrictive if you application shares a domain with other apps.
   * You can also use the `AUTHOK_COOKIE_PATH` environment variable.
   */
  path?: string;

  /**
   * Set to `true` to use a transient cookie (cookie without an explicit expiration).
   * Defaults to `false`.
   * You can also use the `AUTHOK_COOKIE_TRANSIENT` environment variable.
   */
  transient: boolean;

  /**
   * Flags the cookie to be accessible only by the web server.
   * Defaults to `true`.
   * You can also use the `AUTHOK_COOKIE_HTTP_ONLY` environment variable.
   */
  httpOnly: boolean;

  /**
   * Marks the cookie to be used over secure channels only.
   * Defaults to the protocol of {@link BaseConfig.baseURL}.
   * You can also use the `AUTHOK_COOKIE_SECURE` environment variable.
   */
  secure?: boolean;

  /**
   * Value of the SameSite `Set-Cookie` attribute.
   * Defaults to `lax` but will be adjusted based on {@link AuthorizationParameters.response_type}.
   * You can also use the `AUTHOK_COOKIE_SAME_SITE` environment variable.
   */
  sameSite: 'lax' | 'strict' | 'none';
}

/**
 * Authorization parameters that will be passed to the identity provider on login.
 *
 * The library uses `response_mode: 'query'` and `response_type: 'code'` (with PKCE) by default.
 *
 * @category Server
 */
export interface AuthorizationParameters extends OidcAuthorizationParameters {
  /**
   * A space-separated list of scopes that will be requested during authentication. For example,
   * `openid profile email offline_access`.
   * Defaults to `openid profile email`.
   */
  scope: string;

  response_mode: 'query' | 'form_post';
  response_type: 'id_token' | 'code id_token' | 'code';
}

/**
 * @category server
 */
export interface NextConfig extends Pick<BaseConfig, 'identityClaimFilter'> {
  /**
   * Log users in to a specific organization.
   *
   * This will specify an `organization` parameter in your user's login request and will add a step to validate
   * the `org_id` claim in your user's ID token.
   *
   * If your app supports multiple organizations, you should take a look at {@link AuthorizationParams.organization}.
   */
  organization?: string;
  routes: {
    callback: string;
    login: string;
    unauthorized: string;
  };
}

/**
 * ## Configuration properties.
 *
 * The Server part of the SDK can be configured in 2 ways.
 *
 * ### 1. Environment Variables
 *
 * The simplest way to use the SDK is to use the named exports ({@link HandleAuth}, {@link HandleLogin},
 * {@link HandleLogout}, {@link HandleCallback}, {@link HandleProfile}, {@link GetSession}, {@link GetAccessToken},
 * {@link WithApiAuthRequired}, and {@link WithPageAuthRequired}).
 *
 * ```js
 * // pages/api/auth/[...authok].js
 * import { handleAuth } from '@authok/nextjs-authok';
 *
 * return handleAuth();
 * ```
 *
 * When you use these named exports, an instance of the SDK is created for you which you can configure using
 * environment variables:
 *
 * ### Required
 *
 * - `AUTHOK_SECRET`: See {@link secret}.
 * - `AUTHOK_ISSUER_BASE_URL`: See {@link issuerBaseURL}.
 * - `AUTHOK_BASE_URL`: See {@link baseURL}.
 * - `AUTHOK_CLIENT_ID`: See {@link clientID}.
 * - `AUTHOK_CLIENT_SECRET`: See {@link clientSecret}.
 *
 * ### Optional
 *
 * - `AUTHOK_CLOCK_TOLERANCE`: See {@link clockTolerance}.
 * - `AUTHOK_HTTP_TIMEOUT`: See {@link httpTimeout}.
 * - `AUTHOK_ENABLE_TELEMETRY`: See {@link enableTelemetry}.
 * - `AUTHOK_IDP_LOGOUT`: See {@link idpLogout}.
 * - `AUTHOK_ID_TOKEN_SIGNING_ALG`: See {@link idTokenSigningAlg}.
 * - `AUTHOK_LEGACY_SAME_SITE_COOKIE`: See {@link legacySameSiteCookie}.
 * - `AUTHOK_IDENTITY_CLAIM_FILTER`: See {@link identityClaimFilter}.
 * - `NEXT_PUBLIC_AUTHOK_LOGIN`: See {@link NextConfig.routes}.
 * - `AUTHOK_CALLBACK`: See {@link BaseConfig.routes}.
 * - `AUTHOK_POST_LOGOUT_REDIRECT`: See {@link BaseConfig.routes}.
 * - `AUTHOK_AUDIENCE`: See {@link BaseConfig.authorizationParams}.
 * - `AUTHOK_SCOPE`: See {@link BaseConfig.authorizationParams}.
 * - `AUTHOK_ORGANIZATION`: See {@link NextConfig.organization}.
 * - `AUTHOK_SESSION_NAME`: See {@link SessionConfig.name}.
 * - `AUTHOK_SESSION_ROLLING`: See {@link SessionConfig.rolling}.
 * - `AUTHOK_SESSION_ROLLING_DURATION`: See {@link SessionConfig.rollingDuration}.
 * - `AUTHOK_SESSION_ABSOLUTE_DURATION`: See {@link SessionConfig.absoluteDuration}.
 * - `AUTHOK_COOKIE_DOMAIN`: See {@link CookieConfig.domain}.
 * - `AUTHOK_COOKIE_PATH`: See {@link CookieConfig.path}.
 * - `AUTHOK_COOKIE_TRANSIENT`: See {@link CookieConfig.transient}.
 * - `AUTHOK_COOKIE_HTTP_ONLY`: See {@link CookieConfig.httpOnly}.
 * - `AUTHOK_COOKIE_SECURE`: See {@link CookieConfig.secure}.
 * - `AUTHOK_COOKIE_SAME_SITE`: See {@link CookieConfig.sameSite}.
 *
 * ### 2. Create your own instance using {@link InitAuthok}
 *
 * If you don't want to configure the SDK with environment variables or you want more fine grained control over the
 * instance, you can create an instance yourself and use the handlers and helpers from that.
 *
 * First, export your configured instance from another module:
 *
 * ```js
 * // utils/authok.js
 * import { initAuthok } from '@authok/nextjs-authok';
 *
 * export default initAuthok({ ...ConfigParameters... });
 * ```
 *
 * Then import it into your route handler:
 *
 * ```js
 * // pages/api/auth/[...authok].js
 * import authok from '../../../../utils/authok';
 *
 * return authok.handleAuth();
 * ```
 *
 * **IMPORTANT** If you use {@link InitAuthok}, you should *not* use the other named exports as they will use a different
 * instance of the SDK. Also note - this is for the server side part of the SDK - you will always use named exports for
 * the front end components: {@Link UserProvider}, {@Link UseUser} and the
 * front end version of {@Link WithPageAuthRequired}
 *
 * @category Server
 */
export type ConfigParameters = DeepPartial<BaseConfig & NextConfig>;

/**
 * @ignore
 */
const FALSEY = ['n', 'no', 'false', '0', 'off'];

/**
 * @ignore
 */
const bool = (param?: any, defaultValue?: boolean): boolean | undefined => {
  if (param === undefined || param === '') return defaultValue;
  if (param && typeof param === 'string') return !FALSEY.includes(param.toLowerCase().trim());
  return !!param;
};

/**
 * @ignore
 */
const num = (param?: string): number | undefined => (param === undefined || param === '' ? undefined : +param);

/**
 * @ignore
 */
const array = (param?: string): string[] | undefined =>
  param === undefined || param === '' ? undefined : param.replace(/\s/g, '').split(',');

/**
 * @ignore
 */
export const getLoginUrl = (): string => {
  return process.env.NEXT_PUBLIC_AUTHOK_LOGIN || '/api/auth/login';
};

/**
 * @ignore
 */
export const getConfig = (params: ConfigParameters = {}): { baseConfig: BaseConfig; nextConfig: NextConfig } => {
  // Don't use destructuring here so that the `DefinePlugin` can replace any env vars specified in `next.config.js`
  const AUTHOK_SECRET = process.env.AUTHOK_SECRET;
  const AUTHOK_ISSUER_BASE_URL = process.env.AUTHOK_ISSUER_BASE_URL;
  const AUTHOK_BASE_URL = process.env.AUTHOK_BASE_URL;
  const AUTHOK_CLIENT_ID = process.env.AUTHOK_CLIENT_ID;
  const AUTHOK_CLIENT_SECRET = process.env.AUTHOK_CLIENT_SECRET;
  const AUTHOK_CLOCK_TOLERANCE = process.env.AUTHOK_CLOCK_TOLERANCE;
  const AUTHOK_HTTP_TIMEOUT = process.env.AUTHOK_HTTP_TIMEOUT;
  const AUTHOK_ENABLE_TELEMETRY = process.env.AUTHOK_ENABLE_TELEMETRY;
  const AUTHOK_IDP_LOGOUT = process.env.AUTHOK_IDP_LOGOUT;
  const AUTHOK_ID_TOKEN_SIGNING_ALG = process.env.AUTHOK_ID_TOKEN_SIGNING_ALG;
  const AUTHOK_LEGACY_SAME_SITE_COOKIE = process.env.AUTHOK_LEGACY_SAME_SITE_COOKIE;
  const AUTHOK_IDENTITY_CLAIM_FILTER = process.env.AUTHOK_IDENTITY_CLAIM_FILTER;
  const AUTHOK_CALLBACK = process.env.AUTHOK_CALLBACK;
  const AUTHOK_POST_LOGOUT_REDIRECT = process.env.AUTHOK_POST_LOGOUT_REDIRECT;
  const AUTHOK_AUDIENCE = process.env.AUTHOK_AUDIENCE;
  const AUTHOK_SCOPE = process.env.AUTHOK_SCOPE;
  const AUTHOK_ORGANIZATION = process.env.AUTHOK_ORGANIZATION;
  const AUTHOK_SESSION_NAME = process.env.AUTHOK_SESSION_NAME;
  const AUTHOK_SESSION_ROLLING = process.env.AUTHOK_SESSION_ROLLING;
  const AUTHOK_SESSION_ROLLING_DURATION = process.env.AUTHOK_SESSION_ROLLING_DURATION;
  const AUTHOK_SESSION_ABSOLUTE_DURATION = process.env.AUTHOK_SESSION_ABSOLUTE_DURATION;
  const AUTHOK_SESSION_STORE_ID_TOKEN = process.env.AUTHOK_SESSION_STORE_ID_TOKEN;
  const AUTHOK_COOKIE_DOMAIN = process.env.AUTHOK_COOKIE_DOMAIN;
  const AUTHOK_COOKIE_PATH = process.env.AUTHOK_COOKIE_PATH;
  const AUTHOK_COOKIE_TRANSIENT = process.env.AUTHOK_COOKIE_TRANSIENT;
  const AUTHOK_COOKIE_HTTP_ONLY = process.env.AUTHOK_COOKIE_HTTP_ONLY;
  const AUTHOK_COOKIE_SECURE = process.env.AUTHOK_COOKIE_SECURE;
  const AUTHOK_COOKIE_SAME_SITE = process.env.AUTHOK_COOKIE_SAME_SITE;

  const baseURL =
    AUTHOK_BASE_URL && !/^https?:\/\//.test(AUTHOK_BASE_URL as string) ? `https://${AUTHOK_BASE_URL}` : AUTHOK_BASE_URL;

  const { organization, ...baseParams } = params;

  const baseConfig = getBaseConfig({
    secret: AUTHOK_SECRET,
    issuerBaseURL: AUTHOK_ISSUER_BASE_URL,
    baseURL: baseURL,
    clientID: AUTHOK_CLIENT_ID,
    clientSecret: AUTHOK_CLIENT_SECRET,
    clockTolerance: num(AUTHOK_CLOCK_TOLERANCE),
    httpTimeout: num(AUTHOK_HTTP_TIMEOUT),
    enableTelemetry: bool(AUTHOK_ENABLE_TELEMETRY),
    idpLogout: bool(AUTHOK_IDP_LOGOUT, true),
    authokLogout: bool(AUTHOK_IDP_LOGOUT, true),
    idTokenSigningAlg: AUTHOK_ID_TOKEN_SIGNING_ALG,
    legacySameSiteCookie: bool(AUTHOK_LEGACY_SAME_SITE_COOKIE),
    identityClaimFilter: array(AUTHOK_IDENTITY_CLAIM_FILTER),
    ...baseParams,
    authorizationParams: {
      response_type: 'code',
      audience: AUTHOK_AUDIENCE,
      scope: AUTHOK_SCOPE,
      ...baseParams.authorizationParams
    },
    session: {
      name: AUTHOK_SESSION_NAME,
      rolling: bool(AUTHOK_SESSION_ROLLING),
      rollingDuration:
        AUTHOK_SESSION_ROLLING_DURATION && isNaN(Number(AUTHOK_SESSION_ROLLING_DURATION))
          ? (bool(AUTHOK_SESSION_ROLLING_DURATION) as false)
          : num(AUTHOK_SESSION_ROLLING_DURATION),
      absoluteDuration:
        AUTHOK_SESSION_ABSOLUTE_DURATION && isNaN(Number(AUTHOK_SESSION_ABSOLUTE_DURATION))
          ? bool(AUTHOK_SESSION_ABSOLUTE_DURATION)
          : num(AUTHOK_SESSION_ABSOLUTE_DURATION),
      storeIDToken: bool(AUTHOK_SESSION_STORE_ID_TOKEN),
      ...baseParams.session,
      cookie: {
        domain: AUTHOK_COOKIE_DOMAIN,
        path: AUTHOK_COOKIE_PATH || '/',
        transient: bool(AUTHOK_COOKIE_TRANSIENT),
        httpOnly: bool(AUTHOK_COOKIE_HTTP_ONLY),
        secure: bool(AUTHOK_COOKIE_SECURE),
        sameSite: AUTHOK_COOKIE_SAME_SITE as 'lax' | 'strict' | 'none' | undefined,
        ...baseParams.session?.cookie
      }
    },
    routes: {
      callback: baseParams.routes?.callback || AUTHOK_CALLBACK || '/api/auth/callback',
      postLogoutRedirect: baseParams.routes?.postLogoutRedirect || AUTHOK_POST_LOGOUT_REDIRECT
    }
  });

  const nextConfig = {
    routes: {
      ...baseConfig.routes,
      login: baseParams.routes?.login || getLoginUrl(),
      unauthorized: baseParams.routes?.unauthorized || '/api/auth/401'
    },
    identityClaimFilter: baseConfig.identityClaimFilter,
    organization: organization || AUTHOK_ORGANIZATION
  };

  return { baseConfig, nextConfig };
};
