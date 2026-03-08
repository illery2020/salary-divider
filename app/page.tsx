"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Copy, Check, ChevronRight } from "lucide-react";
import {
    useFixedCosts,
    useKahokoCosts,
    useSubscriptionCosts,
} from "@/hooks/useSettings";
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

    const [income, setIncome] = useState<string>(() => {
        if (typeof window === "undefined") return "";
        return localStorage.getItem("salary-divider:income") ?? "";
    });
    const [savings, setSavings] = useState<string>(DEFAULT_SAVINGS.toLocaleString("ja-JP"));
    const [ownFood, setOwnFood] = useState<string>(DEFAULT_OWN_FOOD.toLocaleString("ja-JP"));
    const [copied, setCopied] = useState(false);

    const fixedTotal = useMemo(() => sumItems(fixedItems), [fixedItems]);
    const kahokoTotal = useMemo(() => sumItems(kahokoItems), [kahokoItems]);
    const subscriptionTotal = useMemo(
        () => sumItems(subscriptionItems),
        [subscriptionItems],
    );

    const incomeNum = parseInt(income.replace(/,/g, ""), 10) || 0;
    const savingsNum = parseInt(savings.replace(/,/g, ""), 10) || 0;
    const ownFoodNum = parseInt(ownFood.replace(/,/g, ""), 10) || 0;

    const freeAmount =
        incomeNum -
        fixedTotal -
        subscriptionTotal -
        kahokoTotal -
        savingsNum -
        ownFoodNum;
    const isNegative = freeAmount < 0;
    const hasIncome = incomeNum > 0;

    const handleCopy = async () => {
        const text = [
            "給料分割案",
            `手取り：${formatYen(incomeNum)}円`,
            `固定費計：${formatYen(fixedTotal)}円`,
            `サブスク計：${formatYen(subscriptionTotal)}円`,
            `相手へ：${formatYen(kahokoTotal)}円`,
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
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={income}
                        onChange={(e) => {
                            setIncome(e.target.value);
                            localStorage.setItem("salary-divider:income", e.target.value);
                        }}
                        onFocus={(e) => setIncome(e.target.value.replace(/,/g, ""))}
                        onBlur={(e) => {
                            const num = parseInt(e.target.value.replace(/,/g, ""), 10);
                            if (!isNaN(num)) {
                                const formatted = num.toLocaleString("ja-JP");
                                setIncome(formatted);
                                localStorage.setItem("salary-divider:income", formatted);
                            }
                        }}
                        className="flex-1 text-3xl font-bold text-slate-800 border-b-2 border-slate-200 focus:border-blue-500 outline-none py-1 bg-transparent transition-colors"
                    />
                    <span className="text-xl text-slate-500 font-medium">
                        円
                    </span>
                </div>
            </section>

            {/* 固定費 */}
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                    <Link href="/settings/fixed-costs" className="text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-blue-500 transition-colors">
                        固定費
                    </Link>
                    <Link href="/settings/fixed-costs" className="flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-blue-500 transition-colors">
                        {formatYen(fixedTotal)}円
                        <ChevronRight size={14} className="text-slate-400" />
                    </Link>
                </div>
                <ul className="space-y-2">
                    {fixedItems.map((item) => (
                        <li
                            key={item.id}
                            className="flex justify-between text-sm"
                        >
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
                    <Link href="/settings/subscriptions" className="text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-blue-500 transition-colors">
                        サブスク
                    </Link>
                    <Link href="/settings/subscriptions" className="flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-blue-500 transition-colors">
                        {formatYen(subscriptionTotal)}円
                        <ChevronRight size={14} className="text-slate-400" />
                    </Link>
                </div>
                <ul className="space-y-2">
                    {subscriptionItems.map((item) => (
                        <li
                            key={item.id}
                            className="flex justify-between text-sm"
                        >
                            <span className="text-slate-600">{item.name}</span>
                            <span className="font-medium text-slate-700">
                                {formatYen(item.amount)}円
                            </span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* 相手に渡す */}
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                    <Link href="/settings/kahoko" className="text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-blue-500 transition-colors">
                        相手に渡す
                    </Link>
                    <Link href="/settings/kahoko" className="flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-blue-500 transition-colors">
                        {formatYen(kahokoTotal)}円
                        <ChevronRight size={14} className="text-slate-400" />
                    </Link>
                </div>
                <ul className="space-y-2">
                    {kahokoItems.map((item) => (
                        <li
                            key={item.id}
                            className="flex justify-between text-sm"
                        >
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
                            type="text"
                            inputMode="numeric"
                            value={savings}
                            onChange={(e) => setSavings(e.target.value)}
                            onFocus={(e) => setSavings(e.target.value.replace(/,/g, ""))}
                            onBlur={(e) => {
                                const num = parseInt(e.target.value.replace(/,/g, ""), 10);
                                if (!isNaN(num)) setSavings(num.toLocaleString("ja-JP"));
                            }}
                            className="flex-1 text-2xl font-bold text-slate-800 border-b-2 border-slate-200 focus:border-blue-500 outline-none py-1 bg-transparent transition-colors"
                        />
                        <span className="text-base text-slate-500 font-medium">
                            円
                        </span>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        自分の食費
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            inputMode="numeric"
                            value={ownFood}
                            onChange={(e) => setOwnFood(e.target.value)}
                            onFocus={(e) => setOwnFood(e.target.value.replace(/,/g, ""))}
                            onBlur={(e) => {
                                const num = parseInt(e.target.value.replace(/,/g, ""), 10);
                                if (!isNaN(num)) setOwnFood(num.toLocaleString("ja-JP"));
                            }}
                            className="flex-1 text-2xl font-bold text-slate-800 border-b-2 border-slate-200 focus:border-blue-500 outline-none py-1 bg-transparent transition-colors"
                        />
                        <span className="text-base text-slate-500 font-medium">
                            円
                        </span>
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
