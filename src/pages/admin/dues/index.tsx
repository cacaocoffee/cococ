// 관리자 `회비` 탭: 이번 달 요약, 연결 안 된 입금, 미납자, 입금 내역, 회비 규칙.
import { useState } from "react";
import { RotateCw } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import { css, cx } from "@/lib/css";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { hrKeys, useHrOverview } from "@/domain/hr/hr-query-options";
import { tabHeaderRowCss, tabTitleCss } from "../styles";
import { cardCss, hrRootCss, quietBtnCss, smallBtnCss } from "../members/shared/styles";
import { ErrorState, RowsSkeleton, Segmented, useToast } from "../members/shared/ui";
import DepositsSection from "./DepositsSection";
import RulesSection from "./RulesSection";
import SummarySection from "./SummarySection";
import UnmatchedSection from "./UnmatchedSection";
import UnpaidSection from "./UnpaidSection";

type View = "unpaid" | "deposits" | "rules";

const viewBarCss = css({ marginTop: "40px", marginBottom: "24px" });
const spinCss = css({ animation: "spin 0.8s linear infinite" });

function scrollToId(id: string) {
  // 화면이 바뀐 다음에 그 위치로 내려가도록 한 박자 늦춘다
  window.setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
}

export default function DuesTab() {
  const { data, isPending, isError, refetch, isRefetching } = useHrOverview();
  const qc = useQueryClient();
  // 요약뿐 아니라 입금 내역, 기기 목록까지 이 탭에서 쓰는 것을 모두 다시 불러온다
  const isFetching = useIsFetching({ queryKey: hrKeys.all }) > 0;
  const { notify, toastNode } = useToast();
  const [view, setView] = useState<View>("unpaid");

  const unpaidCount = data ? data.members.filter((m) => m.due > 0).length : 0;

  return (
    <div className={hrRootCss}>
      <div className={tabHeaderRowCss}>
        <h2 className={tabTitleCss}>회비</h2>
        <button
          type="button"
          className={cx(quietBtnCss, smallBtnCss)}
          onClick={() => void qc.invalidateQueries({ queryKey: hrKeys.all })}
          disabled={isFetching}
          title="총무 휴대폰에서 방금 올라온 입금까지 다시 불러와요"
        >
          <RotateCw size={14} className={isFetching ? spinCss : undefined} /> 새로 고침
        </button>
      </div>

      {isPending ? (
        <div aria-busy="true" aria-label="불러오는 중">
          <div className={cardCss} style={{ padding: "28px", marginBottom: "40px" }}>
            <Skeleton width={120} height={13} />
            <Skeleton width="55%" height={44} style={{ marginTop: "14px" }} />
            <Skeleton height={8} radius="9999px" style={{ marginTop: "20px" }} />
          </div>
          <RowsSkeleton rows={5} />
        </div>
      ) : isError || !data ? (
        <ErrorState title="회비 현황을 불러오지 못했어요" onRetry={() => void refetch()} retrying={isRefetching} />
      ) : (
        <>
          <SummarySection
            overview={data}
            onGoUnmatched={() => scrollToId("hr-unmatched")}
            onGoUnpaid={() => {
              setView("unpaid");
              scrollToId("hr-views");
            }}
          />

          <UnmatchedSection deposits={data.unmatched} members={data.members} notify={notify} />

          <div className={viewBarCss} id="hr-views" style={{ scrollMarginTop: "24px" }}>
            <Segmented<View>
              ariaLabel="회비 화면 고르기"
              value={view}
              onChange={setView}
              options={[
                { value: "unpaid", label: "미납자", count: unpaidCount },
                { value: "deposits", label: "입금 내역" },
                { value: "rules", label: "회비 규칙" },
              ]}
            />
          </div>

          {view === "unpaid" && <UnpaidSection overview={data} notify={notify} />}
          {view === "deposits" && <DepositsSection overview={data} notify={notify} />}
          {view === "rules" && <RulesSection settings={data.settings} notify={notify} />}
        </>
      )}

      {toastNode}
    </div>
  );
}
