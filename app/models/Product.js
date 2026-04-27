// app\models\Product.js
import mongoose from "mongoose";

// Translation schema for each language
const translationFields = {
  name: { type: String, default: "" },
  description: { type: String, default: "" },
  metaTitle: { type: String, default: "" },
  metaDescription: { type: String, default: "" },
  overview: { type: [String], default: [] },
  sideEffects: { type: [String], default: [] },
  administration: { type: [String], default: [] },
  warnings: { type: [String], default: [] },
  how_it_works: { type: [String], default: [] },
  tips: { type: [String], default: [] },
  reviewBody: { type: String, default: "" },
};

const translationSchema = new mongoose.Schema(translationFields, { _id: false });

const productSchema = new mongoose.Schema(
  {
    // Common fields (same across all languages)
    id: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, default: "" },
    brand: { type: String, default: "" },
    dosage: { type: String, default: "" },
    price: { type: String, default: "" },
    composition: { type: String, default: "" },
    form: { type: String, default: "" },
    pack_size: { type: String, default: "" },
    casId: { type: String, default: "" },
    image: { type: String, default: "" },
    additionalImages: { type: [String], default: [] },
    
    // Review
    review: {
      ratingValue: { type: String, default: "5" },
      ratingCount: { type: String, default: "1" },
      reviewCount: { type: String, default: "1" },
      author: { type: String, default: "" },
      reviewBody: { type: String, default: "" },
      datePublished: { type: String, default: "" },
    },
    
    // Multi-language translations (17 languages)
    translations: {
      en: translationSchema,
      ar: translationSchema,
      bg: translationSchema,
      bs: translationSchema,
      de: translationSchema,
      el: translationSchema,
      es: translationSchema,
      fr: translationSchema,
      hr: translationSchema,
      ja: translationSchema,
      mk: translationSchema,
      nl: translationSchema,
      pt: translationSchema,
      ro: translationSchema,
      sq: translationSchema,
      sr: translationSchema,
      zh: translationSchema,
    },
  },
  { timestamps: true }
);

// Helper method to get product in specific language
productSchema.methods.getLocalized = function(lang = "en") {
  const translation = this.translations[lang] || this.translations.en || {};
  return {
    id: this.id,
    slug: this.slug,
    category: this.category,
    brand: this.brand,
    dosage: this.dosage,
    price: this.price,
    composition: this.composition,
    form: this.form,
    pack_size: this.pack_size,
    casId: this.casId,
    image: this.image,
    additionalImages: this.additionalImages,
    review: this.review,
    name: translation.name || this.translations.en?.name || "",
    description: translation.description || this.translations.en?.description || "",
    metaTitle: translation.metaTitle || this.translations.en?.metaTitle || "",
    metaDescription: translation.metaDescription || this.translations.en?.metaDescription || "",
    overview: translation.overview || this.translations.en?.overview || [],
    sideEffects: translation.sideEffects || this.translations.en?.sideEffects || [],
    administration: translation.administration || this.translations.en?.administration || [],
    warnings: translation.warnings || this.translations.en?.warnings || [],
    how_it_works: translation.how_it_works || this.translations.en?.how_it_works || [],
    tips: translation.tips || this.translations.en?.tips || [],
  };
};

export default mongoose.models.Product || mongoose.model("Product", productSchema);