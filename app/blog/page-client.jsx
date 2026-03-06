// app/blog/page.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Calendar, 
  MessageCircle, 
  ChevronRight,
  BookOpen,
  X,
  ImageIcon
} from "lucide-react";

const BlogPage = () => {
  // Blog posts data with images
  const allBlogPosts = [
    {
      id: 1,
      title: "Kamagra vs Sildenafil: Safety, Legality & Differences",
      date: "March 3, 2026",
      comments: 3,
      excerpt:
        "Compare Kamagra and pharmacy sildenafil tablets. Discover safety differences, side effects, and why regulated ED treatment matters in the Netherlands.",
      slug: "kamagra-vs-sildenafil-safety",
      image: "/1.1.jpg",
      imageAlt: "Kamagra and Sildenafil tablets comparison"
    },
    {
      id: 2,
      title: "Is It Safe to Take Kamagra Every Day? Sildenafil Explained",
      date: "March 2, 2026",
      comments: 7,
      excerpt:
        "Learn whether daily Kamagra use is safe, how sildenafil works, correct dosage, side effects, and when to consult a doctor in the Netherlands.",
      slug: "daily-kamagra-safety",
      image: "/2.1.jpg",
      imageAlt: "Daily medication schedule with Kamagra tablets"
    },
    {
      id: 3,
      title: "Kamagra vs Sildenafil: Duration, Strength & Safety",
      date: "February 28, 2026",
      comments: 31,
      excerpt:
        "How long does Kamagra last? Learn about sildenafil onset (30–60 minutes), 4–6 hour duration, side effects, sperm health, and safety guidance.",
      slug: "kamagra-duration-strength",
      image: "/3.1.jpg",
      imageAlt: "Timeline showing Kamagra duration and effectiveness"
    },
    {
      id: 4,
      title: "Is It Safe to Take Kamagra With Alcohol?",
      date: "February 27, 2026",
      comments: 14,
      excerpt:
        "Is it safe to drink alcohol while taking sildenafil or Kamagra? Understand interaction risks, dizziness, low blood pressure, and ED treatment safety.",
      slug: "kamagra-with-alcohol",
      image: "/4.1.jpg",
      imageAlt: "Kamagra tablets and alcoholic drinks - safety concept"
    },
  ];

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(allBlogPosts);
  const [imageErrors, setImageErrors] = useState({});

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  const performSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(allBlogPosts);
    } else {
      const filtered = allBlogPosts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  };

  // Handle input change with debounce
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Real-time search with debounce
    const timeoutId = setTimeout(() => {
      if (value.trim() === "") {
        setFilteredPosts(allBlogPosts);
      } else {
        const filtered = allBlogPosts.filter(post => 
          post.title.toLowerCase().includes(value.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredPosts(filtered);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setFilteredPosts(allBlogPosts);
  };

  // Handle image error
  const handleImageError = (postId) => {
    setImageErrors(prev => ({ ...prev, [postId]: true }));
  };

  // Placeholder component for missing images
  const ImagePlaceholder = () => (
    <div className="w-full h-full bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center">
      <ImageIcon className="w-16 h-16 text-sky-400/50" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-25 relative overflow-hidden">
      {/* Background Elements - Matching About page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-sky-100 to-cyan-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-gradient-to-t from-transparent via-blue-50/20 to-transparent"></div>
      </div>

      {/* Floating Elements - Matching About page */}
      <div className="absolute top-20 left-10 animate-float-slow pointer-events-none">
        <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full opacity-20 blur-sm"></div>
      </div>
      <div className="absolute top-40 right-20 animate-float pointer-events-none">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-15 blur-sm"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Header Section with Gradient - Matching About page style */}
        <div className="mb-12 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full mb-4">
            <BookOpen className="w-3 h-3 text-white" />
            <span className="text-xs font-semibold text-white tracking-widest">OUR BLOG</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-sky-800 via-sky-600 to-cyan-500 bg-clip-text text-transparent">
              Latest Insights
            </span>
            <span className="block text-slate-800 text-2xl lg:text-3xl mt-2">
              From Our Health Experts
            </span>
          </h1>
        </div>

        {/* Search Bar - Working */}
        <div className="flex justify-center mb-12">
          <div className="group relative w-full max-w-2xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <form onSubmit={handleSearch} className="relative flex">
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search articles by title or content..."
                className="flex-1 px-6 py-4 bg-white border border-sky-100 rounded-l-full focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 text-sm shadow-lg"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-16 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="bg-gradient-to-r from-sky-600 to-cyan-500 text-white px-6 rounded-r-full hover:from-sky-700 hover:to-cyan-600 transition-all duration-300 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Search Results Count */}
        <div className="mb-6 text-sm text-slate-600">
          Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
          {searchQuery && ` for "${searchQuery}"`}
        </div>

        {/* Blog Posts Grid - With LARGER images */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group relative"
              >
                {/* Background Glow Effect - Matching About page cards */}
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                
                {/* Card Content - Adjusted padding for larger images */}
                <div className="relative bg-gradient-to-b from-white to-blue-50 rounded-2xl p-6 border border-sky-100 hover:border-sky-200 transition-all duration-500 group-hover:-translate-y-2 h-full flex flex-col">
                  
                  {/* Image Section - SIGNIFICANTLY INCREASED SIZE for infographics */}
                  <div className="relative w-full h-80 mb-5 overflow-hidden rounded-xl bg-sky-50 shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-10"></div>
                    
                    {post.image && !imageErrors[post.id] ? (
                      <Image
                        src={post.image}
                        alt={post.imageAlt || "Blog article image"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-700"
                        onError={() => handleImageError(post.id)}
                        priority={post.id <= 2}
                      />
                    ) : (
                      <ImagePlaceholder />
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-sky-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4 pb-4 border-b border-dashed border-sky-100">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments} comments
                    </span>
                  </div>

                  {/* Excerpt */}
                  <p className="text-base text-slate-600 mb-4 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Read More Link */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sky-600 text-base font-medium hover:text-cyan-600 transition-colors group/link"
                  >
                    Read full article
                    <ChevronRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>

                  {/* Bottom Accent */}
                  <div className="mt-5 pt-4 border-t border-sky-100 group-hover:border-sky-200 transition-colors">
                    <div className="w-14 h-1.5 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full"></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          // No results state
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-sky-100 to-cyan-100 rounded-full mb-6">
              <Search className="w-8 h-8 text-sky-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No articles found</h3>
            <p className="text-slate-600 mb-6">
              We couldn't find any articles matching "{searchQuery}"
            </p>
            <button
              onClick={clearSearch}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-cyan-500 text-white rounded-full hover:from-sky-700 hover:to-cyan-600 transition-all duration-300"
            >
              Clear search
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;