/**
 * Public URLs and contact info for the footer.
 */
export const SITE_SOCIAL = {
  linkedin: "https://www.linkedin.com/in/colemancrozier",
  instagram: "https://www.instagram.com/colemancrozier_/",
  facebook: "https://www.facebook.com/coleman.crozier.5",
} as const satisfies Record<string, string>;

export const SITE_CONTACT = {
  phone: { tel: "+19547749170", display: "(954) 774-9170" },
  emails: [
    "crozier.coleman@gmail.com",
    "coleman@evergreensolutionsfl.com",
    "coleman@graybaysolutions.io",
    "coleman@parkviewadvance.com",
  ] as const,
} as const;
