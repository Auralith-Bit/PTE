"use client";

import { useEffect, useState } from "react";

import { questionsApi } from "@/lib/api/questions";

export function SpeakingTypeCount({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    questionsApi
      .list("speaking", { type: slug, limit: 1 })
      .then((res) => {
        if (!cancelled) setCount(res.total);
      })
      .catch(() => {
        if (!cancelled) setCount(null);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <span className="speaking-type-meta">
      {count === null ? "Loading…" : `${count} Question${count === 1 ? "" : "s"}`}
    </span>
  );
}
