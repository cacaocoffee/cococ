import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import {
  useMagazineList,
  useAddMagazine,
  useUpdateMagazine,
  useDeleteMagazine,
} from "@/hooks/useMagazine";
import {
  ConfirmModal,
  AlertModal,
  useConfirm,
  useAlert,
} from "@/components/ui/Modal";
import ImageUpload from "@/components/ui/ImageUpload";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";
import { EMPTY_MAG } from "../constants";
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
  itemThumbWrapCss,
  itemThumbCss,
  itemBodyCss,
  itemTitleCss,
  itemMetaCss,
  itemActionsCss,
  editBtnCss,
  deleteBtnCss,
  emptyStateCss,
  emptyIconCss,
  emptyTextCss,
} from "../styles";

// ─── MagazineForm ─────────────────────────────────────────────
function MagazineForm({ initial = EMPTY_MAG, onSave, onCancel, onAlert }) {
  const [f, setF] = useState(initial);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const setV = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!f.title || !f.excerpt) {
      onAlert("제목과 요약은 필수입니다.");
      return;
    }
    onSave({
      ...f,
      tags: f.tags
        ? f.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      content: f.content
        ? f.content
            .split("\n\n")
            .filter(Boolean)
            .map((block) => {
              const lines = block.split("\n");
              return {
                heading: lines[0] || "",
                body: lines.slice(1).join("\n").trim(),
              };
            })
        : [],
      date: f.date || new Date().toLocaleDateString("ko-KR"),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={formCardCss}
    >
      <div className={formGrid2Css}>
        <div style={{ gridColumn: "span 2" }}>
          <label className={labelCss}>제목 *</label>
          <input value={f.title} onChange={set("title")} className={inputCss} />
        </div>
        <div>
          <label className={labelCss}>저자</label>
          <input
            value={f.author}
            onChange={set("author")}
            className={inputCss}
          />
        </div>
        <div>
          <label className={labelCss}>날짜</label>
          <input
            value={f.date}
            onChange={set("date")}
            className={inputCss}
            placeholder="2024.05.01"
          />
        </div>
        <div>
          <label className={labelCss}>읽기 시간</label>
          <input
            value={f.readTime}
            onChange={set("readTime")}
            className={inputCss}
            placeholder="5분"
          />
        </div>
        <div>
          <label className={labelCss}>태그 (쉼표)</label>
          <input value={f.tags} onChange={set("tags")} className={inputCss} />
        </div>
      </div>
      <ImageUpload label="대표 이미지" value={f.img} onChange={setV("img")} />
      <div>
        <label className={labelCss}>요약 *</label>
        <textarea
          rows={3}
          value={f.excerpt}
          onChange={set("excerpt")}
          className={inputCss}
          style={{ resize: "none" }}
        />
      </div>
      <div>
        <label className={labelCss}>
          본문 (섹션 사이 빈 줄, 첫 줄이 소제목)
        </label>
        <textarea
          rows={12}
          value={f.content}
          onChange={set("content")}
          className={inputCss}
          style={{ resize: "none", fontFamily: "monospace", fontSize: "12px" }}
          placeholder={"소제목\n본문 내용...\n\n다음 소제목\n본문 내용..."}
        />
      </div>
      <div className={formBtnRowCss}>
        <button onClick={onCancel} className={cancelBtnCss}>
          취소
        </button>
        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={saveBtnCss}
        >
          저장
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── MagazineTab ──────────────────────────────────────────────
const toForm = (item) => ({
  ...item,
  tags: (item.tags || []).join(", "),
  content: (item.content || [])
    .map((s) => `${s.heading}\n${s.body}`)
    .join("\n\n"),
});

export default function MagazineTab() {
  const { data: items = [] } = useMagazineList();
  const addMutation = useAddMagazine();
  const updateMutation = useUpdateMagazine();
  const deleteMutation = useDeleteMagazine();
  const [mode, setMode] = useState(null);
  const { confirmProps, openConfirm } = useConfirm();
  const { alertProps, openAlert } = useAlert();

  return (
    <div>
      <div className={tabHeaderRowCss}>
        <h2 className={tabTitleCss}>매거진 관리</h2>
        {!mode && (
          <motion.button
            onClick={() => setMode("create")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={newBtnCss}
          >
            <Plus size={16} /> 새 아티클
          </motion.button>
        )}
      </div>

      {mode === "create" && (
        <div style={{ marginBottom: "24px" }}>
          <p className={subSectionLabelCss}>새 아티클 작성</p>
          <MagazineForm
            onAlert={(msg) => openAlert({ title: msg, type: "error" })}
            onSave={(d) =>
              addMutation.mutate(d, { onSuccess: () => setMode(null) })
            }
            onCancel={() => setMode(null)}
          />
        </div>
      )}
      {mode && mode !== "create" && (
        <div style={{ marginBottom: "24px" }}>
          <p className={subSectionLabelCss}>아티클 편집</p>
          <MagazineForm
            initial={toForm(mode)}
            onAlert={(msg) => openAlert({ title: msg, type: "error" })}
            onSave={(d) =>
              updateMutation.mutate(
                { id: mode.id, data: d },
                { onSuccess: () => setMode(null) },
              )
            }
            onCancel={() => setMode(null)}
          />
        </div>
      )}

      <div className={listCss}>
        {items.map((item) => (
          <div key={item.id} className={itemCardCss}>
            <div className={itemThumbWrapCss}>
              {item.img && (
                <img src={item.img} alt="" className={itemThumbCss} />
              )}
            </div>
            <div className={itemBodyCss}>
              <p className={itemTitleCss}>{item.title}</p>
              <p className={itemMetaCss}>
                {item.author} · {item.date} · {item.readTime}
              </p>
            </div>
            <div className={itemActionsCss}>
              <motion.button
                onClick={() => setMode(toForm(item))}
                whileTap={{ scale: 0.93 }}
                className={editBtnCss}
              >
                <Pencil size={14} />
              </motion.button>
              <motion.button
                onClick={() =>
                  openConfirm({
                    title: "아티클을 삭제하시겠습니까?",
                    description: "삭제한 아티클은 복구할 수 없습니다.",
                    onConfirm: () => deleteMutation.mutate(item.id),
                  })
                }
                whileTap={{ scale: 0.93 }}
                className={deleteBtnCss}
              >
                <Trash2 size={14} />
              </motion.button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className={emptyStateCss}>
            <div className={emptyIconCss}>
              <BookOpen size={36} />
            </div>
            <p className={emptyTextCss}>아티클이 없습니다.</p>
          </div>
        )}
      </div>

      <ConfirmModal {...confirmProps} />
      <AlertModal {...alertProps} />
    </div>
  );
}
