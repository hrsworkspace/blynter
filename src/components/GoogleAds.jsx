"use client";
import { useEffect } from "react";

export default function GoogleAds() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log("Adsense error:", err);
    }
  }, []);

  return (
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client="ca-pub-2234384779164146"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-adtest="on"
      ></ins>
  );
}
