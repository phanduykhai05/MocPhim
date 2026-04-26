// next.config.js hoặc next.config.mjs
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    transpilePackages: ["antd", "@ant-design/icons", "@ant-design/pro-components", "rc-util", "rc-pagination", "rc-picker"],
    images: {
        formats: ["image/avif", "image/webp"],
        qualities: [65, 70, 72, 75],
        minimumCacheTTL: 60 * 60 * 24 * 30,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: "**",
                port: "",
                pathname: "/**",
            },
        ],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
