import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQ_DATA } from "@/data";
import PageWrapper from "@/components/ui/PageWrapper";
import SectionTitle from "@/components/ui/SectionTitle";
import { applyService } from "@/domain/apply/apply-service";
import { AlertModal, useAlert } from "@/components/ui/Modal";
import { css } from "@/lib/css";
import { colors, shadows } from "@/lib/tokens";
import { INIT, stepVariants } from "./constants";
import { summaryRowCss, summaryLabelCss, summaryValueCss } from "./styles";
import ClosedScreen from "./ClosedScreen";
import FaqItem from "./components/FaqItem";
import Step1Personal from "./steps/Step1Personal";
import Step2Activity from "./steps/Step2Activity";
import Step3Introduction from "./steps/Step3Introduction";
import Step4Confirm from "./steps/Step4Confirm";

// ─── Page styles ──────────────────────────────────────────────
const pageCss = css({
  paddingTop: "128px",
  paddingBottom: "96px",
  paddingInline: "24px",
  "@md": { paddingInline: "48px" },
});

const headerCss = css({ textAlign: "center", marginBottom: "48px" });
const eyebrowCss = css({
  color: colors.brand,
  fontSize: "11px",
  fontWeight: "900",
  letterSpacing: "4px",
  textTransform: "uppercase",
  marginBottom: "12px",
});
const pageTitleCss = css({
  fontSize: "48px",
  fontWeight: "900",
  color: colors.textPrimary,
  marginBottom: "12px",
});
const pageSubCss = css({ color: colors.textMuted, fontSize: "14px" });

const formBoxCss = css({
  backgroundColor: colors.bgCard,
  borderRadius: "1.5rem",
  overflow: "hidden",
  border: `1px solid ${colors.borderSubtle}`,
  maxWidth: "42rem",
  marginInline: "auto",
  marginBottom: "80px",
  boxShadow: shadows.card,
});

const formBodyCss = css({ padding: "32px", "@md": { padding: "48px" } });

const formTopRowCss = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "32px",
});
const stepLabelCss = css({
  fontSize: "10px",
  fontWeight: "900",
  color: colors.brand,
  textTransform: "uppercase",
  letterSpacing: "3px",
});
const stepCountCss = css({
  color: colors.textFaint,
  fontSize: "12px",
  fontWeight: "700",
});

const formNavCss = css({
  display: "flex",
  justifyContent: "space-between",
  marginTop: "40px",
  paddingTop: "32px",
  borderTop: `1px solid ${colors.borderSubtle}`,
});

const prevBtnCss = css({
  paddingInline: "24px",
  paddingBlock: "12px",
  borderRadius: "0.75rem",
  fontWeight: "700",
  fontSize: "14px",
  transition: "all 0.2s",
  backgroundColor: "rgba(255,255,255,0.05)",
  color: colors.textMuted,
  border: "none",
  cursor: "pointer",
  _hover: { color: colors.textPrimary },
});

const nextBtnCss = css({
  backgroundColor: colors.brand,
  color: colors.bgPage,
  paddingInline: "40px",
  paddingBlock: "12px",
  borderRadius: "0.75rem",
  fontWeight: "900",
  fontSize: "14px",
  transition: "all 0.2s",
  border: "none",
  cursor: "pointer",
  _hover: { backgroundColor: colors.brandHover },
});

const nextBtnDisabledCss = css({
  backgroundColor: "rgba(255,255,255,0.08)",
  color: colors.textDimmer,
  cursor: "not-allowed",
});

const submitBtnCss = css({
  backgroundColor: colors.brand,
  color: colors.bgPage,
  paddingInline: "40px",
  paddingBlock: "12px",
  borderRadius: "0.75rem",
  fontWeight: "900",
  fontSize: "14px",
  transition: "background-color 0.2s",
  border: "none",
  cursor: "pointer",
  boxShadow: shadows.amberMd,
  _hover: { backgroundColor: colors.brandHover },
});

