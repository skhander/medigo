export const PROCEDURE_CATEGORIES = {
  Cosmetic: [
    "Rhinoplasty",
    "Facelift",
    "Tummy Tuck",
    "Breast Augmentation",
    "Liposuction",
    "Hair Transplant",
  ],
  Dental: ["Dental Implants", "Veneers", "All-on-4", "Dental Crowns"],
  Orthopedic: [
    "Knee Replacement",
    "Hip Replacement",
    "Spine Surgery",
    "ACL Reconstruction",
  ],
  Fertility: ["IVF", "Egg Freezing"],
  Vision: ["LASIK Eye Surgery", "Cataract Surgery"],
  Bariatric: ["Gastric Sleeve", "Gastric Bypass"],
  Cardiac: ["Cardiac Bypass"],
} as const;

export const POPULAR_PROCEDURES = Object.values(PROCEDURE_CATEGORIES).flat();

export type ProcedureName = (typeof POPULAR_PROCEDURES)[number];

export const FEATURED_PROCEDURES = [
  "Rhinoplasty",
  "IVF",
  "Dental Implants",
  "Hair Transplant",
  "Knee Replacement",
  "Gastric Sleeve",
  "LASIK Eye Surgery",
] as const;

export const PROCEDURE_BASE_PRICES: Record<string, number> = {
  Rhinoplasty: 3200,
  Facelift: 4500,
  "Tummy Tuck": 4800,
  "Breast Augmentation": 4200,
  Liposuction: 3100,
  "Hair Transplant": 2400,
  "Dental Implants": 950,
  Veneers: 350,
  "All-on-4": 9000,
  "Dental Crowns": 450,
  "Knee Replacement": 11000,
  "Hip Replacement": 10500,
  "Spine Surgery": 8500,
  "ACL Reconstruction": 4200,
  IVF: 5500,
  "Egg Freezing": 3200,
  "LASIK Eye Surgery": 1800,
  "Cataract Surgery": 550,
  "Gastric Sleeve": 6800,
  "Gastric Bypass": 9200,
  "Cardiac Bypass": 7200,
};
