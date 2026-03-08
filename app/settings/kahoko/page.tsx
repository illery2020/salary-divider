"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CostEditor from "@/components/CostEditor";
import { useKahokoCosts } from "@/hooks/useSettings";

export default function KahokoPage() {
  const { items, save } = useKahokoCosts();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="戻る"
        >
          <ChevronLeft size={22} className="text-slate-600" />
        </Link>
        <h1 className="text-lg font-bold text-slate-800">相手に渡す分の設定</h1>
      </div>
      <p className="text-xs text-slate-400">
        項目名と金額を編集して「保存する」を押してください。
      </p>
      <CostEditor initialItems={items} onSave={save} />
    </div>
  );
}
