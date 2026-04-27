import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/app/models/Product";
import { optimizeCloudinaryImage, optimizeCloudinaryImages } from "@/lib/cloudinaryImage";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") || "en";
    const { slug } = await params;
    
    const product = await Product.findOne({ slug }).lean();
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    
    // ✅ Safe check for translations
    const translations = product.translations || {};
    const localized = translations[lang] || translations.en || {};
    
    const formattedProduct = {
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
      casId: product.casId || "",
      image: optimizeCloudinaryImage(product.image || "/placeholder.jpg", 1000),
      additionalImages: optimizeCloudinaryImages(product.additionalImages || [], 1000),
      description: localized.description || translations.en?.description || "",
      metaTitle: localized.metaTitle || translations.en?.metaTitle || "",
      metaDescription: localized.metaDescription || translations.en?.metaDescription || "",
      overview: localized.overview || translations.en?.overview || [],
      sideEffects: localized.sideEffects || translations.en?.sideEffects || [],
      administration: localized.administration || translations.en?.administration || [],
      warnings: localized.warnings || translations.en?.warnings || [],
      how_it_works: localized.how_it_works || translations.en?.how_it_works || [],
      tips: localized.tips || translations.en?.tips || [],
      review: product.review || {},
      currentLanguage: lang,
      availableLanguages: Object.keys(translations).filter(
        l => translations[l] && Object.keys(translations[l]).length > 0
      ),
    };
    
    return NextResponse.json(
      { success: true, data: formattedProduct },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
