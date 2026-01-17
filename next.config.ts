import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Przenosimy wskaźniki deweloperskie (w tym ikonę N) na prawy dolny róg
  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;