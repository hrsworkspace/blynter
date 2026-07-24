import { getLegalPageData } from "@/services/legalPagesService";
import LegalPageLayout from "@/components/LegalPageLayout";

export async function generateMetadata() {
  const legal = await getLegalPageData({ slug: "about-us" });
  return {
    title: legal?.pageName ? `${legal.pageName} | Blynter` : "About Us",
    description:
      "Learn more about Blynter, our mission, editorial policy, and team.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/about-us`,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      site_name: "blynter",
    },
    publisher: "blynter"
  };
}

export default async function AboutUsPage() {
  const data = await getLegalPageData({ slug: "about-us" });
  return (
    <LegalPageLayout
      data={data}
      defaultTitle="About Us"
      defaultSubtitle="Learn about Blynter, our values, and our mission."
    />
  );
}
