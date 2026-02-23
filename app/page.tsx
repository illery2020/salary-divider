"use client";

import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";
import { useFixedCosts, useKahokoCosts, useSubscriptionCosts } from "@/hooks/useSettings";
import { DEFAULT_SAVINGS, DEFAULT_OWN_FOOD } from "@/constants/defaults";

function formatYen(n: number) {
  return n.toLocaleString("ja-JP");
}

function sumItems(items: { amount: number }[]) {
  return items.reduce((acc, i) => acc + i.amount, 0);
}

export default function Home() {
  const { items: fixedItems } = useFixedCosts();
  const { items: kahokoItems } = useKahokoCosts();
  const { items: subscriptionItems } = useSubscriptionCosts();

  const [income, setIncome] = useState<string>("");
  const [savings, setSavings] = useState<string>(String(DEFAULT_SAVINGS));
  const [ownFood, setOwnFood] = useState<string>(String(DEFAULT_OWN_FOOD));
  const [copied, setCopied] = useState(false);

  const fixedTotal = useMemo(() => sumItems(fixedItems), [fixedItems]);
  const kahokoTotal = useMemo(() => sumItems(kahokoItems), [kahokoItems]);
  const subscriptionTotal = useMemo(() => sumItems(subscriptionItems), [subscriptionItems]);

  const incomeNum = parseInt(income.replace(/,/g, ""), 10) || 0;
  const savingsNum = parseInt(savings.replace(/,/g, ""), 10) || 0;
  const ownFoodNum = parseInt(ownFood.replace(/,/g, ""), 10) || 0;

  const freeAmount = incomeNum - fixedTotal - subscriptionTotal - kahokoTotal - savingsNum - ownFoodNum;
  const isNegative = freeAmount < 0;
  const hasIncome = incomeNum > 0;

  const handleCopy = async () => {
    const text = [
      "給料分割案",
      `手取り：${formatYen(incomeNum)}円`,
      `固定費計：${formatYen(fixedTotal)}円`,
      `サブスク計：${formatYen(subscriptionTotal)}円`,
      `かほこへ：${formatYen(kahokoTotal)}円`,
      `貯金：${formatYen(savingsNum)}円`,
      `自分の食費：${formatYen(ownFoodNum)}円`,
      `自由費：${formatYen(freeAmount)}円`,
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* 手取り入力 */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          手取り額
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="flex-1 text-3xl font-bold text-slate-800 border-b-2 border-slate-200 focus:border-blue-500 outline-none py-1 bg-transparent transition-colors"
          />
          <span className="text-xl text-slate-500 font-medium">円</span>
        </div>
      </section>

      {/* 固定費 */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            固定費
          </h2>
          <span className="text-sm font-bold text-slate-700">
            {formatYen(fixedTotal)}円
          </span>
        </div>
        <ul className="space-y-2">
          {fixedItems.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span className="text-slate-600">{item.name}</span>
              <span className="font-medium text-slate-700">
                {formatYen(item.amount)}円
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* サブスク */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            サブスク
          </h2>
          <span className="text-sm font-bold text-slate-700">
            {formatYen(subscriptionTotal)}円
          </span>
        </div>
        <ul className="space-y-2">
          {subscriptionItems.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span className="text-slate-600">{item.name}</span>
              <span className="font-medium text-slate-700">
                {formatYen(item.amount)}円
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* かほこへ */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            かほこへ
          </h2>
          <span className="text-sm font-bold text-slate-700">
            {formatYen(kahokoTotal)}円
          </span>
        </div>
        <ul className="space-y-2">
          {kahokoItems.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span className="text-slate-600">{item.name}</span>
              <span className="font-medium text-slate-700">
                {formatYen(item.amount)}円
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 変動費（貯金・自分の食費） */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            貯金
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
              className="flex-1 text-2xl font-bold text-slate-800 border-b-2 border-slate-200 focus:border-blue-500 outline-none py-1 bg-transparent transition-colors"
            />
            <span className="text-base text-slate-500 font-medium">円</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            自分の食費
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              value={ownFood}
              onChange={(e) => setOwnFood(e.target.value)}
              className="flex-1 text-2xl font-bold text-slate-800 border-b-2 border-slate-200 focus:border-blue-500 outline-none py-1 bg-transparent transition-colors"
            />
            <span className="text-base text-slate-500 font-medium">円</span>
          </div>
        </div>
      </section>

      {/* 結果パネル */}
      <section
        className={`rounded-2xl p-6 shadow-sm transition-colors ${
          !hasIncome
            ? "bg-slate-100 border border-slate-200"
            : isNegative
            ? "bg-red-50 border border-red-200"
            : "bg-emerald-50 border border-emerald-200"
        }`}
      >
        <p
          className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
            !hasIncome
              ? "text-slate-400"
              : isNegative
              ? "text-red-500"
              : "text-emerald-600"
          }`}
        >
          {isNegative && hasIncome ? "赤字！ " : ""}自由費
        </p>
        <p
          className={`text-4xl font-black tracking-tight ${
            !hasIncome
              ? "text-slate-300"
              : isNegative
              ? "text-red-600"
              : "text-emerald-700"
          }`}
        >
          {hasIncome ? `¥ ${formatYen(freeAmount)}` : "¥ ---"}
        </p>
        {isNegative && hasIncome && (
          <p className="mt-1 text-xs text-red-500">
            収支がマイナスです。固定費や貯金を見直してみましょう。
          </p>
        )}
      </section>

      {/* コピーボタン */}
      <button
        onClick={handleCopy}
        disabled={!hasIncome}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all ${
          hasIncome
            ? "bg-slate-800 text-white hover:bg-slate-700 active:scale-95"
            : "bg-slate-200 text-slate-400 cursor-not-allowed"
        }`}
      >
        {copied ? (
          <>
            <Check size={18} />
            コピーしました
          </>
        ) : (
          <>
            <Copy size={18} />
            結果をコピー
          </>
        )}
      </button>
    </div>
  );
}
