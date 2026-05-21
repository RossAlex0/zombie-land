import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src/utils/styles')],

  },
};

export default nextConfig;
