// app/blog/[slug]/page.jsx
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Blog posts data
const blogPosts = [
  {
    slug: "yellow-discharge-when-to-worry",
    title: "Yellow Discharge: When to Worry and When It's Normal",
    date: "March 3, 2026",
    author: "Dr. Zackefron",
    comments: 3,
    category: "Health Tips",
    content: `
      <h2 class="text-2xl font-bold mt-8 mb-4">Understanding Vaginal Discharge</h2>
      <p class="mb-4">Vaginal discharge is a natural phenomenon of the female reproductive system, and it's completely normal. The thick liquid ejected by the vagina is different in colour and texture according to the menstrual cycle.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Normal Yellow Discharge</h2>
      <p class="mb-4">Yellow discharge can be normal if it's pale yellow, odorless, and not accompanied by itching or burning. This often occurs around ovulation or before your period.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">When to Worry About Yellow Discharge</h2>
      <p class="mb-4">You should consult a healthcare provider if you experience:</p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Dark yellow or greenish discharge</li>
        <li>Strong, foul odor</li>
        <li>Thick, cottage cheese-like consistency</li>
        <li>Itching, burning, or irritation</li>
        <li>Pain during urination or intercourse</li>
      </ul>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Possible Causes</h2>
      <p class="mb-4">Abnormal yellow discharge may indicate infections like bacterial vaginosis, trichomoniasis, or sexually transmitted infections. Always seek medical advice for proper diagnosis.</p>
    `
  },
  {
    slug: "fenbendazole-vs-mebendazole",
    title: "Difference between Fenbendazole Vs Mebendazole",
    date: "March 2, 2026",
    author: "Dr. Zackefron",
    comments: 7,
    category: "Medication",
    content: `
      <h2 class="text-2xl font-bold mt-8 mb-4">Introduction</h2>
      <p class="mb-4">When discussing reliable treatments for parasitic worm infection, two medications are often mentioned – Fenbendazole and Mebendazole. They belong to the benzimidazole class of drugs.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Key Differences</h2>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Fenbendazole:</strong> Primarily used in veterinary medicine</li>
        <li><strong>Mebendazole:</strong> Commonly prescribed for humans</li>
      </ul>
    `
  },
  {
    slug: "fenbendazole-dosage-for-cats",
    title: "Fenbendazole Dosage for Cats Per Pound",
    date: "February 28, 2026",
    author: "Dr. Zackefron",
    comments: 31,
    category: "Medication",
    content: "<p class='mb-4'>Content for Fenbendazole dosage for cats...</p>"
  },
  {
    slug: "pink-eye-from-fart",
    title: "Can You Get Pink Eye From A Fart?",
    date: "February 27, 2026",
    author: "Dr. Zackefron",
    comments: 14,
    category: null,
    content: "<p class='mb-4'>Content about pink eye...</p>"
  },
  {
    slug: "kamagra-vs-sildenafil",
    title: "Use of Kamagra vs Sildenafil Tablets: What's the Difference?",
    date: "February 26, 2026",
    author: "Dr. Zackefron",
    comments: 5,
    category: "Medication",
    content: "<p class='mb-4'>Content about Kamagra vs Sildenafil...</p>"
  },
  {
    slug: "kamagra-with-alcohol",
    title: "Is It Safe to Take Kamagra with Alcohol?",
    date: "February 25, 2026",
    author: "Dr. Zackefron",
    comments: 12,
    category: "Health Tips",
    content: "<p class='mb-4'>Content about Kamagra and alcohol...</p>"
  },
  {
    slug: "kamagra-how-long",
    title: "How Long Does Kamagra Take to Work?",
    date: "February 24, 2026",
    author: "Dr. Zackefron",
    comments: 8,
    category: "Medication",
    content: "<p class='mb-4'>Content about Kamagra onset time...</p>"
  },
  {
    slug: "kamagra-daily-use",
    title: "Is Daily Use of Kamagra Safe?",
    date: "February 23, 2026",
    author: "Dr. Zackefron",
    comments: 21,
    category: "Health Tips",
    content: "<p class='mb-4'>Content about daily Kamagra use...</p>"
  }
];

// This is the key change - make the component async and await params
export default async function BlogPost({ params }) {
  // Await the params Promise
  const { slug } = await params;
  
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      {/* Back button */}
      <Link 
        href="/blog" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 group"
      >
        <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Blog
      </Link>

      {/* Article - Matching arrowmeds.com style but without offers */}
      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center text-gray-600 gap-4">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {post.author}
            </span>
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {post.date}
            </span>
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {post.comments} Comments
            </span>
            {post.category && (
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                {post.category}
              </span>
            )}
          </div>
        </div>

        {/* Featured Image */}
        <div className="w-full h-96 bg-gray-200 relative">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <span>Featured Image</span>
          </div>
        </div>

        {/* Content Area - No offers section */}
        <div className="px-8 py-12">
          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Bio */}
          <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                {post.author.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">About {post.author}</h3>
                <p className="text-gray-600">
                  {post.author} is a healthcare professional dedicated to providing accurate, 
                  evidence-based medical information to help you make informed decisions about your health.
                </p>
              </div>
            </div>
          </div>

          {/* Share Section - No offers */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Share this article:</h3>
            <div className="flex gap-3">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
                Facebook
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
                Twitter
              </button>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.346.223-.643.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}