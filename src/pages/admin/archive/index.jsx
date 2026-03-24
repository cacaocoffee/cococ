import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Archive, FileText, X } from "lucide-react";
import {
  useArchiveList,
  useAddArchive,
  useUpdateArchive,
  useDeleteArchive,
} from "@/hooks/useArchive";
import {
  ConfirmModal,
  AlertModal,
  useConfirm,
  useAlert,
} from "@/components/ui/Modal";
import ImageUpload from "@/components/ui/ImageUpload";
import GalleryUpload from "@/components/ui/GalleryUpload";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";
import { ARCHIVE_CATS, EMPTY_ARCHIVE } from "../constants";
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
  itemCatCss,
  itemTitleCss,
  itemMetaCss,
  itemActionsCss,
  editBtnCss,
  deleteBtnCss,
  searchBarWrapCss,
  searchBarInputCss,
  searchBarIconCss,
  emptyStateCss,
  emptyIconCss,
  emptyTextCss,
} from "../styles";

// ─── ArchiveForm ──────────────────────────────────────────────
function ArchiveForm({ initial = EMPTY_ARCHIVE, onSave, onCancel, onAlert }) {
  const [f, setF] = useState({ recipePdfs: [], ...initial });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const setV = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const pdfs = f.recipePdfs ?? [];
  const addPdf = () => setF((p) => ({ ...p, recipePdfs: [...pdfs, { title: "", url: "" }] }));
  const removePdf = (i) => setF((p) => ({ ...p, recipePdfs: pdfs.filter((_, idx) => idx !== i) }));
  const updatePdf = (i, patch) =>
    setF((p) => ({ ...p, recipePdfs: pdfs.map((pdf, idx) => (idx === i ? { ...pdf, ...patch } : pdf)) }));

  const handleSave = () => {
    if (!f.title || !f.date || !f.description) {
      onAlert("제목, 날짜, 설명은 필수입니다.");
      return;
    }
    onSave({
      ...f,
      participants: Number(f.participants) || 0,
      tags: f.tags
        ? f.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      gallery: Array.isArray(f.gallery) ? f.gallery : [],
      recipePdfs: (f.recipePdfs ?? []).filter((p) => p.url.trim()),
      recipes: f.recipes
        ? f.recipes
            .split("\n")
            .filter(Boolean)
            .map((line) => {
              const [name, ...rest] = line.split("|");
              return { name: name.trim(), ingredients: rest.join("|").trim() };
            })
        : [],
      year: f.date?.slice(0, 4) || new Date().getFullYear().toString(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={formCardCss}
    >
      <div className={formGrid2Css}>
        <div>
          <label className={labelCss}>제목 *</label>
          <input
            value={f.title}
            onChange={set("title")}
            className={inputCss}
            placeholder="클래식 칵테일 마스터리"
          />
        </div>
        <div>
          <label className={labelCss}>카테고리 *</label>
          <select
            value={f.category}
            onChange={set("category")}
            className={inputCss}
          >
            {ARCHIVE_CATS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCss}>날짜 *</label>
          <input
            value={f.date}
            onChange={set("date")}
            className={inputCss}
            placeholder="2024.03.15"
          />
        </div>
        <div>
          <label className={labelCss}>학기</label>
          <input
            value={f.semester}
            onChange={set("semester")}
            className={inputCss}
            placeholder="1학기"
          />
        </div>
        <div>
          <label className={labelCss}>베이스 주류</label>
          <input
            value={f.base}
            onChange={set("base")}
            className={inputCss}
            placeholder="Gin"
          />
        </div>
        <div>
          <label className={labelCss}>장소</label>
          <input
            value={f.location}
            onChange={set("location")}
            className={inputCss}
            placeholder="신촌 Bar Lune"
          />
        </div>
        <div>
          <label className={labelCss}>참여 인원</label>
          <input
            type="number"
            value={f.participants}
            onChange={set("participants")}
            className={inputCss}
            placeholder="18"
          />
        </div>
        <div>
          <label className={labelCss}>태그 (쉼표로 구분)</label>
          <input
            value={f.tags}
            onChange={set("tags")}
            className={inputCss}
            placeholder="Gin, Classic"
          />
        </div>
      </div>
      <ImageUpload
        label="대표 이미지"
        value={f.img}
        onChange={setV("img")}
        required
      />
      <div>
        <label className={labelCss}>설명 *</label>
        <textarea
          rows={4}
          value={f.description}
          onChange={set("description")}
          className={inputCss}
          style={{ resize: "none" }}
        />
      </div>
      <GalleryUpload
        label="갤러리"
        value={f.gallery}
        onChange={setV("gallery")}
      />
      <div>
        <label className={labelCss}>레시피 (이름 | 재료)</label>
        <textarea
          rows={3}
          value={f.recipes}
          onChange={set("recipes")}
          className={inputCss}
          style={{ resize: "none" }}
          placeholder="Negroni | Gin 30ml · Campari 30ml"
        />
      </div>

      {/* 레시피 카드 PDF */}
      <div>
        <label className={labelCss}>레시피 카드 PDF</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {pdfs.map((pdf, i) => (
            <div
              key={i}
              style={{
                display: "flex", gap: "8px", alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "0.75rem", padding: "10px 12px",
              }}
            >
              <FileText size={16} style={{ color: colors.brand, flexShrink: 0 }} />
              <input
                value={pdf.title}
                onChange={(e) => updatePdf(i, { title: e.target.value })}
                placeholder="카드 제목 (예: Blackthorn)"
                className={inputCss}
                style={{ flex: "1" }}
              />
              <input
                value={pdf.url}
                onChange={(e) => updatePdf(i, { url: e.target.value })}
                placeholder="PDF URL"
                className={inputCss}
                style={{ flex: "2" }}
              />
              <button
                onClick={() => removePdf(i)}
                style={{
                  width: "28px", height: "28px", borderRadius: "0.5rem", border: "none",
                  backgroundColor: "rgba(239,68,68,0.1)", color: "#f87171",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <X size={13} />
              </button>
            </div>
          ))}
          <button
            onClick={addPdf}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              paddingBlock: "10px", borderRadius: "0.75rem", fontSize: "12px", fontWeight: "700",
              border: `1px dashed ${colors.borderInput}`, cursor: "pointer", background: "none",
              color: colors.textDimmer, transition: "all 0.15s",
            }}
          >
            <Plus size={13} /> PDF 추가
          </button>
        </div>
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

// ─── ArchiveTab ───────────────────────────────────────────────
const toForm = (item) => ({
  ...item,
  tags: (item.tags || []).join(", "),
  gallery: item.gallery || [],
  recipes: (item.recipes || [])
    .map((r) => `${r.name} | ${r.ingredients}`)
    .join("\n"),
});

export default function ArchiveTab() {
  const { data: items = [] } = useArchiveList();
  const addMutation = useAddArchive();
  const updateMutation = useUpdateArchive();
  const deleteMutation = useDeleteArchive();
  const [mode, setMode] = useState(null);
  const [search, setSearch] = useState("");
  const { confirmProps, openConfirm } = useConfirm();
  const { alertProps, openAlert } = useAlert();

  const filtered = items.filter((i) => !search || i.title.includes(search));

  return (
    <div>
      <div className={tabHeaderRowCss}>
        <h2 className={tabTitleCss}>아카이브 관리</h2>
        {!mode && (
          <motion.button
            onClick={() => setMode("create")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={newBtnCss}
          >
            <Plus size={16} /> 새 항목
          </motion.button>
        )}
      </div>

      {mode === "create" && (
        <div style={{ marginBottom: "24px" }}>
          <p className={subSectionLabelCss}>새 아카이브 작성</p>
          <ArchiveForm
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
          <p className={subSectionLabelCss}>항목 편집</p>
          <ArchiveForm
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

      <div className={searchBarWrapCss}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="제목 검색..."
          className={searchBarInputCss}
        />
        <span className={searchBarIconCss}>
          <Search size={14} />
        </span>
      </div>

      <div className={listCss}>
        {filtered.map((item) => (
          <div key={item.id} className={itemCardCss}>
            <div className={itemThumbWrapCss}>
              {item.img && (
                <img src={item.img} alt={item.title} className={itemThumbCss} />
              )}
            </div>
            <div className={itemBodyCss}>
              <span className={itemCatCss}>{item.category}</span>
              <p className={itemTitleCss}>{item.title}</p>
              <p className={itemMetaCss}>
                {item.date} · {item.base}
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
              <motion.button
                onClick={() =>
                  openConfirm({
                    title: "아카이브를 삭제하시겠습니까?",
                    description: "삭제한 항목은 복구할 수 없습니다.",
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
        {filtered.length === 0 && (
          <div className={emptyStateCss}>
            <div className={emptyIconCss}>
              <Archive size={36} />
            </div>
            <p className={emptyTextCss}>항목이 없습니다.</p>
          </div>
        )}
      </div>

      <ConfirmModal {...confirmProps} />
      <AlertModal {...alertProps} />
    </div>
  );
}
