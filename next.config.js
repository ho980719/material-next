import withPWA from 'next-pwa';
import runtimeCaching from 'next-pwa/cache.js';

const nextConfig = {
  // Windows 사용자 폴더(특히 Application Data)로의 트레이싱을 제외
  outputFileTracingExcludes: {
    "*": [
      "C:/Users/**",
      "C:/Users/*/Application Data/**",
      // 백슬래시 패턴도 보수적으로 포함
      "C:\\Users\\**",
      "C:\\Users\\*\\Application Data\\**",
    ],
  },
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching,
  buildExcludes: [/app-build-manifest\.json$/],
  ignoreURLParametersMatching: [/^_rsc$/], // _rsc parameter 무시
})(nextConfig);
