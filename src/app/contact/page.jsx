import ContactPage from "./contactPage"

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with the Blynter team. Send us your feedback, story suggestions, or advertising inquiries.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || "https://blynter.com"}/contact`,
  },
  openGraph: {
    title: "Contact Us | Blynter",
    description: "Get in touch with the Blynter team. Send us your feedback, story suggestions, or advertising inquiries.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://blynter.com"}/contact`,
    type: "website",
  },
};

const page = () => {
  return (
    <ContactPage />
  )
}

export default page