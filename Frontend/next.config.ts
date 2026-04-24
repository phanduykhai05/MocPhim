// next.config.js hoặc next.config.mjs
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    transpilePackages: ["antd", "@ant-design/icons", "@ant-design/pro-components", "rc-util", "rc-pagination", "rc-picker"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
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
