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
import LoadingButton from "@/components/ui/LoadingButton";
import TabSkeleton from "../components/TabSkeleton";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";
import type { ArchiveItem } from "@/domain/archive/archive-dto";
import { ARCHIVE_CATS, EMPTY_ARCHIVE } from "../constants";
import type { EmptyArchive } from "../constants";
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

// ─── Block types ──────────────────────────────────────────────
interface TextBlock {
  type: "text";
  heading: string;
  body: string;
}

interface ImageBlock {
  type: "image";
  url: string;
  caption: string;
}

type ContentBlock = TextBlock | ImageBlock;

interface RecipeForm {
  name: string;
  ingredients: string;
  img: string;
}

// Form state for ArchiveForm (tags as string, participants as string)
type ArchiveFormState = EmptyArchive & {
  content: ContentBlock[];
  recipes: RecipeForm[];
};

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
interface ArchiveFormProps {
  initial?: ArchiveFormState;
  onSave: (data: Omit<ArchiveItem, "id" | "createdAt">) => void;
  onCancel: () => void;
  onAlert: (msg: string) => void;
  saving?: boolean;
}

function ArchiveForm({ initial = EMPTY_ARCHIVE as ArchiveFormState, onSave, onCancel, onAlert, saving = false }: ArchiveFormProps) {
  const [f, setF] = useState<ArchiveFormState>({ content: [], recipes: [], ...initial });
  const set = (k: keyof ArchiveFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));
  const setV = (k: keyof ArchiveFormState) => (v: unknown) => setF((p) => ({ ...p, [k]: v }));

  // 본문 블록
  const blocks: ContentBlock[] = Array.isArray(f.content) ? f.content as ContentBlock[] : [];
  const setBlocks = (next: ContentBlock[]) => setF((p) => ({ ...p, content: next }));
  const addBlock = (type: "text" | "image") =>
    setBlocks([...blocks, type === "text" ? { type: "text", heading: "", body: "" } : { type: "image", url: "", caption: "" }]);
  const removeBlock = (i: number) => setBlocks(blocks.filter((_, idx) => idx !== i));
  const moveBlock = (i: number, dir: number) => {
    const next = [...blocks];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setBlocks(next);
  };
  const updateBlock = (i: number, patch: Partial<ContentBlock>) =>
    setBlocks(blocks.map((b, idx) => (idx === i ? { ...b, ...patch } as ContentBlock : b)));

  // 레시피 카드
  const recipes: RecipeForm[] = Array.isArray(f.recipes) ? f.recipes : [];
  const setRecipes = (next: RecipeForm[]) => setF((p) => ({ ...p, recipes: next }));
  const addRecipe = () => setRecipes([...recipes, { name: "", ingredients: "", img: "" }]);
  const removeRecipe = (i: number) => setRecipes(recipes.filter((_, idx) => idx !== i));
  const updateRecipe = (i: number, patch: Partial<RecipeForm>) =>
    setRecipes(recipes.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const handleSave = () => {
    if (saving) return;
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
    } as Omit<ArchiveItem, "id" | "createdAt">);
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRecipe(i, { name: e.target.value })}
                  placeholder="칵테일 이름 (예: Negroni)"
                  className={inputCss}
                />
                <textarea
                  rows={3}
                  value={r.ingredients}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateRecipe(i, { ingredients: e.target.value })}
                  placeholder={"재료를 입력하세요\n예: Gin 30ml · Campari 30ml · Sweet Vermouth 30ml"}
                  className={inputCss}
                  style={{ resize: "none" }}
                />
                <ImageUpload
                  label="술 사진"
                  value={r.img}
                  onChange={(v: string) => updateRecipe(i, { img: v })}
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
                      value={(block as TextBlock).heading}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBlock(i, { heading: e.target.value })}
                      placeholder="소제목 (선택)"
                      className={inputCss}
                    />
                    <textarea
                      rows={4}
                      value={(block as TextBlock).body}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateBlock(i, { body: e.target.value })}
                      placeholder={"본문 내용...\n\n**굵게** *기울임* [링크](url)\n- 목록 항목\n> 인용구"}
                      className={inputCss}
                      style={{ resize: "vertical", fontFamily: "monospace", fontSize: "12px" }}
                    />
                  </>
                ) : (
                  <>
                    <ImageUpload value={(block as ImageBlock).url} onChange={(v: string) => updateBlock(i, { url: v })} />
                    <input
                      value={(block as ImageBlock).caption}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBlock(i, { caption: e.target.value })}
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

// ─── ArchiveTab ───────────────────────────────────────────────
const toForm = (item: ArchiveItem): ArchiveFormState => ({
  title: item.title,
  category: item.category,
  date: item.date,
  base: item.base,
  location: item.location,
  participants: String(item.participants),
  description: item.description,
  img: item.img,
  tags: (item.tags || []).join(", "),
  gallery: item.gallery || [],
  recipes: Array.isArray(item.recipes) ? item.recipes.map((r) => ({ name: r.name, ingredients: r.ingredients, img: r.img ?? "" })) : [],
  content: (item.content || []).map((b) => {
    const block = b as Record<string, unknown>;
    return block.type ? block as ContentBlock : { type: "text", heading: (block.heading as string) || "", body: (block.body as string) || "" };
  }),
  year: item.year,
});

export default function ArchiveTab() {
  const { data: items = [], isLoading } = useArchiveList();
  const addMutation = useAddArchive();
  const updateMutation = useUpdateArchive();
  const deleteMutation = useDeleteArchive();
  const [mode, setMode] = useState<"create" | ArchiveItem | null>(null);
  const [search, setSearch] = useState<string>("");
  const { confirmProps, openConfirm } = useConfirm();
  const { alertProps, openAlert } = useAlert();

  const filtered = items.filter((i) => !search || i.title.includes(search));

  if (isLoading) {
    return (
      <div>
        <div className={tabHeaderRowCss}>
          <h2 className={tabTitleCss}>아카이브 관리</h2>
        </div>
        <TabSkeleton variant="cards" count={4} />
      </div>
    );
  }

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
          <p className={subSectionLabelCss}>항목 편집</p>
          <ArchiveForm
            initial={toForm(mode as ArchiveItem)}
            onAlert={(msg) => openAlert({ title: msg, type: "error" })}
            onSave={(d) => {
              if (updateMutation.isPending) return;
              updateMutation.mutate(
                { id: (mode as ArchiveItem).id, data: d },
                { onSuccess: () => setMode(null) },
              );
            }}
            onCancel={() => setMode(null)}
            saving={updateMutation.isPending}
          />
        </div>
      )}

      <div className={searchBarWrapCss}>
        <input
          type="text"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
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
              <LoadingButton
                onClick={() =>
                  openConfirm({
                    title: "아카이브를 삭제하시겠습니까?",
                    description: "삭제한 항목은 복구할 수 없습니다.",
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
