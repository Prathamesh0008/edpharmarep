import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/app/models/Product";
import { getProductImagePath, getProductImagePaths } from "@/lib/productImage";

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") || "en";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 200;
    const brand = searchParams.get("brand");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const includeDetails = searchParams.get("details") === "true";
    
    // Build query
    let query = {};
    if (brand) query.brand = brand;
    if (category) query.category = category;
    
    const projection = {
      id: 1,
      slug: 1,
      category: 1,
      brand: 1,
      dosage: 1,
      price: 1,
      composition: 1,
      form: 1,
      pack_size: 1,
      image: 1,
      additionalImages: 1,
      review: 1,
      [`translations.${lang}`]: 1,
      "translations.en": 1,
    };

    const products = await Product.find(query, projection)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
    
    const total = await Product.countDocuments(query);
    
    // Format products for requested language
    const formattedProducts = products.map(product => {
      // ✅ Safe check for translations
      const translations = product.translations || {};
      const localized = translations[lang] || translations.en || {};
      
      // Search filter (client-side for text search)
      if (search) {
        const searchLower = search.toLowerCase();
        const nameMatch = (localized.name || "").toLowerCase().includes(searchLower);
        const compositionMatch = (product.composition || "").toLowerCase().includes(searchLower);
        const categoryMatch = (product.category || "").toLowerCase().includes(searchLower);
        
        if (!nameMatch && !compositionMatch && !categoryMatch) {
          return null;
        }
      }
      
      const baseProduct = {
        id: product.id || "",
        slug: product.slug || "",
        name: localized.name || translations.en?.name || product.name || "",
        category: product.category || "",
        brand: product.brand || "",
        dosage: product.dosage || "",
        price: product.price || "",
        composition: product.composition || "",
        form: product.form || "",
        pack_size: product.pack_size || "",
        image: getProductImagePath(product.image || "/placeholder.jpg"),
        additionalImages: getProductImagePaths(product.additionalImages || []),
        description: localized.description || translations.en?.description || "",
        metaTitle: localized.metaTitle || translations.en?.metaTitle || "",
        metaDescription: localized.metaDescription || translations.en?.metaDescription || "",
        review: product.review || {},
      };

      if (includeDetails) {
        return {
          ...baseProduct,
          overview: localized.overview || translations.en?.overview || [],
          sideEffects: localized.sideEffects || translations.en?.sideEffects || [],
          administration: localized.administration || translations.en?.administration || [],
          warnings: localized.warnings || translations.en?.warnings || [],
          how_it_works: localized.how_it_works || translations.en?.how_it_works || [],
          tips: localized.tips || translations.en?.tips || [],
        };
      }

      return baseProduct;
    }).filter(Boolean);
    
    return NextResponse.json({
      success: true,
      data: formattedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
