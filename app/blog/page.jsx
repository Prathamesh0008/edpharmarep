// app/blog/page.jsx (new server component)
import ClientBlogPage from "./page-client";

export const metadata = {
  title: "Blog - ED PHARMA",
  description: "Read our latest blog posts about health, medication, and wellness tips",
  alternates: {
    canonical: "/blog",
  },
};

export default function Page() {
  return <ClientBlogPage />;
}
