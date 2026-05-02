const PWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: "export",

  transpilePackages: ["spelling-ukraine-data"],

  basePath: process.env.SITE_URL ? new URL(process.env.SITE_URL).pathname.replace(/\/$/, "") : "",

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: "upload.wikimedia.org",
      },
    ],
  },

  // Expose environment variables to the client
  env: {
    BUILD_ID: process.env.BUILD_ID,
    SITE_URL: process.env.SITE_URL,
  },
};

const plugins = [
  PWA({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    runtimeCaching,
  }),
];

module.exports = () => {
  return plugins.reduce((config, plugin) => plugin(config), config);
};
