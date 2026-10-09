import type { MetadataRoute } from "next";
import { INDEXABLE, SITE_URL } from "./seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE ? [{ url: SITE_URL }, { url: `${SITE_URL}/install` }] : [];
}
