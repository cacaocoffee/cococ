import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, CalendarDays } from "lucide-react";
import { useScheduleList } from "@/domain/schedule/schedule-query-options";
import {
  useAddSchedule,
  useUpdateSchedule,
  useDeleteSchedule,
} from "@/domain/schedule/schedule-mutation-options";
import { useArchiveList } from "@/domain/archive/archive-query-options";
import {
  ConfirmModal,
  AlertModal,
  useConfirm,
  useAlert,
} from "@/components/ui/Modal";
import LoadingButton from "@/components/ui/LoadingButton";
import TabSkeleton from "../components/TabSkeleton";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";
import type { ScheduleEvent } from "@/domain/schedule/schedule-dto";
import {
  inputCss,
  labelCss,
  formCardCss,
  formGrid2Css,
  formBtnRowCss,
  cancelBtnCss,
  saveBtnCss,
  tabHeaderRowCss,
  tabTitleCss,
  newBtnCss,
  subSectionLabelCss,
  listCss,
  itemCardCss,
  itemBodyCss,
  itemCatCss,
  itemTitleCss,
  itemMetaCss,
  itemActionsCss,
  editBtnCss,
  deleteBtnCss,
  emptyStateCss,
  emptyIconCss,
  emptyTextCss,
} from "../styles";

type ScheduleType = ScheduleEvent["type"];

const TYPE_COLOR: Record<ScheduleType, string> = {
  클래스: colors.brand,
  내부행사: "#a78bfa",
};

const SCHEDULE_TYPES: ScheduleType[] = ["클래스", "내부행사"];

interface ScheduleFormState {
  title: string;
  date: string;
  endDate: string;
  type: ScheduleType;
  archiveId: string;
}

const EMPTY_FORM: ScheduleFormState = {
  title: "",
  date: "",
  endDate: "",
  type: "클래스",
  archiveId: "",
};

interface ScheduleFormProps {
  initial?: ScheduleFormState;
  archiveOptions: { id: string | number; title: string }[];
  onSave: (data: Omit<ScheduleEvent, "id">) => void;
  onCancel: () => void;
  onAlert: (msg: string) => void;
  saving?: boolean;
}

