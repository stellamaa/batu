import type { NextConfig } from "next";

const repo = process.env.GITHUB_REPOSITORY?.split("/")?.[1];
// GitHub Pages serves from /<repo>/ unless using a custom domain.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages && repo ? `/${repo}` : undefined;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
