import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      // The payments story shipped unlisted at /anatomy before it was
      // named; links already shared keep working.
      {
        source: "/anatomy",
        destination: "/follow-the-money",
        permanent: true,
      },
    ];
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-images-1.medium.com",
      },
      {
        protocol: "https",
        hostname: "miro.medium.com",
      },
    ],
  },
};

const withMDX = createMDX({
  options: {
    // Plugin as a string: Turbopack can't take JS functions in loader options.
    remarkPlugins: ["remark-frontmatter"],
  },
});

export default withMDX(nextConfig);
