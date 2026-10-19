import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Compatibility for links created during the temporary combined deployment.
      { source: "/admin", destination: "/", permanent: true },
      { source: "/admin/:path*", destination: "/:path*", permanent: true },
      ...["logiciels", "tarifs", "nouveautes"].map(section => ({
        source: `/${section}/:path*`, destination: `https://malisystem.com/${section}/:path*`, permanent: true
      })),
      ...["a-propos", "contact", "devis", "difference"].map(page => ({
        source: `/${page}`, destination: `https://malisystem.com/${page}`, permanent: true
      }))
    ];
  }
};
export default nextConfig;
