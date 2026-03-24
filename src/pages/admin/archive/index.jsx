import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Archive, Type, Image, X, ChevronUp, ChevronDown } from "lucide-react";
import { useArchiveList } from "@/domain/archive/archive-query-options";
import {
  useAddArchive,
  useUpdateArchive,
  useDeleteArchive,
} from "@/domain/archive/archive-mutation-options";
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

// ─── 블록 에디터 스타일 ────────────────────────────────────────
const blockWrapCss = css({
  border: `1px solid ${colors.borderInput}`,
  borderRadius: "0.75rem",
  overflow: "hidden",
});
const blockHeaderCss = css({
  display: "flex", alignItems: "center", gap: "8px",
  backgroundColor: "rgba(0,0,0,0.25)",
  paddingInline: "12px", paddingBlock: "8px",
});
const blockTypeLabelCss = css({
  fontSize: "11px", fontWeight: "900", color: colors.textDimmer,
  textTransform: "uppercase", letterSpacing: "0.05em", flex: "1",
  display: "flex", alignItems: "center", gap: "5px",
});
const blockBodyCss = css({ padding: "12px", display: "flex", flexDirection: "column", gap: "8px" });
const blockIconBtnCss = css({
  width: "24px", height: "24px", borderRadius: "0.375rem",
  border: "none", cursor: "pointer", background: "none",
  color: colors.textDimmer, display: "flex", alignItems: "center", justifyContent: "center",
  _hover: { color: colors.textPrimary, backgroundColor: "rgba(255,255,255,0.06)" },
});
const addBlockRowCss = css({ display: "flex", gap: "8px" });
const addBlockBtnCss = css({
  flex: "1", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
  paddingBlock: "10px", borderRadius: "0.75rem", fontSize: "12px", fontWeight: "700",
  border: `1px dashed ${colors.borderInput}`, cursor: "pointer", background: "none",
  color: colors.textDimmer, transition: "all 0.15s",
  _hover: { color: colors.textPrimary, borderColor: colors.borderStrong },
});

