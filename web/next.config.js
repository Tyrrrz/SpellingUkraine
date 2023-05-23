const { spawnSync } = require('child_process');
const PWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  transpilePackages: ['spelling-ukraine-data'],

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
      'http://localhost:3000'
  }
};

const plugins = [
  PWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching
  })
];

module.exports = () => {
  return plugins.reduce((config, plugin) => plugin(config), config);
};
