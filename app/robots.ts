import type { MetadataRoute } from "next";
import { INDEXABLE, SITE_URL } from "./seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", ...(INDEXABLE ? { allow: "/" } : { disallow: "/" }) },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
