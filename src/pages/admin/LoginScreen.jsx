import { useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { css, cx } from "@/lib/css";
import { colors } from "@/lib/tokens";
import { ADMIN_PASSWORD } from "./constants";
import { inputCss, inputErrorCss } from "./styles";

const wrapCss = css({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingInline: "24px",
});
const innerCss = css({ width: "100%", maxWidth: "24rem" });
const headerCss = css({ textAlign: "center", marginBottom: "40px" });
const iconCss = css({
  width: "64px",
  height: "64px",
  backgroundColor: "rgba(245,158,11,0.1)",
  color: colors.brand,
  borderRadius: "9999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginInline: "auto",
  marginBottom: "24px",
});
const titleCss = css({
  fontSize: "24px",
  fontWeight: "900",
  color: colors.textPrimary,
  marginBottom: "8px",
});
const subCss = css({ color: colors.textFaint, fontSize: "14px" });
const formCss = css({ display: "flex", flexDirection: "column", gap: "16px" });
const btnCss = css({
  width: "100%",
  backgroundColor: colors.brand,
  color: colors.bgPage,
  paddingBlock: "16px",
  borderRadius: "0.75rem",
  fontWeight: "900",
  fontSize: "14px",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.2s",
  _hover: { backgroundColor: colors.brandHover },
});
const errorCss = css({
  color: colors.dangerMuted,
  fontSize: "12px",
  paddingInline: "4px",
});
const hintCss = css({
  textAlign: "center",
  color: colors.textDimmest,
  fontSize: "12px",
  marginTop: "24px",
});

export default function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("cococ_admin", "1");
      onLogin();
    } else {
      setError(true);
      setPw("");
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className={wrapCss}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className={innerCss}
      >
        <div className={headerCss}>
          <div className={iconCss}>
            <Lock size={28} />
          </div>
          <h1 className={titleCss}>관리자 로그인</h1>
          <p className={subCss}>COCOC 운영진 전용 페이지입니다.</p>
        </div>
        <form onSubmit={submit} className={formCss}>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className={cx(inputCss, error ? inputErrorCss : "")}
          />
          {error && <p className={errorCss}>비밀번호가 올바르지 않습니다.</p>}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={btnCss}
          >
            로그인
          </motion.button>
        </form>
        <p className={hintCss}>기본 비밀번호: cococ2024</p>
      </motion.div>
    </div>
  );
}
