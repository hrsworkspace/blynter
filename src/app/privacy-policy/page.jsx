import { getLegalPageData } from "@/services/legalPagesService";
import LegalPageLayout from "@/components/LegalPageLayout";

export async function generateMetadata() {
  const legal = await getLegalPageData({ slug: "privacy-policy" });
  return {
    title: legal?.pageName ? `${legal.pageName} | Blynter` : "Privacy Policy",
    description:
      "Read how Blynter collects, uses, and protects your personal information.",
      keywords: legal?.metaKeywords || "",
      robots: {
        index: true,        // true = index, false = noindex
        follow: true,       // true = follow, false = nofollow
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: false,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
  
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy`,
  
      },
      openGraph: {
        type: "website",
        locale: "en_US",
        site_name: "blynter",
        // images: [blogDetails?.heroImage?.url || ""],
      },
      publisher: "blynter"
  };
}

export default async function PrivacyPolicyPage() {
  const data = await getLegalPageData({ slug: "privacy-policy" });
  return (
    <LegalPageLayout
      data={data}
      defaultTitle="Privacy Policy"
      defaultSubtitle="How we collect, use, and protect your information when you use our site."
    />
  );
}
