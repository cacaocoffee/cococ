import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";
import TagBadge from "@/components/ui/TagBadge";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";
import type { ArchiveItem } from "@/domain/archive/archive-dto";

const metaRowCss = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "24px",
  paddingBottom: "40px",
  marginBottom: "40px",
  borderBottom: `1px solid ${colors.borderMedium}`,
  alignItems: "center",
});

const metaItemCss = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: colors.textMuted,
  fontSize: "14px",
});

const metaIconCss = css({ color: colors.brand });

const tagsRowCss = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginLeft: "auto",
});

interface MetaRowProps {
  item: ArchiveItem;
}

export default function MetaRow({ item }: MetaRowProps) {
  const metaItems = [
    { icon: <MapPin size={15} />, label: item.location },
    { icon: <Users size={15} />, label: `참여 ${item.participants}명` },
  ].filter((m) => m.label && m.label !== "undefined명");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className={metaRowCss}
    >
      {metaItems.map((m, i) => (
        <div key={i} className={metaItemCss}>
          <span className={metaIconCss}>{m.icon}</span>
          {m.label}
        </div>
      ))}
      <div className={tagsRowCss}>
        {(item.tags || []).map((tag) => (
          <TagBadge key={tag} label={tag} variant="default" />
        ))}
      </div>
    </motion.div>
  );
}
