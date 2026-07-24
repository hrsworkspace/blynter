import { getLegalPageData } from "@/services/legalPagesService";
import LegalPageLayout from "@/components/LegalPageLayout";

export async function generateMetadata() {
  const legal = await getLegalPageData({ slug: "disclaimer" });
  return {
    title: legal?.pageName ? `${legal.pageName} | Blynter` : "Disclaimer",
    description:
      "Read the disclaimer and limitations of liability for Blynter.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/disclaimer`,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      site_name: "blynter",
    },
    publisher: "blynter"
  };
}

export default async function DisclaimerPage() {
  const data = await getLegalPageData({ slug: "disclaimer" });
  return (
    <LegalPageLayout
      data={data}
      defaultTitle="Disclaimer"
      defaultSubtitle="Important information regarding the content and usage of our website."
    />
  );
}