function ScheduleForm({ initial = EMPTY_FORM, archiveOptions, onSave, onCancel, onAlert, saving = false }: ScheduleFormProps) {
  const [f, setF] = useState<ScheduleFormState>(initial);
  const set = (k: keyof ScheduleFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value }));

  const handleSave = () => {
    if (saving) return;
    if (!f.title.trim() || !f.date.trim()) {
      onAlert("제목과 시작 날짜는 필수입니다.");
      return;
    }
    if (f.endDate && f.endDate < f.date) {
      onAlert("종료 날짜는 시작 날짜 이후여야 합니다.");
      return;
    }
    const archiveIdNum = f.archiveId ? Number(f.archiveId) : NaN;
    onSave({
      title: f.title.trim(),
      date: f.date,
      endDate: f.endDate || undefined,
      type: f.type,
      archiveId: Number.isFinite(archiveIdNum) ? archiveIdNum : null,
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={formCardCss}>
      <div>
        <label className={labelCss}>제목 *</label>
        <input value={f.title} onChange={set("title")} className={inputCss} placeholder="첫번째 클래스, 시음회" />
      </div>

      <div className={formGrid2Css}>
        <div>
          <label className={labelCss}>시작 날짜 *</label>
          <input
            type="date"
            value={f.date}
            onChange={set("date")}
            className={inputCss}
            style={{ colorScheme: "dark" }}
          />
        </div>
        <div>
          <label className={labelCss}>종료 날짜 (선택)</label>
          <input
            type="date"
            value={f.endDate}
            onChange={set("endDate")}
            className={inputCss}
            style={{ colorScheme: "dark" }}
          />
        </div>
        <div>
          <label className={labelCss}>유형</label>
          <select value={f.type} onChange={set("type")} className={inputCss}>
            {SCHEDULE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCss}>연결할 아카이브 (선택)</label>
          <select value={f.archiveId} onChange={set("archiveId")} className={inputCss}>
            <option value="">— 연결 없음 —</option>
            {archiveOptions.map((a) => (
              <option key={a.id} value={String(a.id)}>{a.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={formBtnRowCss}>
        <button onClick={onCancel} className={cancelBtnCss} disabled={saving}>취소</button>
        <LoadingButton
          onClick={handleSave}
          whileHover={saving ? undefined : { scale: 1.03 }}
          className={saveBtnCss}
          loading={saving}
        >
          {saving ? "저장 중…" : "저장"}
        </LoadingButton>
      </div>
    </motion.div>
  );
}

const dotCss = css({
  width: "10px",
  height: "10px",
  borderRadius: "3px",
  flexShrink: "0",
});
const thumbWrapCss = css({
  width: "64px",
  height: "64px",
  borderRadius: "0.75rem",
  flexShrink: "0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(255,255,255,0.04)",
});

const toForm = (item: ScheduleEvent): ScheduleFormState => ({
  title: item.title,
  date: item.date,
  endDate: item.endDate ?? "",
  type: item.type,
  archiveId: item.archiveId != null ? String(item.archiveId) : "",
});

const formatDate = (str: string): string => {
  if (!str) return "";
  const [y, m, d] = str.split("-");
  return `${y}.${m}.${d}`;
};

export default function ScheduleTab() {
  const { data: items = [], isLoading: schedLoading } = useScheduleList();
  const { data: archives = [], isLoading: archLoading } = useArchiveList();
  const addMutation = useAddSchedule();
  const updateMutation = useUpdateSchedule();
  const deleteMutation = useDeleteSchedule();
  const [mode, setMode] = useState<"create" | ScheduleEvent | null>(null);
  const { confirmProps, openConfirm } = useConfirm();
  const { alertProps, openAlert } = useAlert();

  const archiveOptions = archives.map((a) => ({ id: a.id, title: a.title }));

  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));

  if (schedLoading || archLoading) {
    return (
      <div>
        <div className={tabHeaderRowCss}>
          <h2 className={tabTitleCss}>일정 관리</h2>
        </div>
        <TabSkeleton variant="list" count={6} />
      </div>
    );
  }

  return (
    <div>
      <div className={tabHeaderRowCss}>
        <h2 className={tabTitleCss}>일정 관리</h2>
        {!mode && (
          <motion.button
            onClick={() => setMode("create")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={newBtnCss}
          >
            <Plus size={16} /> 새 일정
          </motion.button>
        )}
      </div>

      {mode === "create" && (
        <div style={{ marginBottom: "24px" }}>
          <p className={subSectionLabelCss}>새 일정 등록</p>
          <ScheduleForm
            archiveOptions={archiveOptions}
            onAlert={(msg) => openAlert({ title: msg, description: "", type: "error" })}
            onSave={(d) => {
              if (addMutation.isPending) return;
              addMutation.mutate(d, { onSuccess: () => setMode(null) });
            }}
            onCancel={() => setMode(null)}
            saving={addMutation.isPending}
          />
        </div>
      )}
      {mode && mode !== "create" && (
        <div style={{ marginBottom: "24px" }}>
          <p className={subSectionLabelCss}>일정 편집</p>
          <ScheduleForm
            initial={toForm(mode as ScheduleEvent)}
            archiveOptions={archiveOptions}
            onAlert={(msg) => openAlert({ title: msg, description: "", type: "error" })}
            onSave={(d) => {
              if (updateMutation.isPending) return;
              updateMutation.mutate(
                { id: (mode as ScheduleEvent).id, data: d },
                { onSuccess: () => setMode(null) },
              );
            }}
            onCancel={() => setMode(null)}
            saving={updateMutation.isPending}
          />
        </div>
      )}

      <div className={listCss}>
        {sorted.map((item) => {
          const archive = item.archiveId != null
            ? archives.find((a) => String(a.id) === String(item.archiveId))
            : null;
          return (
            <div key={item.id} className={itemCardCss}>
              <div className={thumbWrapCss}>
                <CalendarDays size={28} color={TYPE_COLOR[item.type]} />
              </div>
              <div className={itemBodyCss}>
                <span className={itemCatCss} style={{ color: TYPE_COLOR[item.type] }}>
                  <span className={dotCss} style={{
                    backgroundColor: TYPE_COLOR[item.type],
                    display: "inline-block",
                    marginRight: "6px",
                    verticalAlign: "middle",
                  }} />
                  {item.type}
                </span>
                <p className={itemTitleCss}>{item.title}</p>
                <p className={itemMetaCss}>
                  {formatDate(item.date)}
                  {item.endDate ? ` → ${formatDate(item.endDate)}` : ""}
                  {archive ? ` · 🔗 ${archive.title}` : ""}
                </p>
              </div>
              <div className={itemActionsCss}>
                <motion.button
                  onClick={() => setMode(item)}
                  whileTap={{ scale: 0.93 }}
                  className={editBtnCss}
                >
                  <Pencil size={14} />
                </motion.button>
                <LoadingButton
                  onClick={() =>
                    openConfirm({
                      title: "일정을 삭제하시겠습니까?",
                      description: "삭제한 일정은 복구할 수 없습니다.",
                      onConfirm: () => {
                        if (deleteMutation.isPending) return;
                        deleteMutation.mutate(item.id);
                      },
                    })
                  }
                  className={deleteBtnCss}
                  loading={deleteMutation.isPending && deleteMutation.variables === item.id}
                  spinnerSize={13}
                >
                  <Trash2 size={14} />
                </LoadingButton>
              </div>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <div className={emptyStateCss}>
            <div className={emptyIconCss}><CalendarDays size={36} /></div>
            <p className={emptyTextCss}>등록된 일정이 없습니다.</p>
          </div>
        )}
      </div>

      <ConfirmModal {...confirmProps} />
      <AlertModal {...alertProps} />
    </div>
  );
}