// ─── ArchiveForm ──────────────────────────────────────────────
function ArchiveForm({ initial = EMPTY_ARCHIVE, onSave, onCancel, onAlert }) {
  const [f, setF] = useState({ content: [], recipes: [], ...initial });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const setV = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  // 본문 블록
  const blocks = Array.isArray(f.content) ? f.content : [];
  const setBlocks = (next) => setF((p) => ({ ...p, content: next }));
  const addBlock = (type) =>
    setBlocks([...blocks, type === "text" ? { type: "text", heading: "", body: "" } : { type: "image", url: "", caption: "" }]);
  const removeBlock = (i) => setBlocks(blocks.filter((_, idx) => idx !== i));
  const moveBlock = (i, dir) => {
    const next = [...blocks];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setBlocks(next);
  };
  const updateBlock = (i, patch) =>
    setBlocks(blocks.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));

  // 레시피 카드
  const recipes = Array.isArray(f.recipes) ? f.recipes : [];
  const setRecipes = (next) => setF((p) => ({ ...p, recipes: next }));
  const addRecipe = () => setRecipes([...recipes, { name: "", ingredients: "", img: "" }]);
  const removeRecipe = (i) => setRecipes(recipes.filter((_, idx) => idx !== i));
  const updateRecipe = (i, patch) =>
    setRecipes(recipes.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const handleSave = () => {
    if (!f.title || !f.date || !f.description) {
      onAlert("제목, 날짜, 설명은 필수입니다.");
      return;
    }
    onSave({
      ...f,
      participants: Number(f.participants) || 0,
      tags: f.tags ? f.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      gallery: Array.isArray(f.gallery) ? f.gallery : [],
      content: blocks,
      recipes: recipes.filter((r) => r.name.trim()),
      year: f.date?.slice(0, 4) || new Date().getFullYear().toString(),
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={formCardCss}>
      <div className={formGrid2Css}>
        <div>
          <label className={labelCss}>제목 *</label>
          <input value={f.title} onChange={set("title")} className={inputCss} placeholder="클래식 칵테일 마스터리" />
        </div>
        <div>
          <label className={labelCss}>카테고리 *</label>
          <select value={f.category} onChange={set("category")} className={inputCss}>
            {ARCHIVE_CATS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCss}>날짜 *</label>
          <input value={f.date} onChange={set("date")} className={inputCss} placeholder="2024.03.15" />
        </div>
        <div>
          <label className={labelCss}>베이스 주류</label>
          <input value={f.base} onChange={set("base")} className={inputCss} placeholder="Gin" />
        </div>
        <div>
          <label className={labelCss}>장소</label>
          <input value={f.location} onChange={set("location")} className={inputCss} placeholder="신촌 Bar Lune" />
        </div>
        <div>
          <label className={labelCss}>참여 인원</label>
          <input type="number" value={f.participants} onChange={set("participants")} className={inputCss} placeholder="18" />
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <label className={labelCss}>태그 (쉼표로 구분)</label>
          <input value={f.tags} onChange={set("tags")} className={inputCss} placeholder="Gin, Classic" />
        </div>
      </div>

      <ImageUpload label="대표 이미지" value={f.img} onChange={setV("img")} required />
      <div>
        <label className={labelCss}>설명 *</label>
        <textarea rows={3} value={f.description} onChange={set("description")} className={inputCss} style={{ resize: "none" }} />
      </div>
      <GalleryUpload label="갤러리" value={f.gallery} onChange={setV("gallery")} />

      {/* 레시피 카드 */}
      <div>
        <label className={labelCss}>레시피 카드</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {recipes.map((r, i) => (
            <div
              key={i}
              style={{
                border: `1px solid ${colors.borderInput}`,
                borderRadius: "0.75rem",
                overflow: "hidden",
              }}
            >
              <div className={blockHeaderCss}>
                <span className={blockTypeLabelCss}>레시피 {i + 1}</span>
                <button
                  className={css({ ...blockIconBtnCss, _hover: { color: "#f87171", backgroundColor: "rgba(239,68,68,0.1)" } })}
                  onClick={() => removeRecipe(i)}
                >
                  <X size={13} />
                </button>
              </div>
              <div className={blockBodyCss}>
                <input
                  value={r.name}
                  onChange={(e) => updateRecipe(i, { name: e.target.value })}
                  placeholder="칵테일 이름 (예: Negroni)"
                  className={inputCss}
                />
                <textarea
                  rows={3}
                  value={r.ingredients}
                  onChange={(e) => updateRecipe(i, { ingredients: e.target.value })}
                  placeholder={"재료를 입력하세요\n예: Gin 30ml · Campari 30ml · Sweet Vermouth 30ml"}
                  className={inputCss}
                  style={{ resize: "none" }}
                />
                <ImageUpload
                  label="술 사진"
                  value={r.img}
                  onChange={(v) => updateRecipe(i, { img: v })}
                />
              </div>
            </div>
          ))}
          <button
            onClick={addRecipe}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              paddingBlock: "10px", borderRadius: "0.75rem", fontSize: "12px", fontWeight: "700",
              border: `1px dashed ${colors.borderInput}`, cursor: "pointer", background: "none",
              color: colors.textDimmer, transition: "all 0.15s",
            }}
          >
            <Plus size={13} /> 레시피 추가
          </button>
        </div>
      </div>

      {/* 본문 블록 에디터 */}
      <div>
        <label className={labelCss}>본문 블록</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {blocks.map((block, i) => (
            <div key={i} className={blockWrapCss}>
              <div className={blockHeaderCss}>
                <span className={blockTypeLabelCss}>
                  {block.type === "image" ? <><Image size={11} /> 이미지</> : <><Type size={11} /> 텍스트</>}
                </span>
                <button className={blockIconBtnCss} onClick={() => moveBlock(i, -1)} disabled={i === 0}><ChevronUp size={13} /></button>
                <button className={blockIconBtnCss} onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1}><ChevronDown size={13} /></button>
                <button
                  className={css({ ...blockIconBtnCss, _hover: { color: "#f87171", backgroundColor: "rgba(239,68,68,0.1)" } })}
                  onClick={() => removeBlock(i)}
                >
                  <X size={13} />
                </button>
              </div>
              <div className={blockBodyCss}>
                {block.type === "text" ? (
                  <>
                    <input
                      value={block.heading}
                      onChange={(e) => updateBlock(i, { heading: e.target.value })}
                      placeholder="소제목 (선택)"
                      className={inputCss}
                    />
                    <textarea
                      rows={4}
                      value={block.body}
                      onChange={(e) => updateBlock(i, { body: e.target.value })}
                      placeholder={"본문 내용...\n\n**굵게** *기울임* [링크](url)\n- 목록 항목\n> 인용구"}
                      className={inputCss}
                      style={{ resize: "vertical", fontFamily: "monospace", fontSize: "12px" }}
                    />
                  </>
                ) : (
                  <>
                    <ImageUpload value={block.url} onChange={(v) => updateBlock(i, { url: v })} />
                    <input
                      value={block.caption}
                      onChange={(e) => updateBlock(i, { caption: e.target.value })}
                      placeholder="캡션 (선택)"
                      className={inputCss}
                    />
                  </>
                )}
              </div>
            </div>
          ))}
          <div className={addBlockRowCss}>
            <button className={addBlockBtnCss} onClick={() => addBlock("text")}>
              <Type size={13} /> 텍스트 블록 추가
            </button>
            <button className={addBlockBtnCss} onClick={() => addBlock("image")}>
              <Image size={13} /> 이미지 블록 추가
            </button>
          </div>
        </div>
      </div>

      <div className={formBtnRowCss}>
        <button onClick={onCancel} className={cancelBtnCss}>취소</button>
        <motion.button onClick={handleSave} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className={saveBtnCss}>
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
  recipes: Array.isArray(item.recipes) ? item.recipes : [],
  content: (item.content || []).map((b) =>
    b.type ? b : { type: "text", heading: b.heading || "", body: b.body || "" }
  ),
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
            onSave={(d) => addMutation.mutate(d, { onSuccess: () => setMode(null) })}
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
              {item.img && <img src={item.img} alt={item.title} className={itemThumbCss} />}
            </div>
            <div className={itemBodyCss}>
              <span className={itemCatCss}>{item.category}</span>
              <p className={itemTitleCss}>{item.title}</p>
              <p className={itemMetaCss}>{item.date} · {item.base}</p>
            </div>
            <div className={itemActionsCss}>
              <motion.button onClick={() => setMode(item)} whileTap={{ scale: 0.93 }} className={editBtnCss}>
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
            <div className={emptyIconCss}><Archive size={36} /></div>
            <p className={emptyTextCss}>항목이 없습니다.</p>
          </div>
        )}
      </div>

      <ConfirmModal {...confirmProps} />
      <AlertModal {...alertProps} />
    </div>
  );
}
