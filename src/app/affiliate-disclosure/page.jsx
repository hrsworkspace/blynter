import { getLegalPageData } from "@/services/legalPagesService";
import LegalPageLayout from "@/components/LegalPageLayout";

export async function generateMetadata() {
  const legal = await getLegalPageData({ slug: "affiliate-disclosure" });
  return {
    title: legal?.pageName ? `${legal.pageName} | Blynter` : "Affiliate Disclosure",
    description:
      "Read the affiliate disclosure and advertising policies of Blynter.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/affiliate-disclosure`,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      site_name: "blynter",
    },
    publisher: "blynter"
  };
}

export default async function AffiliateDisclosurePage() {
  const data = await getLegalPageData({ slug: "affiliate-disclosure" });
  return (
    <LegalPageLayout
      data={data}
      defaultTitle="Affiliate Disclosure"
      defaultSubtitle="Transparency statement regarding affiliate links and partner relationships."
    />
  );
}
