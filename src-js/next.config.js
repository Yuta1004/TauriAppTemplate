/** @type {import('next').NextConfig} */

const nextConfig = {
    output: "export",
    distDir: "dist",
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true,
    },
    transpilePackages: [],
};

module.exports = nextConfig;
