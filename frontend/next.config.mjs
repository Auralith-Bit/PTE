/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Lets a verification build write somewhere other than `.next`, so
  // `npm run build` cannot clobber a dev server that is already running.
  distDir: process.env.NEXT_BUILD_DIST_DIR || '.next',
};

export default nextConfig;