"use client";

import dynamic from "next/dynamic";

const TechStackSection = dynamic(
  () => import("./TechStackSection"),
  { ssr: false, loading: () => <div className="w-full h-[360px] md:h-[440px]" /> }
);

export default function TechStackSectionLazy() {
  return <TechStackSection />;
}
