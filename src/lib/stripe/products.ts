export const PRODUCTS = {
  basic: {
    priceId: process.env.STRIPE_BASIC_PRICE_ID ?? "",
    name: "Basic",
    features: ["Core features", "Basic support"],
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? "",
    name: "Pro",
    features: [
      "All features",
      "Priority support",
      "Advanced analytics",
    ],
  },
} as const;

export type ProductTier = keyof typeof PRODUCTS;
