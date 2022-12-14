![nextjs-authok](https://cdn.authok.cn/website/sdks/banners/nextjs-authok-banner.png)

The Authok Next.js SDK is a library for implementing user authentication in Next.js applications.

![Release](https://img.shields.io/npm/v/@authok/nextjs-authok)
[![Coverage](https://img.shields.io/badge/dynamic/json?color=brightgreen&label=coverage&query=jest.coverageThreshold.global.lines&suffix=%25&url=https%3A%2F%2Fraw.githubusercontent.com%2Fauthok%2Fnextjs-authok%2Fmain%2Fpackage.json)](https://github.com/authok/nextjs-authok/blob/main/package.json#L147)
![Downloads](https://img.shields.io/npm/dw/@authok/nextjs-authok)
[![License](https://img.shields.io/:license-mit-blue.svg?style=flat)](https://opensource.org/licenses/MIT)
![CircleCI](https://img.shields.io/circleci/build/github/authok/nextjs-authok)

ð [ææ¡£](#documentation) - ð [å¿«éå¼å§](#getting-started)- ð» [API åè](#api-reference) - ð¬ [åé¦](#feedback)

## ææ¡£

- [å¿«éå¼å§](https://authok.cn/docs/quickstart/webapp/nextjs)- å¨æ¨ç Next.js åºç¨ä¸­å¼å¥ authok.
- [FAQs](https://github.com/authok/nextjs-authok/blob/main/FAQ.md) - å³äº nextjs-authok çå¸¸è§é®é¢.
- [ç¤ºä¾](https://github.com/authok/nextjs-authok/blob/main/EXAMPLES.md) - ä¸åä½¿ç¨åºæ¯çç¤ºä¾.
- [å®å¨](https://github.com/authok/nextjs-authok/blob/main/SECURITY.md) - ä¸äºéè¦çå®å¨æ³¨æäºé¡¹.
- [æ¶æ](https://github.com/authok/nextjs-authok/blob/main/ARCHITECTURE.md) - SDK çæ¶æ.
- [æµè¯](https://github.com/authok/nextjs-authok/blob/main/TESTING.md) - æµè¯ nextjs-authok åºç¨çä¸äºè¾å©.
- [é¨ç½²](https://github.com/authok/nextjs-authok/blob/main/examples/README.md) - å¦ä½å°ç¤ºä¾åºç¨ç¨åºé¨ç½²å° Vercel.
- [ææ¡£ç½ç«](https://authok.cn/docs) - æµè§æä»¬çææ¡£ç½ç«ï¼äºè§£æå³Authokçæ´å¤ä¿¡æ¯.

## å¿«éå¼å§

### å®è£

ä½¿ç¨ [npm](https://npmjs.org):

```sh
npm install @authok/nextjs-authok
```

æ¬æ¨¡åæ¯æä»¥ä¸æ ¸å¿åºçæ¬:

- Node.js: 12 LTS and newer LTS releases are supported.
- Next.js: `>=10`

### Authok éç½®

å¨ [Authok ä»ªè¡¨ç](https://mgmt.authok.cn/#/applications) åå»ºä¸ä¸ª **å¸¸è§ Web åºç¨**.

> **If you're using an existing application**, verify that you have configured the following settings in your Regular Web Application:
>
> - å¨åºç¨é¡µé¢ç¹å» "è®¾ç½®" æ ç­¾.
> - ç¹å» "æ¾ç¤ºé«çº§è®¾ç½®" é¾æ¥.
> - å¨ "é«çº§è®¾ç½®" ä¸­, ç¹å» "OAuth" æ ç­¾é¡µ.
> - ç¡®ä¿ "JsonWebToken ç­¾åç®æ³" è®¾ç½®ä¸º `RS256` è¿æ "OIDC Conformant" è¢«å¯ç¨.

æ¥ä¸æ¥, å¨ "è®¾ç½®" é¡µé¢ ç "åºç¨ URIs" é¨åéç½®å¦ä¸ URL:

- **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback`
- **Allowed Logout URLs**: `http://localhost:3000/`

å¨ "åºæ¬ä¿¡æ¯" é¨å è·å **Client ID**, **Client Secret**, å **Domain** . ä½ å°ä¼å¨åç»­æ­¥éª¤ç¨å°è¿äºéç½®.

### åºæ¬è®¾ç½®

#### éç½®åºç¨

ä½ éè¦åè®¸ä½ ç Next.js åºç¨ ä¸ Authok æ­£ç¡®éä¿¡. ä½ å¯ä»¥å¨é¡¹ç®æ ¹ç®å½ä¸åå»º `.env.local` æä»¶, è¯¥æä»¶å®ä¹äºå¿è¦ç Authok éç½®:

```bash
# A long, secret value used to encrypt the session cookie
AUTHOK_SECRET='LONG_RANDOM_VALUE'
# The base url of your application
AUTHOK_BASE_URL='http://localhost:3000'
# The url of your Authok tenant domain
AUTHOK_ISSUER_BASE_URL='https://YOUR_AUTHOK_DOMAIN.authok.cn'
# Your Authok application's Client ID
AUTHOK_CLIENT_ID='YOUR_AUTHOK_CLIENT_ID'
# Your Authok application's Client Secret
AUTHOK_CLIENT_SECRET='YOUR_AUTHOK_CLIENT_SECRET'
```

ä½ å¯ä»¥æ§è¡ä»¥ä¸å½ä»¤æ¥ä¸º `AUTHOK_SECRET` çæåéçå¼:

```bash
node -e "console.log(crypto.randomBytes(32).toString('hex'))"
```

ä½ å¯ä»¥å¨ "æ¨¡åéç½®" ææ¡£ç ["Configuration properties"](https://authok.github.io/nextjs-authok/modules/config.html#configuration-properties)ç« èæ¥ç Authok éç½®éé¡¹çå®æ´åè¡¨.

> For more details about loading environment variables in Next.js, visit the ["Environment Variables"](https://nextjs.org/docs/basic-features/environment-variables) document.

#### æ·»å å¨æ API è·¯ç±

å¨ Next.js åºç¨ç `/pages/api` ç®å½ä¸­åå»ºä¸ä¸ª [catch-all, dynamic API route handler](https://nextjs.org/docs/api-routes/dynamic-api-routes#optional-catch-all-api-routes):

- å¨ `/pages/api/` ä¸åå»ºä¸ä¸ª `auth` ç®å½.

- å¨ `auth` ç®å½ä¸ åå»ºä¸ä¸ª `[...authok].js` æä»¶.

è®¿é® å¨æ API è·¯ç±æä»¶ çè·¯å¾ä¸º `/pages/api/auth/[...authok].js`. æå¦ä¸æ¹å¼å¡«åè¯¥æä»¶:

```js
import { handleAuth } from '@authok/nextjs-authok';

export default handleAuth();
```

æ§è¡ `handleAuth()` å°å¨åå°åå»ºä»¥ä¸è·¯ç±å¤çå¨ï¼ä»¥ä¹è¡èº«ä»½éªè¯æµçä¸åé¨å:

- `/api/auth/login`: ä½ ç Next.js åºç¨éå®åç¨æ·å°èº«ä»½æä¾èè¿è¡ç»å½ (ä½ å¯ä»¥ä¼ éä¸ä¸ªå¯éåæ° `returnTo`ï¼ç¨äºå¨ç»å½åè·³è½¬å°èªå®ä¹çç¸å¯¹URL, ä¾å¦ `/api/auth/login?returnTo=/profile`).
- `/api/auth/callback`: ç»å½æååï¼èº«ä»½æä¾èéå®åç¨æ·å°æ­¤è·¯ç±.
- `/api/auth/logout`: Next.js åºç¨éç»ç¨æ·.
- `/api/auth/me`: ç¨äºè·åJSONæ ¼å¼çç¨æ·è¯¦æ.

#### æ UserProvider æ·»å å° èªå®ä¹ App

ç¨ `UserProvider` ç»ä»¶æ¥åè£ `pages/_app.js` ç»ä»¶:

```jsx
// pages/_app.js
import React from 'react';
import { UserProvider } from '@authok/nextjs-authok/client';

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
```

#### ä½¿ç¨èº«ä»½è®¤è¯

ç°å¨ï¼ä½ å¯ä»¥éè¿æ£æ¥ `useUser()` è¿åç `user` å¯¹è±¡æ¯å¦å·²å®ä¹æ¥ç¡®å®ç¨æ·æ¯å¦éè¿èº«ä»½éªè¯. ä½ è¿å¯ä»¥ä» Next.js åºç¨çåç«¯æ¥ ç»å½ æ æ³¨éç¨æ·(éè¿éå®åå°å¯¹åºçèªå¨çæçè·¯ç±):

```jsx
// pages/index.js
import { useUser } from '@authok/nextjs-authok/client';

export default function Index() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <div>
        Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
      </div>
    );
  }

  return <a href="/api/auth/login">Login</a>;
}
```

> Next linting rules å¯ä»¥è½å»ºè®®ä½¿ç¨ `Link` ç»ä»¶æ¥æ¿ä»£ a æ ç­¾. `Link` ç»ä»¶ä¼æ§è¡ [client-side transitions between pages](https://nextjs.org/docs/api-reference/next/link). èé¾æ¥æåçæ¯ API è·¯ç±èä¸æ¯é¡µé¢, å æ­¤ä½ éè¦ä½¿ç¨ a æ ç­¾.

There are two additional ways to check for an authenticated user; one for Next.js pages using [withPageAuthRequired](https://authok.github.io/nextjs-authok/modules/helpers_with_page_auth_required.html#withpageauthrequired) and one for Next.js API routes using [withAPIAuthRequired](https://authok.github.io/nextjs-authok/modules/helpers_with_api_auth_required.html#withapiauthrequired).

å¶å®ç»¼åç¤ºä¾, åè [EXAMPLES.md](https://github.com/authok/nextjs-authok/blob/main/EXAMPLES.md) ææ¡£.

## API åè

### Server (for Node.js)

`import * from @authok/nextjs-authok`

- [Configuration Options and Environment variables](https://authok.github.io/nextjs-authok/modules/config.html)
- [initAuthok](https://authok.github.io/nextjs-authok/modules/index.html#initauthok)
- [handleAuth](https://authok.github.io/nextjs-authok/modules/handlers_auth.html)
- [handleLogin](https://authok.github.io/nextjs-authok/modules/handlers_login.html#handlelogin)
- [handleCallback](https://authok.github.io/nextjs-authok/modules/handlers_callback.html)
- [handleLogout](https://authok.github.io/nextjs-authok/modules/handlers_logout.html)
- [handleProfile](https://authok.github.io/nextjs-authok/modules/handlers_profile.html)
- [withApiAuthRequired](https://authok.github.io/nextjs-authok/modules/helpers_with_api_auth_required.html)
- [withPageAuthRequired](https://authok.github.io/nextjs-authok/modules/helpers_with_page_auth_required.html#withpageauthrequired)
- [getSession](https://authok.github.io/nextjs-authok/modules/session_get_session.html)
- [updateSession](https://authok.github.io/nextjs-authok/modules/session_update_session.html)
- [getAccessToken](https://authok.github.io/nextjs-authok/modules/session_get_access_token.html)

### Edge (for Middleware and the Edge runtime)

`import * from @authok/nextjs-authok/edge`

- [Configuration Options and Environment variables](https://authok.github.io/nextjs-authok/modules/config.html)
- [initAuthok](https://authok.github.io/nextjs-authok/modules/edge.html#initauthok-1)
- [withMiddlewareAuthRequired](https://authok.github.io/nextjs-authok/modules/helpers_with_middleware_auth_required.html)
- [getSession](https://authok.github.io/nextjs-authok/modules/edge.html#getsession-1)

### Client (for the Browser)

`import * from @authok/nextjs-authok/client`

- [UserProvider](https://authok.github.io/nextjs-authok/modules/client_use_user.html#userprovider)
- [useUser](https://authok.github.io/nextjs-authok/modules/client_use_user.html)
- [withPageAuthRequired](https://authok.github.io/nextjs-authok/modules/client_with_page_auth_required.html)

### Testing helpers

`import * from @authok/nextjs-authok/testing`

- [generateSessionCookie](https://authok.github.io/nextjs-authok/modules/helpers_testing.html#generatesessioncookie)

åèèªå¨çæç [API ææ¡£](https://authok.github.io/nextjs-authok/) è·åæ´å¤ç»è

### Cookies and Security

All cookies will be set to `HttpOnly, SameSite=Lax` and will be set to `Secure` if the application's `AUTHOK_BASE_URL` is `https`.

The `HttpOnly` setting will make sure that client-side JavaScript is unable to access the cookie to reduce the attack surface of [XSS attacks](https://authok.com/blog/developers-guide-to-common-vulnerabilities-and-how-to-prevent-them/#Cross-Site-Scripting--XSS-).

The `SameSite=Lax` setting will help mitigate CSRF attacks. Learn more about SameSite by reading the ["Upcoming Browser Behavior Changes: What Developers Need to Know"](https://authok.cn/blog/browser-behavior-changes-what-developers-need-to-know/) blog post.

### Caching and Security

Many hosting providers will offer to cache your content at the edge in order to serve data to your users as fast as possible. For example Vercel will [cache your content on the Vercel Edge Network](https://vercel.com/docs/concepts/edge-network/caching) for all static content and Serverless Functions if you provide the necessary caching headers on your response.

It's generally a bad idea to cache any response that requires authentication, even if the response's content appears safe to cache there may be other data in the response that isn't.

This SDK offers a rolling session by default, which means that any response that reads the session will have a `Set-Cookie` header to update the cookie's expiry. Vercel and potentially other hosting providers include the `Set-Cookie` header in the cached response, so even if you think the response's content can be cached publicly, the responses `Set-Cookie` header cannot.

Check your hosting provider's caching rules, but in general you should **never** cache responses that either require authentication or even touch the session to check authentication (eg when using `withApiAuthRequired`, `withPageAuthRequired` or even just `getSession` or `getAccessToken`).

### Error Handling and Security

Errors that come from Authok in the `redirect_uri` callback may contain reflected user input via the OpenID Connect `error` and `error_description` query parameter. Because of this, we do some [basic escaping](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#rule-1-html-encode-before-inserting-untrusted-data-into-html-element-content) on the `message`, `error` and `error_description` properties of the `IdentityProviderError`.

But, if you write your own error handler, you should **not** render the error `message`, or `error` and `error_description` properties without using a templating engine that will properly escape them for other HTML contexts first.

### Base Path and Internationalized Routing

With Next.js you can deploy a Next.js application under a sub-path of a domain using [Base Path](https://nextjs.org/docs/api-reference/next.config.js/basepath) and serve internationalized (i18n) routes using [Internationalized Routing](https://nextjs.org/docs/advanced-features/i18n-routing).

If you use these features the urls of your application will change and so the urls to the nextjs-authok routes will change. To accommodate this there are various places in the SDK that you can customise the url.

For example, if `basePath: '/foo'` you should prepend this to the `loginUrl` and `profileUrl` specified in your `AuthokProvider`:

```jsx
// _app.jsx
function App({ Component, pageProps }) {
  return (
    <UserProvider loginUrl="/foo/api/auth/login" profileUrl="/foo/api/auth/me">
      <Component {...pageProps} />
    </UserProvider>
  );
}
```

Also, any links to login or logout should include the `basePath`:

```html
<a href="/foo/api/auth/login">Login</a><br />
<a href="/foo/api/auth/logout">Logout</a>
```

You should configure the [baseUrl](https://authok.github.io/nextjs-authok/interfaces/config.baseconfig.html#baseurl) (or the `AUTHOK_BASE_URL` environment variable). For example:

```shell
# .env.local
AUTHOK_BASE_URL=http://localhost:3000/foo
```

For any pages that are protected with the Server Side [withPageAuthRequired](https://authok.github.io/nextjs-authok/modules/helpers_with_page_auth_required.html#withpageauthrequired) you should update the `returnTo` parameter depending on the `basePath` and `locale` if necessary.

```js
// ./pages/my-ssr-page.jsx
export default MySsrPage = () => <></>;

const getFullReturnTo = (ctx) => {
  // TODO: implement getFullReturnTo based on the ctx.resolvedUrl, ctx.locale
  // and your next.config.js's basePath and i18n settings.
  return '/foo/en-US/my-ssr-page';
};

export const getServerSideProps = (ctx) => {
  const returnTo = getFullReturnTo(ctx.req);
  return withPageAuthRequired({ returnTo })(ctx);
};
```

### å¯¹æ¯ Authok React SDK

We also provide an Authok React SDK, [authok-react](https://github.com/authok/authok-react), which may be suitable for your Next.js application.

The SPA security model used by `authok-react` is different from the Web Application security model used by this SDK. In short, this SDK protects pages and API routes with a cookie session (see ["Cookies and Security"](#cookies-and-security)). A SPA library like `authok-react` will store the user's ID token and access token directly in the browser and use them to access external APIs directly.

You should be aware of the security implications of both models. However, [authok-react](https://github.com/authok/authok-react) may be more suitable for your needs if you meet any of the following scenarios:

- You are using [Static HTML Export](https://nextjs.org/docs/advanced-features/static-html-export) with Next.js.
- You do not need to access user data during server-side rendering.
- You want to get the access token and call external API's directly from the frontend layer rather than using Next.js API routes as a proxy to call external APIs.

### Testing

By default, the SDK creates and manages a singleton instance to run for the lifetime of the application. When testing your application, you may need to reset this instance, so its state does not leak between tests.

If you're using Jest, we recommend using `jest.resetModules()` after each test. Alternatively, you can look at [creating your own instance of the SDK](./EXAMPLES.md#create-your-own-instance-of-the-sdk), so it can be recreated between tests.

For end to end tests, have a look at how we use a [mock OIDC Provider](./scripts/oidc-provider.js).

# é¨ç½²
åè [å¦ä½å°ç¤ºä¾åºç¨ç¨åºé¨ç½²å° Vercel](./examples/README.md).

## æç®

We appreciate feedback and contribution to this repo! Before you get started, please read the following:

- [Authok's general contribution guidelines](https://github.com/authok/open-source-template/blob/master/GENERAL-CONTRIBUTING.md)
- [Authok's code of conduct guidelines](https://github.com/authok/express-openid-connect/blob/master/CODE-OF-CONDUCT.md)
- [This repo's contribution guide](./CONTRIBUTING.md)

## Vulnerability Reporting

Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://authok.cn/responsible-disclosure-policy) details the procedure for disclosing security issues.

## Authok æ¯ä»ä¹?

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.authok.cn/website/sdks/logos/authok_dark_mode.png" width="150">
    <source media="(prefers-color-scheme: light)" srcset="https://cdn.authok.cn/website/sdks/logos/authok_light_mode.png" width="150">
    <img alt="Authok Logo" src="https://cdn.authok.cn/website/sdks/logos/authok_light_mode.png" width="150">
  </picture>
</p>
<p align="center">
  Authok is an easy to implement, adaptable authentication and authorization platform. To learn more checkout <a href="https://authok.cn/why-authok">Why Authok?</a>
</p>
<p align="center">
  This project is licensed under the MIT license. See the <a href="https://github.com/authok/express-openid-connect/blob/master/LICENSE"> LICENSE</a> file for more info.
</p>
