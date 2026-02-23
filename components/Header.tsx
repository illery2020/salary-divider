"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Settings, ChevronRight } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-slate-800 tracking-tight">
          Salary Divider
        </Link>

        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="設定を開く"
          >
            <Settings size={22} className="text-slate-600" />
          </button>

          {open && (
            <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
              <Link
                href="/settings/fixed-costs"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>固定費の設定</span>
                <ChevronRight size={16} className="text-slate-400" />
              </Link>
              <div className="border-t border-slate-100" />
              <Link
                href="/settings/subscriptions"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>サブスクの設定</span>
                <ChevronRight size={16} className="text-slate-400" />
              </Link>
              <div className="border-t border-slate-100" />
              <Link
                href="/settings/kahoko"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>かほこへ渡す分の設定</span>
                <ChevronRight size={16} className="text-slate-400" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