// Success screen
const successWrapCss = css({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingInline: "24px",
});
const successInnerCss = css({ textAlign: "center", maxWidth: "28rem" });
const successIconWrapCss = css({
  width: "96px",
  height: "96px",
  backgroundColor: "rgba(245,158,11,0.1)",
  color: colors.brand,
  borderRadius: "9999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginInline: "auto",
  marginBottom: "32px",
  fontSize: "48px",
});
const successTitleCss = css({
  fontSize: "36px",
  fontWeight: "900",
  color: colors.textPrimary,
  marginBottom: "16px",
});
const successDescCss = css({
  color: colors.textMuted,
  fontSize: "14px",
  lineHeight: "1.625",
  marginBottom: "32px",
});
const successNameCss = css({ color: colors.textPrimary, fontWeight: "700" });
const successCardCss = css({
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderSubtle}`,
  borderRadius: "1rem",
  padding: "24px",
  textAlign: "left",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginBottom: "24px",
});
const successFooterCss = css({ color: colors.textDimmer, fontSize: "12px" });

// FAQ
const faqWrapCss = css({ maxWidth: "42rem", marginInline: "auto" });
const faqListCss = css({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

// ─── Main ─────────────────────────────────────────────────────
export default function ApplyPage() {
  const [open, setOpen] = useState<boolean | null>(null);
  const [generation, setGeneration] = useState<number | null>(null);
  const { alertProps, openAlert } = useAlert();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [isOpen, period] = await Promise.all([
          applyService.isApplyOpen().catch(() => true),
          applyService.loadApplyPeriod().catch(() => null),
        ]);
        if (cancelled) return;
        setOpen(isOpen);
        setGeneration(period?.generation ?? null);
      } catch {
        if (!cancelled) setOpen(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(INIT);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setV = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const [showErrors, setShowErrors] = useState(false);

  const validate = (s) => {
    if (s === 1) return {
      name:      !form.name.trim()      ? "이름을 입력해주세요" : "",
      gender:    !form.gender           ? "성별을 선택해주세요" : "",
      birthdate: !form.birthdate.trim() ? "생년월일을 입력해주세요"
                 : !/^\d{6}$/.test(form.birthdate.replace(/\D/g, "")) ? "6자리 숫자로 입력해주세요 (예: 001231)" : "",
      phone:     !form.phone.trim()     ? "연락처를 입력해주세요"
                 : !/^01[016789][-\s]?\d{3,4}[-\s]?\d{4}$/.test(form.phone.replace(/\s/g, "")) ? "올바른 형식으로 입력해주세요 (예: 010-1234-5678)" : "",
      email:     !form.email.trim()     ? "이메일을 입력해주세요"
                 : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "올바른 이메일 주소를 입력해주세요" : "",
    };
    if (s === 2) return {
      interviewTimes: form.interviewTimes.length === 0 ? "면접 가능 시간을 1개 이상 선택해주세요" : "",
      mtAvailable:    !form.mtAvailable                ? "MT 참가 여부를 선택해주세요" : "",
      scaleDesignTool: form.scaleDesignTool === null   ? "디자인 툴 활용 능력을 선택해주세요" : "",
      scaleCameraTool: form.scaleCameraTool === null   ? "사진/영상 촬영 능력을 선택해주세요" : "",
    };
    if (s === 3) return {
      q1_intro:        !form.q1_intro.trim()        ? "자기소개를 작성해주세요" : "",
      q2_motivation:   !form.q2_motivation.trim()   ? "지원 동기를 작성해주세요" : "",
      q3_drink:        !form.q3_drink               ? "비전을 선택해주세요" : "",
      q4_contribution: !form.q4_contribution.trim() ? "선택한 이유를 작성해주세요" : "",
    };
    return {};
  };

  const errors = showErrors ? validate(step) : {};
  const hasError = Object.values(errors).some(Boolean);

  const TOTAL = 4;
  const goTo = (next) => {
    setDirection(next > step ? 1 : -1);
    setStep(Math.max(1, Math.min(TOTAL, next)));
  };

  const handleNext = () => {
    const errs = validate(step);
    if (Object.values(errs).some(Boolean)) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    goTo(step + 1);
  };

  const handleSubmit = async () => {
    if (!form.privacyAgree) {
      openAlert({
        title: "개인정보 동의 필요",
        description: "개인정보 수집 및 이용에 동의해 주세요.",
        type: "info",
      });
      return;
    }
    try {
      await applyService.saveApplication(form);
      setSubmitted(true);
    } catch {
      openAlert({
        title: "제출 실패",
        description: "잠시 후 다시 시도해 주세요.",
        type: "error",
      });
    }
  };

  if (open === null)
    return <PageWrapper><div style={{ minHeight: "60vh" }} /></PageWrapper>;

  if (!open)
    return (
      <PageWrapper>
        <ClosedScreen />
      </PageWrapper>
    );

  if (submitted)
    return (
      <PageWrapper>
        <div className={successWrapCss}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={successInnerCss}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 14,
                delay: 0.2,
              }}
              className={successIconWrapCss}
            >
              🥂
            </motion.div>
            <h2 className={successTitleCss}>지원 완료!</h2>
            <p className={successDescCss}>
              <span className={successNameCss}>{form.name}</span>님의 지원서가
              접수되었습니다.
              <br />
              검토 후 개별 연락드리겠습니다. 즐겁게 기다려 주세요 :)
            </p>
            <div className={successCardCss}>
              {[
                ["이름", form.name],
                ["연락처", form.phone],
                ["이메일", form.email],
                ["접수 시각", new Date().toLocaleString("ko-KR")],
              ].map(([l, v]) => (
                <div key={l} className={summaryRowCss}>
                  <span className={summaryLabelCss}>{l}</span>
                  <span className={summaryValueCss}>{v}</span>
                </div>
              ))}
            </div>
            <p className={successFooterCss}>
              최종 결과는 발표일에 개별 안내드립니다.
            </p>
          </motion.div>
        </div>
      </PageWrapper>
    );

  return (
    <PageWrapper>
      <div className={pageCss}>
        <motion.div
          className={headerCss}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className={eyebrowCss}>Recruitment</p>
          <h2 className={pageTitleCss}>
            COCOC {generation ?? ""}{generation ? "기 " : ""}지원서
          </h2>
          <p className={pageSubCss}>
            즐겁게 임하는 것, 코콕이 추구하는 가장 핵심적인 가치입니다.
          </p>
        </motion.div>

        <motion.div
          className={formBoxCss}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {/* Progress bar */}
          <motion.div
            style={{ height: "3px", backgroundColor: colors.brand }}
            initial={false}
            animate={{ width: `${(step / TOTAL) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          <div className={formBodyCss}>
            <div className={formTopRowCss}>
              <span className={stepLabelCss}>
                {["인적사항", "활동 & 소통", "자기소개", "최종 확인"][step - 1]}
              </span>
              <span className={stepCountCss}>
                {step} / {TOTAL}
              </span>
            </div>

            <div style={{ position: "relative", minHeight: "440px" }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {step === 1 && (
                    <Step1Personal form={form} set={set} setV={setV} errors={errors} />
                  )}
                  {step === 2 && (
                    <Step2Activity form={form} set={set} setV={setV} errors={errors} />
                  )}
                  {step === 3 && (
                    <Step3Introduction form={form} set={set} setV={setV} errors={errors} />
                  )}
                  {step === 4 && <Step4Confirm form={form} setForm={setForm} />}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className={formNavCss}>
              <motion.button
                onClick={() => goTo(step - 1)}
                whileTap={{ scale: 0.95 }}
                className={prevBtnCss}
                style={{ visibility: step === 1 ? "hidden" : "visible" }}
              >
                이전으로
              </motion.button>
              {step < TOTAL ? (
                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={nextBtnCss}
                >
                  다음
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={submitBtnCss}
                >
                  최종 제출
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <div className={faqWrapCss}>
          <SectionTitle title="FAQ" subtitle="자주 묻는 질문들" />
          <div className={faqListCss}>
            {FAQ_DATA.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </div>
      <AlertModal {...alertProps} />
    </PageWrapper>
  );
}
