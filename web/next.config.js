const { spawnSync } = require('child_process');
const webpack = require('webpack');
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

  generateBuildId: () => {
    const gitHash = spawnSync('git', ['rev-parse', '--short', 'HEAD']).stdout.toString().trim();
    const gitTag = spawnSync('git', ['tag', '--points-at', 'HEAD']).stdout.toString().trim();

    return [gitHash, gitTag].filter(Boolean).join('-');
  },

  webpack: (config, options) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_PUBLIC_BUILD_ID': JSON.stringify(options.buildId)
      })
    );

    return config;
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
