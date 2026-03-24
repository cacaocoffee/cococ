import { CheckCircle, XCircle, Clock, Star } from "lucide-react";
import { colors } from "@/lib/tokens";

export const ADMIN_PASSWORD = "cococ2024";

export const STATUS_CFG = {
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

export const ARCHIVE_CATS = ["정기 클래스", "MT/파티", "외부 협업"];

export const EMPTY_ARCHIVE = {
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
  recipes: "",
  year: "",
  semester: "",
};

export const EMPTY_MAG = {
  title: "",
  author: "에디터 콕",
  date: "",
  readTime: "",
  excerpt: "",
  img: "",
  tags: "",
  content: "",
};
