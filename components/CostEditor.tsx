"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import type { CostItem } from "@/types";

type Props = {
  initialItems: CostItem[];
  onSave: (items: CostItem[]) => void;
};

function newItem(): CostItem {
  return { id: crypto.randomUUID(), name: "", amount: 0 };
}

function formatYen(n: number) {
  return n.toLocaleString("ja-JP");
}

export default function CostEditor({ initialItems, onSave }: Props) {
  const [items, setItems] = useState<CostItem[]>(initialItems);
  const [saved, setSaved] = useState(false);

  const total = items.reduce((acc, i) => acc + (i.amount || 0), 0);

  const updateName = (id: string, name: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, name } : i)));

  const updateAmount = (id: string, raw: string) => {
    const amount = parseInt(raw, 10) || 0;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, amount } : i)));
  };

  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const add = () => setItems((prev) => [...prev, newItem()]);

  const handleSave = () => {
    onSave(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-2 bg-white rounded-xl p-3 shadow-sm border border-slate-100"
          >
            <input
              type="text"
              placeholder="項目名"
              value={item.name}
              onChange={(e) => updateName(item.id, e.target.value)}
              className="flex-1 text-sm text-slate-700 border-b border-slate-200 focus:border-blue-400 outline-none py-1 bg-transparent"
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={item.amount || ""}
              onChange={(e) => updateAmount(item.id, e.target.value)}
              className="w-28 text-right text-sm font-semibold text-slate-700 border-b border-slate-200 focus:border-blue-400 outline-none py-1 bg-transparent"
            />
            <span className="text-xs text-slate-400 shrink-0">円</span>
            <button
              onClick={() => remove(item.id)}
              className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
              aria-label="削除"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={add}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 text-sm font-medium hover:border-blue-300 hover:text-blue-500 transition-colors"
      >
        <Plus size={16} />
        項目を追加
      </button>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
        <span className="text-sm text-slate-500 font-medium">合計</span>
        <span className="text-lg font-bold text-slate-800">
          {formatYen(total)}円
        </span>
      </div>

      <button
        onClick={handleSave}
        className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${
          saved
            ? "bg-emerald-500 text-white"
            : "bg-slate-800 text-white hover:bg-slate-700 active:scale-95"
        }`}
      >
        {saved ? "保存しました ✓" : "保存する"}
      </button>
    </div>
  );
}
