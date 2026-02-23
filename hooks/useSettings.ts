"use client";

import { useState, useEffect } from "react";
import type { CostItem } from "@/types";
import {
  DEFAULT_FIXED_COSTS,
  DEFAULT_KAHOKO_COSTS,
  DEFAULT_SUBSCRIPTION_COSTS,
  STORAGE_KEY_FIXED,
  STORAGE_KEY_KAHOKO,
  STORAGE_KEY_SUBSCRIPTIONS,
} from "@/constants/defaults";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useFixedCosts() {
  const [items, setItems] = useState<CostItem[]>(() =>
    loadFromStorage(STORAGE_KEY_FIXED, DEFAULT_FIXED_COSTS)
  );

  const save = (next: CostItem[]) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY_FIXED, JSON.stringify(next));
  };

  return { items, save };
}

export function useKahokoCosts() {
  const [items, setItems] = useState<CostItem[]>(() =>
    loadFromStorage(STORAGE_KEY_KAHOKO, DEFAULT_KAHOKO_COSTS)
  );

  const save = (next: CostItem[]) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY_KAHOKO, JSON.stringify(next));
  };

  return { items, save };
}

export function useSubscriptionCosts() {
  const [items, setItems] = useState<CostItem[]>(() =>
    loadFromStorage(STORAGE_KEY_SUBSCRIPTIONS, DEFAULT_SUBSCRIPTION_COSTS)
  );

  const save = (next: CostItem[]) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY_SUBSCRIPTIONS, JSON.stringify(next));
  };

  return { items, save };
}
