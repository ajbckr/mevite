import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/m/", "/share/", "/api/"],
      },
    ],
    sitemap: "https://mevite.me/sitemap.xml",
  };
}
