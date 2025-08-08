import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Windows 사용자 폴더(특히 Application Data)로의 트레이싱을 제외
    // @ts-expect-error: not yet in Next types
    outputFileTracingExcludes: {
      "*": [
        "C:/Users/**",
        "C:/Users/*/Application Data/**",
        // 백슬래시 패턴도 보수적으로 포함
        "C:\\Users\\**",
        "C:\\Users\\*\\Application Data\\**",
      ],
    },
  },
};

export default nextConfig;
