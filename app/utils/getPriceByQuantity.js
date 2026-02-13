import pricing from "@/app/data/pricing";

export function getPriceByQuantity(slug, quantity) {
  const tiers = pricing[slug];

  if (!tiers) return 0;

  const tier = tiers.find(
    (tier) => quantity >= tier.min && quantity <= tier.max
  );

  return tier ? tier.price : 0;
}
