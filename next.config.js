const webpack = require('webpack');
const { spawnSync } = require('child_process');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  generateBuildId: () => {
    const gitHash = spawnSync('git', ['rev-parse', '--short', 'HEAD']).stdout.toString().trim();
    const gitTag = spawnSync('git', ['tag', '--points-at', 'HEAD']).stdout.toString().trim();

    return [gitHash, gitTag].filter(Boolean).join('-');
  },
  webpack: (config, options) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_BUILD_ID': JSON.stringify(options.buildId)
      })
    );

    return config;
  }
};

module.exports = nextConfig;
