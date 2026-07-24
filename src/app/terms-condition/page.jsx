
import { getLegalPageData } from "@/services/legalPagesService";
import LegalPageLayout from "@/components/LegalPageLayout";

export async function generateMetadata() {
  const legal = await getLegalPageData({ slug: "terms-condition" });
  return {
    title: legal?.pageName ? `${legal.pageName} | Blynter` : "Terms Condition",
    description:
      "Read the terms, conditions, and rules for using the Blynter website.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/terms-condition`,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      site_name: "blynter",
    },
    publisher: "blynter"
  };
}

export default async function TermsConditionPage() {
  const data = await getLegalPageData({ slug: "terms-condition" });
  return (
    <LegalPageLayout
      data={data}
      defaultTitle="Terms Condition"
      defaultSubtitle="Please read these terms and conditions carefully before using our service."
    />
  );
}
