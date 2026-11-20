import { CheckCircle, XCircle, Clock, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { colors } from "@/lib/tokens";

interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  icon: LucideIcon;
}

// 지원서 상태 색. 검토 중은 주의(주황), 1차 합격은 초록, 최종 합격은 라임 바탕에 잉크 글자, 불합격은 붉은색.
// color는 글자색, bg는 바탕색이다. 라임은 바탕으로만 쓴다.
export const STATUS_CFG: Record<string, StatusConfig> = {
  pending: {
    label: "검토 중",
    color: colors.warning,
    bg: colors.warningBg,
    icon: Clock,
  },
  pass1: {
    label: "1차 합격",
    color: colors.success,
    bg: colors.successBg,
    icon: CheckCircle,
  },
  pass2: {
    label: "2차 합격",
    color: colors.textPrimary,
    bg: colors.lime,
    icon: Star,
  },
  fail: {
    label: "불합격",
    color: colors.danger,
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
