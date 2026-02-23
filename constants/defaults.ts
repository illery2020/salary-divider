import type { CostItem } from "@/types";

export const DEFAULT_FIXED_COSTS: CostItem[] = [
  { id: "rent", name: "家賃", amount: 60000 },
  { id: "utilities", name: "水道光熱費+NHK", amount: 6000 },
  { id: "ahamo", name: "通信費（ahamo）", amount: 2500 },
  { id: "docomo", name: "通信費（ドコモ光）", amount: 2970 },
  { id: "iphone", name: "携帯代（iPhone15分割）", amount: 5000 },
];

export const DEFAULT_KAHOKO_COSTS: CostItem[] = [
  { id: "food", name: "食費", amount: 15000 },
  { id: "daily", name: "日用品", amount: 5000 },
];

export const DEFAULT_SAVINGS = 90000;
export const DEFAULT_OWN_FOOD = 30000;

export const DEFAULT_SUBSCRIPTION_COSTS: CostItem[] = [
  { id: "subscription-default", name: "サブスク", amount: 3500 },
];

export const STORAGE_KEY_FIXED = "salary-divider:fixed-costs";
export const STORAGE_KEY_KAHOKO = "salary-divider:kahoko-costs";
export const STORAGE_KEY_SUBSCRIPTIONS = "salary-divider:subscriptions";
