const PWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export',

  transpilePackages: ['spelling-ukraine-data'],

  images: {
    remotePatterns: [
      {
        unoptimized: true,
        hostname: 'upload.wikimedia.org'
      }
    ]
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
