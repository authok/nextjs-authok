# 示例

- [示例](#示例)
  - [基本设置](#基本设置)
  - [自定义处理程序行为](#自定义处理程序行为)
  - [使用自定义的身份验证URL](#使用自定义的身份验证url)
  - [保护 服务端渲染(SSR)页面](#保护-服务端渲染ssr页面)
  - [保护客户端渲染(CSR)页面](#保护客户端渲染csr页面)
  - [保护 API 路由](#保护-api-路由)
  - [用中间件保护页面](#用中间件保护页面)
  - [从API路由访问外部API](#从api路由访问外部api)
    - [获取刷新令牌(Refresh Token)](#获取刷新令牌refresh-token)
  - [创建自己的SDK实例](#创建自己的sdk实例)
- [添加注册处理程序](#添加注册处理程序)
  - [Use with Base Path and Internationalized Routing](#use-with-base-path-and-internationalized-routing)
  - [把基本路径和国际化路由一起使用](#把基本路径和国际化路由一起使用)

所有例子都可以在 [Kitchen Sink 示例应用](./examples/kitchen-sink-example) 中查看.

## 基本设置

在应用程序根目录的 `.env.local` 文件中配置所需选项:

```sh
AUTHOK_SECRET='LONG_RANDOM_VALUE'
AUTHOK_BASE_URL='http://localhost:3000'
AUTHOK_ISSUER_BASE_URL='https://your-tenant.cn.authok.cn'
AUTHOK_CLIENT_ID='CLIENT_ID'
AUTHOK_CLIENT_SECRET='CLIENT_SECRET'
```

Create a [dynamic API route handler](https://nextjs.org/docs/api-routes/dynamic-api-routes) at `/pages/api/auth/[...authok].js`.

```js
import { handleAuth } from '@authok/nextjs-authok';

export default handleAuth();
```

This will create the following urls: `/api/auth/login`, `/api/auth/callback`, `/api/auth/logout` and `/api/auth/me`.

Wrap your `pages/_app.jsx` component in the `UserProvider` component.

```jsx
// pages/_app.jsx
import React from 'react';
import { UserProvider } from '@authok/nextjs-authok/client';

export default function App({ Component, pageProps }) {
  // 你可以在需要服务端渲染的页面中 选择性传递 `user` 属性， 以预先执行 `useUser` hook.
  const { user } = pageProps;

  return (
    <UserProvider user={user}>
      <Component {...pageProps} />
    </UserProvider>
  );
}
```

使用 `useUser` hook 检查用户的身份状态，并从前端登录或注销.

```jsx
// pages/index.jsx
import { useUser } from '@authok/nextjs-authok/client';

export default () => {
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
};
```

查看 `basic-example` 应用 [./examples/basic-example](./examples/basic-example).

## 自定义处理程序行为

将自定义参数传递给 身份验证处理程序 或 添加自己的 日志 和 错误处理.

```js
// pages/api/auth/[...authok].js
import { handleAuth, handleLogin } from '@authok/nextjs-authok';
import { myCustomLogger, myCustomErrorReporter } from '../utils';

export default handleAuth({
  async login(req, res) {
    // Add your own custom logger
    myCustomLogger('Logging in');
    // Pass custom parameters to login
    await handleLogin(req, res, {
      authorizationParams: {
        custom_param: 'custom'
      },
      returnTo: '/custom-page'
    });
  },
  invite: loginHandler({
    authorizationParams: (req) => {
      invitation: req.query.invitation;
    }
  }),
  'login-with-google': loginHandler({ authorizationParams: { connection: 'google' } }),
  'refresh-profile': profileHandler({ refetch: true }),
  onError(req, res, error) {
    // Add your own custom error handling
    myCustomErrorReporter(error);
    res.status(error.status || 400).end();
  }
});
```

## 使用自定义的身份验证URL

除了创建 `/pages/api/auth/[...authok].js` 来处理所有请求, 你还可以用不同 url 单独创建它们.

例如, 登录:

```js
// api/custom-login.js
import { handleLogin } from '@authok/nextjs-authok';

export default async function login(req, res) {
  try {
    await handleLogin(req, res);
  } catch (error) {
    res.status(error.status || 400).end(error.message);
  }
}
```

```jsx
// components/login-button.js
export default () => <a href="/api/custom-login">Login</a>;
```

> 注意: 如果你自定义了 登录 url, 你需要同时对应设置环境变量 `NEXT_PUBLIC_AUTHOK_LOGIN` 以确保 `withPageAuthRequired` 工作正常. 如果你自定义了 profile url, 你同样要设置 `NEXT_PUBLIC_AUTHOK_PROFILE` 以确保 `useUser` hook 工作正常.

## 保护 服务端渲染(SSR)页面

如果没有携带有效 session cookie 请求 `/pages/profile`, 将会被重定向到登录页面.

```jsx
// pages/profile.js
import { withPageAuthRequired } from '@authok/nextjs-authok';

export default function Profile({ user }) {
  return <div>Hello {user.name}</div>;
}

// 你可以可选的传递自定义的 `getServerSideProps` 函数 到 `withPageAuthRequired`, 这样 props 会和 `user` prop 进行合并.
export const getServerSideProps = withPageAuthRequired();
```

参考 kitchen-sink 示例应用中的 [SSR 保护的页面](./examples/kitchen-sink-example/pages/profile-ssr.tsx)， 或参考 `withPageAuthRequired` 的完整配置清单[这里](https://authok.github.io/nextjs-authok/modules/helpers_with_page_auth_required.html#withpageauthrequiredoptions).

## 保护客户端渲染(CSR)页面

如果没有携带有效 session cookie 请求 `/pages/profile`， 将会被重定向到登录页面.

```jsx
// pages/profile.js
import { withPageAuthRequired } from '@authok/nextjs-authok/client';

export default withPageAuthRequired(function Profile({ user }) {
  return <div>Hello {user.name}</div>;
});
```

参考 kitchen-sink 示例应用中的 [CSR 保护的页面](./examples/kitchen-sink-example/pages/profile.tsx).

## 保护 API 路由

Requests to `/pages/api/protected` without a valid session cookie will fail with `401`.

```js
// pages/api/protected.js
import { withApiAuthRequired, getSession } from '@authok/nextjs-authok';

export default withApiAuthRequired(async function myApiRoute(req, res) {
  const { user } = await getSession(req, res);
  res.json({ protected: 'My Secret', id: user.sub });
});
```

Then you can access your API from the frontend with a valid session cookie.

```jsx
// pages/products
import useSWR from 'swr';
import { withPageAuthRequired } from '@authok/nextjs-authok/client';

const fetcher = async (uri) => {
  const response = await fetch(uri);
  return response.json();
};

export default withPageAuthRequired(function Products() {
  const { data, error } = useSWR('/api/protected', fetcher);
  if (error) return <div>oops... {error.message}</div>;
  if (data === undefined) return <div>Loading...</div>;
  return <div>{data.protected}</div>;
});
```

See a running example in the kitchen-sink example app, the [protected API route](./examples/kitchen-sink-example/pages/api/shows.ts) and
the [frontend code to access the protected API](./examples/kitchen-sink-example/pages/shows.tsx).

## 用中间件保护页面

使用 Next.js 中间件来保护页面.

保护所有路由:

```js
// middleware.js
import { withMiddlewareAuthRequired } from '@authok/nextjs-authok/edge';

export default withMiddlewareAuthRequired();
```

To protect specific routes:

```js
// middleware.js
import { withMiddlewareAuthRequired } from '@authok/nextjs-authok/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: '/about/:path*'
};
```

For more info see: https://nextjs.org/docs/advanced-features/middleware#matching-paths

To run custom middleware for authenticated users:

```js
// middleware.js
import { withMiddlewareAuthRequired, getSession } from '@authok/nextjs-authok/edge';

export default withMiddlewareAuthRequired(async function middleware(req) {
  const res = NextResponse.next();
  const user = await getSession(req, res);
  res.cookies.set('hl', user.language);
  return res;
});
```

For using middleware with your own instance of the SDK:

```js
// middleware.js
import {
  withMiddlewareAuthRequired,
  getSession,
  initAuthok // note the edge runtime specific `initAuthok`
} from '@authok/nextjs-authok/edge';

const authok = initAuthok({ ... });

export default authok.withMiddlewareAuthRequired(async function middleware(req) {
  const res = NextResponse.next();
  const user = await authok.getSession(req, res);
  res.cookies.set('hl', user.language);
  return res;
});
```

## 从API路由访问外部API

提供 API的 audience 和 scopes 来获取 访问令牌. 你可以把它们直接传递给 `handlelogin` 方法, 或使用环境变量替代.

```js
// pages/api/auth/[...authok].js
import { handleAuth, handleLogin } from '@authok/nextjs-authok';

export default handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: 'https://api.example.com/products', // or AUTHOK_AUDIENCE
      // Add the `offline_access` scope to also get a Refresh Token
      scope: 'openid profile email read:products' // or AUTHOK_SCOPE
    }
  })
});
```

使用 session 来保护 API route, 使用 access token 来保护外部 API. API route 作为前端和外部API之间的代理.

```js
// pages/api/products.js
import { getAccessToken, withApiAuthRequired } from '@authok/nextjs-authok';

export default withApiAuthRequired(async function products(req, res) {
  // If your access token is expired and you have a refresh token
  // `getAccessToken` will fetch you a new one using the `refresh_token` grant
  const { accessToken } = await getAccessToken(req, res, {
    scopes: ['read:products']
  });
  const response = await fetch('https://api.example.com/products', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const products = await response.json();
  res.status(200).json(products);
});
```

在 kitchen-sink 示例应用中参考 [API route 扮演 外部API 的代理](./examples/kitchen-sink-example/pages/api/shows.ts).

### 获取刷新令牌(Refresh Token)

- 在你的配置中(`AUTHOK_SCOPE`)包含 `offline_access` scope
- 在 [API 设置] 中勾选 "允许离线访问"(https://authok.cn/docs/get-started/apis/api-settings#access-settings)
- 确保 [应用设置](https://authok.cn/docs/get-started/applications/application-settings#grant-types)中 "刷新令牌" 授权已开启(这是默认设置)

## 创建自己的SDK实例

When you use the named exports, the SDK creates an instance of the SDK for you and configures it with the provided environment variables.

```js
// These named exports create and manage their own instance of the SDK configured with
// the provided `AUTHOK_*` environment variables
import {
  handleAuth,
  handleLogin,
  handleCallback,
  handleLogout,
  handleProfile,
  withApiAuthRequired,
  withPageAuthRequired,
  getSession,
  getAccessToken
} from '@authok/nextjs-authok';
```

然而，您可能处于各种目的需要自行创建和管理SDK实例:
- 您可能需要创建自己的实例进行测试
- 您可能不想使用环境变量配置 secret（例如使用 CredStash 或 AWS的密钥管理服务）

在这种情况下，可以使用[initAuthok](https://authok.github.io/nextjs-authok/modules/instance.html) 方法来创建实例.

```js
// utils/authok.js
import { initAuthok } from '@authok/nextjs-authok';

export default initAuthok({
  secret: 'LONG_RANDOM_VALUE',
  issuerBaseURL: 'https://your-tenant.authok.cn',
  baseURL: 'http://localhost:3000',
  clientID: 'CLIENT_ID',
  clientSecret: 'CLIENT_SECRET'
});
```

Now rather than using the named exports, you can use the instance methods directly.

```js
// pages/api/auth/[...authok].js
import authok from '../../../utils/authok';

// Use the instance method
export default authok.handleAuth();
```

> Note: You should not use the instance methods in combination with the named exports,
> otherwise you will be creating multiple instances of the SDK. For example:

```js
// DON'T Mix instance methods and named exports
import authok from '../../../utils/authok';
import { handleLogin } from '@authok/nextjs-authok';

export default authok.handleAuth({
  // <= instance method
  async login(req, res) {
    try {
      // `authok.handleAuth` and `handleLogin` will be using separate instances
      // You should use `authok.handleLogin` instead
      await handleLogin(req, res); // <= named export
    } catch (error) {
      res.status(error.status || 400).end(error.message);
    }
  }
});
```

# 添加注册处理程序

在自定义路由中将自定义授权参数传递给登录处理程序.

如果你使用 [新的统一登录体验](https://authok.cn/docs/universal-login/new-experience) 你可以传递 `screen_hint` 参数.

```js
// pages/api/auth/[...authok].js
import { handleAuth, handleLogin } from '@authok/nextjs-authok';

export default handleAuth({
  signup: handleLogin({ authorizationParams: { screen_hint: 'signup' } })
});
```

Users can then sign up using the signup handler.

```html
<a href="/api/auth/signup">Sign up</a>
```

## Use with Base Path and Internationalized Routing
## 把基本路径和国际化路由一起使用

你可以把 Next.js应用部署在一个域名子路径, 对应[Base Path](https://nextjs.org/docs/api-reference/next.config.js/basepath), 并采用[Internationalized Routing](https://nextjs.org/docs/advanced-features/i18n-routing)提供国际化(i18n)路由.

如果要使用这些特性，应用的url会发生一些变化，对应 nextjs-authok的陆游也会相应变化. 为了相适应，可以自定义 SDK中的相关 url.

例如 `basePath: '/foo'`, 你需要对应调整 `AuthokProvider` 的 `loginUrl` 和 `profileUrl`:

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

同样, 登录 和 注销 的url也必须包含 `basePath`:

```html
<a href="/foo/api/auth/login">登录</a><br />
<a href="/foo/api/auth/logout">注销</a>
```

你还可以配置 [baseUrl](https://authok.github.io/nextjs-authok/interfaces/config.baseconfig.html#baseurl) (或者 `AUTHOK_BASE_URL` 环境变量):

```shell
# .env.local
AUTHOK_BASE_URL=http://localhost:3000/foo
```

[withPageAuthRequired]保护的任何页面，如果需要，应根据“basePath”和“locale”更新“returnTo”参数
对于受服务器端[withPageAuthRequired](https://authok.github.io/nextjs-authok/modules/helpers_with_page_auth_required.html#withpageauthrequired) 保护的任何页面，应根据 `basePath` 和 `locale` 来更新`returnTo` 参数.

```js
// ./pages/my-ssr-page.jsx
export default MySsrPage = () => <></>;

const getFullReturnTo = (ctx) => {
  // TODO: 基于 ctx.resolvedUrl, ctx.locale, 以及 next.config.js 中的 basePath 和 i18n 设置 来实现 getFullReturnTo.
  return '/foo/en-US/my-ssr-page';
};

export const getServerSideProps = (ctx) => {
  const returnTo = getFullReturnTo(ctx.req);
  return withPageAuthRequired({ returnTo })(ctx);
};
```
