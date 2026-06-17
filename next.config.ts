import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  allowedDevOrigins: ["192.168.1.3"],
  turbopack: {
    root: "/Users/newbee/mPrograms/项目管理工具/admin-panel",
  },
};

export default nextConfig;
