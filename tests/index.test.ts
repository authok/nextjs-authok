import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import { withoutApi } from './fixtures/default-settings';
import { WithApiAuthRequired, WithPageAuthRequired, InitAuthok, GetSession, ConfigParameters } from '../src';

describe('index', () => {
  let withPageAuthRequired: WithPageAuthRequired,
    withApiAuthRequired: WithApiAuthRequired,
    initAuthok: InitAuthok,
    getSession: GetSession;
  let env: NodeJS.ProcessEnv;

  const updateEnv = (opts: ConfigParameters) => {
    process.env = {
      ...env,
      AUTHOK_ISSUER_BASE_URL: opts.issuerBaseURL,
      AUTHOK_CLIENT_ID: opts.clientID,
      AUTHOK_CLIENT_SECRET: opts.clientSecret,
      AUTHOK_BASE_URL: opts.baseURL,
      AUTHOK_SECRET: opts.secret as string
    };
  };

  beforeEach(async () => {
    env = process.env;
    ({ withPageAuthRequired, withApiAuthRequired, initAuthok, getSession } = await import('../src'));
  });

  afterEach(() => {
    process.env = env;
    jest.resetModules();
  });

  test('withPageAuthRequired should not create an SDK instance at build time', () => {
    process.env = { ...env, AUTHOK_SECRET: undefined };
    expect(() => withApiAuthRequired(jest.fn())).toThrow('"secret" is required');
    expect(() => withPageAuthRequired()).not.toThrow();
  });

  test('should error when mixing named exports and own instance', async () => {
    const instance = initAuthok(withoutApi);
    const req = new IncomingMessage(new Socket());
    const res = new ServerResponse(req);
    await expect(instance.getSession(req, res)).resolves.toBeNull();
    expect(() => getSession(req, res)).toThrow(
      "You cannot mix creating your own instance with `initAuthok` and using named exports like `import { handleAuth } from '@authok/nextjs-authok'`"
    );
  });

  test('should error when mixing own instance and named exports', async () => {
    updateEnv(withoutApi);
    const req = new IncomingMessage(new Socket());
    const res = new ServerResponse(req);
    await expect(getSession(req, res)).resolves.toBeNull();
    expect(() => initAuthok()).toThrow(
      "You cannot mix creating your own instance with `initAuthok` and using named exports like `import { handleAuth } from '@authok/nextjs-authok'`"
    );
  });

  test('should share instance when using named exports', async () => {
    updateEnv(withoutApi);
    const req = new IncomingMessage(new Socket());
    const res = new ServerResponse(req);
    await expect(getSession(req, res)).resolves.toBeNull();
    await expect(getSession(req, res)).resolves.toBeNull();
  });
});
