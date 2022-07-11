const { spawnSync } = require('child_process');
const withPlugins = require('next-compose-plugins');
const withPWA = require('next-pwa');
const withTM = require('next-transpile-modules');
const runtimeCaching = require('next-pwa/cache');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ['upload.wikimedia.org']
  },

  env: {
    BUILD_ID: [
      spawnSync('git', ['rev-parse', '--short', 'HEAD']).stdout.toString().trim(),
      spawnSync('git', ['tag', '--points-at', 'HEAD']).stdout.toString().trim()
    ]
      .filter(Boolean)
      .join('-'),

    SITE_URL:
      process.env.SITE_URL ||
      (process.env.VERCEL_URL && 'https://' + process.env.VERCEL_URL) ||
      'http://localhost:3000',

    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID
  }
};

module.exports = withPlugins(
  [
    withTM(['spelling-ukraine-data']),

    withPWA,
    {
      pwa: {
        dest: 'public',
        disable: process.env.NODE_ENV === 'development',
        runtimeCaching
      }
    }
  ],

  nextConfig
);
