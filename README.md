![nextjs-authok](https://cdn.authok.cn/website/sdks/banners/nextjs-authok-banner.png)

The Authok Next.js SDK is a library for implementing user authentication in Next.js applications.

![Release](https://img.shields.io/npm/v/@authok/nextjs-authok)
[![Coverage](https://img.shields.io/badge/dynamic/json?color=brightgreen&label=coverage&query=jest.coverageThreshold.global.lines&suffix=%25&url=https%3A%2F%2Fraw.githubusercontent.com%2Fauthok%2Fnextjs-authok%2Fmain%2Fpackage.json)](https://github.com/authok/nextjs-authok/blob/main/package.json#L147)
![Downloads](https://img.shields.io/npm/dw/@authok/nextjs-authok)
[![License](https://img.shields.io/:license-mit-blue.svg?style=flat)](https://opensource.org/licenses/MIT)
![CircleCI](https://img.shields.io/circleci/build/github/authok/nextjs-authok)

📚 [文档](#documentation) - 🚀 [快速开始](#getting-started)- 💻 [API 参考](#api-reference) - 💬 [反馈](#feedback)

## 文档

- [快速开始](https://authok.cn/docs/quickstart/webapp/nextjs)- 在您的 Next.js 应用中引入 authok.
- [FAQs](https://github.com/authok/nextjs-authok/blob/main/FAQ.md) - 关于 nextjs-authok 的常见问题.
- [示例](https://github.com/authok/nextjs-authok/blob/main/EXAMPLES.md) - 不同使用场景的示例.
- [安全](https://github.com/authok/nextjs-authok/blob/main/SECURITY.md) - 一些重要的安全注意事项.
- [架构](https://github.com/authok/nextjs-authok/blob/main/ARCHITECTURE.md) - SDK 的架构.
- [测试](https://github.com/authok/nextjs-authok/blob/main/TESTING.md) - 测试 nextjs-authok 应用的一些辅助.
- [部署](https://github.com/authok/nextjs-authok/blob/main/examples/README.md) - 如何将示例应用程序部署到 Vercel.
- [文档网站](https://authok.cn/docs) - 浏览我们的文档网站，了解有关Authok的更多信息.

## 快速开始

### 安装

使用 [npm](https://npmjs.org):

```sh
npm install @authok/nextjs-authok
```

This library supports the following tooling versions:

- Node.js: 12 LTS and newer LTS releases are supported.
- Next.js: `>=10`

### Authok 配置

在 [Authok 仪表盘](https://mgmt.authok.cn/#/applications) 创建一个 **常规 Web 应用**.

> **If you're using an existing application**, verify that you have configured the following settings in your Regular Web Application:
>
> - Click on the "Settings" tab of your application's page.
> - Scroll down and click on the "Show Advanced Settings" link.
> - Under "Advanced Settings", click on the "OAuth" tab.
> - Ensure that "JsonWebToken Signature Algorithm" is set to `RS256` and that "OIDC Conformant" is enabled.

接下来, 在 "设置" 页面 的 "应用 URIs" 部分配置如下 URL:

- **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback`
- **Allowed Logout URLs**: `http://localhost:3000/`

在 "基本信息" 部分 获取 **Client ID**, **Client Secret**, 和 **Domain** . 你将会在后续步骤用到这些配置.

### 基本设置

#### 配置应用

You need to allow your Next.js application to communicate properly with Authok. You can do so by creating a `.env.local` file under your root project directory that defines the necessary Authok configuration values as follows:

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

You can execute the following command to generate a suitable string for the `AUTHOK_SECRET` value:

```bash
node -e "console.log(crypto.randomBytes(32).toString('hex'))"
```

You can see a full list of Authok configuration options in the ["Configuration properties"](https://authok.github.io/nextjs-authok/modules/config.html#configuration-properties) section of the "Module config" document.

> For more details about loading environment variables in Next.js, visit the ["Environment Variables"](https://nextjs.org/docs/basic-features/environment-variables) document.

#### Add the Dynamic API Route

Go to your Next.js application and create a [catch-all, dynamic API route handler](https://nextjs.org/docs/api-routes/dynamic-api-routes#optional-catch-all-api-routes) under the `/pages/api` directory:

- Create an `auth` directory under the `/pages/api/` directory.

- Create a `[...authok].js` file under the newly created `auth` directory.

The path to your dynamic API route file would be `/pages/api/auth/[...authok].js`. Populate that file as follows:

```js
import { handleAuth } from '@authok/nextjs-authok';

export default handleAuth();
```

Executing `handleAuth()` creates the following route handlers under the hood that perform different parts of the authentication flow:

- `/api/auth/login`: Your Next.js application redirects users to your identity provider for them to log in (you can optionally pass a `returnTo` parameter to return to a custom relative URL after login, for example `/api/auth/login?returnTo=/profile`).
- `/api/auth/callback`: Your identity provider redirects users to this route after they successfully log in.
- `/api/auth/logout`: Your Next.js application logs out the user.
- `/api/auth/me`: You can fetch user profile information in JSON format.

#### Add the UserProvider to Custom App

Wrap your `pages/_app.js` component with the `UserProvider` component:

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

#### Consume Authentication

现在，你可以通过检查 `useUser()` 返回的 `user` 对象是否已定义来确定用户是否通过身份验证. 你还可以从 Next.js 应用的前端来 登录 或 注销用户(通过重定向到对应的自动生成的路由):

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

> Next linting rules might suggest using the `Link` component instead of an anchor tag. The `Link` component is meant to perform [client-side transitions between pages](https://nextjs.org/docs/api-reference/next/link). As the links point to an API route and not to a page, you should keep them as anchor tags.

There are two additional ways to check for an authenticated user; one for Next.js pages using [withPageAuthRequired](https://authok.github.io/nextjs-authok/modules/helpers_with_page_auth_required.html#withpageauthrequired) and one for Next.js API routes using [withAPIAuthRequired](https://authok.github.io/nextjs-authok/modules/helpers_with_api_auth_required.html#withapiauthrequired).

其它综合示例, 参考 [EXAMPLES.md](https://github.com/authok/nextjs-authok/blob/main/EXAMPLES.md) 文档.

## API 参考

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

参考自动生成的 [API 文档](https://authok.github.io/nextjs-authok/) 获取更多细节

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

### 对比 Authok React SDK

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

# Deploying

For deploying, have a look at [how we deploy our example app to Vercel](./examples/README.md).

## Contributing

We appreciate feedback and contribution to this repo! Before you get started, please read the following:

- [Authok's general contribution guidelines](https://github.com/authok/open-source-template/blob/master/GENERAL-CONTRIBUTING.md)
- [Authok's code of conduct guidelines](https://github.com/authok/express-openid-connect/blob/master/CODE-OF-CONDUCT.md)
- [This repo's contribution guide](./CONTRIBUTING.md)

## Vulnerability Reporting

Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://authok.cn/responsible-disclosure-policy) details the procedure for disclosing security issues.

## What is Authok?

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
