module.exports = {
  name: '@authok/nextjs-authok',
  out: './docs/',
  exclude: [
    './src/authok-session/**',
    './src/session/cache.ts',
    './src/client/use-config.tsx',
    './src/utils/!(errors.ts)'
  ],
  excludeExternals: true,
  excludePrivate: true,
  hideGenerator: true,
  readme: 'none'
};
