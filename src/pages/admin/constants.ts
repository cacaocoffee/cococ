import { CheckCircle, XCircle, Clock, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { colors } from "@/lib/tokens";

interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  icon: LucideIcon;
}

export const STATUS_CFG: Record<string, StatusConfig> = {
  pending: {
    label: "검토 중",
    color: "#facc15",
    bg: "rgba(250,204,21,0.1)",
    icon: Clock,
  },
  pass1: {
    label: "1차 합격",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    icon: CheckCircle,
  },
  pass2: {
    label: "2차 합격",
    color: "#10b981",
    bg: "rgba(16,185,129,0.15)",
    icon: Star,
  },
  fail: {
    label: "불합격",
    color: colors.dangerMuted,
    bg: colors.dangerBg,
    icon: XCircle,
  },
};

export const ARCHIVE_CATS: string[] = ["정기 클래스", "MT/파티", "외부 협업"];

export interface EmptyArchive {
  title: string;
  category: string;
  date: string;
  base: string;
  location: string;
  participants: string;
  description: string;
  img: string;
  tags: string;
  gallery: string[];
  recipes: { name: string; ingredients: string; img: string }[];
  content: unknown[];
  year: string;
}

export const EMPTY_ARCHIVE: EmptyArchive = {
  title: "",
  category: "정기 클래스",
  date: "",
  base: "",
  location: "",
  participants: "",
  description: "",
  img: "",
  tags: "",
  gallery: [],
  recipes: [],
  content: [],
  year: "",
};

export interface EmptyMag {
  title: string;
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  img: string;
  tags: string;
  magazineType: string;
  content: unknown[];
  instagramUrls: string[];
}

export const EMPTY_MAG: EmptyMag = {
  title: "",
  author: "에디터 콕",
  date: "",
  readTime: "",
  excerpt: "",
  img: "",
  tags: "",
  magazineType: "blog",
  content: [],
  instagramUrls: [],
};
