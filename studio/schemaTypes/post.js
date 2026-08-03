import { defineType, defineField } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug", type: "slug", options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category", type: "string",
      options: { list: ["Germany", "Study Abroad", "Careers", "Ausbildung", "Australia", "Scholarships", "Visa Tips"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "excerpt", type: "text", rows: 3 }),
    defineField({ name: "coverImage", type: "image", options: { hotspot: true } }),
    defineField({ name: "publishedAt", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }, { type: "image", options: { hotspot: true } }] }),
  ],
  orderings: [{ title: "Newest", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "category", media: "coverImage" } },
});