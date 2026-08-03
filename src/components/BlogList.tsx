// src/components/BlogList.tsx
import { useState } from "preact/hooks";

export default function BlogList({ posts, categories }: { posts: any[]; categories: string[] }) {
  const [active, setActive] = useState("All");
  const shown = active === "All" ? posts : posts.filter((p) => p.category === active);
  const tabs = ["All", ...categories];

  return (
    <div class="w-full">
      {/* filter tabs */}
      <div class="mb-10 flex flex-wrap justify-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            class={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === tab ? "bg-primary text-white" : "bg-sky-soft text-ink/70 hover:text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* posts */}
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <a key={p.slug} href={`/blog/${p.slug}`} class="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition-all hover:-translate-y-1 hover:shadow-lg">
            {p.coverImage && (
              <img src={p.coverImage} alt={p.title} class="aspect-[16/9] w-full object-cover" loading="lazy" />
            )}
            <div class="flex flex-1 flex-col p-5">
              <span class="text-xs font-semibold uppercase tracking-widest text-primary">{p.category}</span>
              <h3 class="mt-2 font-semibold text-ink group-hover:text-primary">{p.title}</h3>
              <p class="mt-2 flex-1 text-sm text-ink/70">{p.excerpt}</p>
              <span class="mt-4 text-sm text-ink/50">
                {new Date(p.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          </a>
        ))}
      </div>

      {shown.length === 0 && <p class="mt-10 text-center text-ink/50">No posts in this category yet.</p>}
    </div>
  );
}