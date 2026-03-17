import { redirect } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  // Provide the base /admin path for static export.
  return [{ index: [] as string[] }];
}

export default function AdminPage() {
  // GitHub Pages uses static export; Sanity Studio requires a server.
  redirect("/");
}