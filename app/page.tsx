import type { Metadata } from "next";
import DirectoryClient from "@/components/directory/DirectoryClient";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <DirectoryClient />;
}
