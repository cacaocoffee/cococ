import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, BookOpen, Type, Image, X, ChevronUp, ChevronDown, GalleryHorizontal, FileText } from "lucide-react";
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

// ─── 타입 탭 스타일 ──────────────────────────────────────────
const typeTabRowCss = css({
  display: "flex",
  gap: "8px",
  marginBottom: "20px",
});
const typeTabCss = (active) => css({
  flex: "1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
  paddingBlock: "10px",
  borderRadius: "0.75rem",
  fontSize: "13px",
  fontWeight: "700",
  border: `1px solid ${active ? colors.brand : colors.borderInput}`,
  background: active ? `${colors.brand}18` : "none",
  color: active ? colors.brand : colors.textDimmer,
  cursor: "pointer",
  transition: "all 0.15s",
});

// ─── 슬라이드 에디터 스타일 ───────────────────────────────────
const slideRowCss = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});
const slideNumCss = css({
  fontSize: "11px",
  fontWeight: "900",
  color: colors.textDimmer,
  width: "20px",
  textAlign: "right",
  flexShrink: "0",
});

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

// ─── MagazineForm ─────────────────────────────────────────────
function MagazineForm({ initial = EMPTY_MAG, onSave, onCancel, onAlert }) {
  const [f, setF] = useState({ magazineType: "blog", slides: [], ...initial });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const setV = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const magType = f.magazineType || "blog";
  const setMagType = (t) => setF((p) => ({ ...p, magazineType: t }));

  // 블로그 블록
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

  // 카드뉴스 — 인스타그램 URL 목록
  const instagramUrls = Array.isArray(f.instagramUrls) ? f.instagramUrls : [];
  const setInstagramUrls = (next) => setF((p) => ({ ...p, instagramUrls: next }));
  const addInstagramUrl = () => setInstagramUrls([...instagramUrls, ""]);
  const removeInstagramUrl = (i) => setInstagramUrls(instagramUrls.filter((_, idx) => idx !== i));
  const moveInstagramUrl = (i, dir) => {
    const next = [...instagramUrls];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setInstagramUrls(next);
  };
  const updateInstagramUrl = (i, val) => setInstagramUrls(instagramUrls.map((s, idx) => (idx === i ? val : s)));

  // 카드뉴스 첫 번째 URL에서 썸네일 자동 추출
  const firstUrl = magType === "cardnews" ? (instagramUrls[0] || "") : "";
  useEffect(() => {
    if (!firstUrl || !firstUrl.includes("instagram.com")) return;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(firstUrl)}`);
        const json = await res.json();
        if (json.status === "success" && json.data?.image?.url) {
          setF((p) => ({ ...p, img: json.data.image.url }));
        }
      } catch {
        // 네트워크 오류 시 무시
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [firstUrl]);

  const handleSave = () => {
    if (!f.title || !f.excerpt) {
      onAlert("제목과 요약은 필수입니다.");
      return;
    }
    if (magType === "cardnews" && instagramUrls.filter(Boolean).length === 0) {
      onAlert("인스타그램 URL을 1개 이상 추가해주세요.");
      return;
    }
    onSave({
      ...f,
      magazineType: magType,
      tags: f.tags ? f.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      content: magType === "blog" ? blocks : [],
      instagramUrls: magType === "cardnews" ? instagramUrls.filter(Boolean) : [],
      date: f.date || new Date().toLocaleDateString("ko-KR"),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={formCardCss}
    >
      {/* 타입 선택 */}
      <div>
        <label className={labelCss}>매거진 타입</label>
        <div className={typeTabRowCss}>
          <button className={typeTabCss(magType === "blog")} onClick={() => setMagType("blog")}>
            <FileText size={14} /> 블로그 글
          </button>
          <button className={typeTabCss(magType === "cardnews")} onClick={() => setMagType("cardnews")}>
            <GalleryHorizontal size={14} /> 카드 뉴스
          </button>
        </div>
      </div>

      <div className={formGrid2Css}>
        <div style={{ gridColumn: "span 2" }}>
          <label className={labelCss}>제목 *</label>
          <input value={f.title} onChange={set("title")} className={inputCss} />
        </div>
        <div>
          <label className={labelCss}>저자</label>
          <input value={f.author} onChange={set("author")} className={inputCss} />
        </div>
        <div>
          <label className={labelCss}>날짜</label>
          <input value={f.date} onChange={set("date")} className={inputCss} placeholder="2024.05.01" />
        </div>
        <div>
          <label className={labelCss}>읽기 시간</label>
          <input value={f.readTime} onChange={set("readTime")} className={inputCss} placeholder="5분" />
        </div>
        <div>
          <label className={labelCss}>태그 (쉼표)</label>
          <input value={f.tags} onChange={set("tags")} className={inputCss} />
        </div>
      </div>
      <ImageUpload label="대표 이미지" value={f.img} onChange={setV("img")} />
      <div>
        <label className={labelCss}>요약 *</label>
        <textarea rows={3} value={f.excerpt} onChange={set("excerpt")} className={inputCss} style={{ resize: "none" }} />
      </div>

      {/* 블로그 블록 에디터 */}
      {magType === "blog" && (
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
                  <button className={css({ ...blockIconBtnCss, _hover: { color: "#f87171", backgroundColor: "rgba(239,68,68,0.1)" } })} onClick={() => removeBlock(i)}><X size={13} /></button>
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
      )}

      {/* 카드뉴스 — 인스타그램 URL 에디터 */}
      {magType === "cardnews" && (
        <div>
          <label className={labelCss}>인스타그램 게시물 URL</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {instagramUrls.map((url, i) => (
              <div key={i} className={slideRowCss}>
                <span className={slideNumCss}>{i + 1}</span>
                <input
                  value={url}
                  onChange={(e) => updateInstagramUrl(i, e.target.value)}
                  placeholder="https://www.instagram.com/p/..."
                  className={inputCss}
                  style={{ flex: 1 }}
                />
                <button className={blockIconBtnCss} onClick={() => moveInstagramUrl(i, -1)} disabled={i === 0}><ChevronUp size={13} /></button>
                <button className={blockIconBtnCss} onClick={() => moveInstagramUrl(i, 1)} disabled={i === instagramUrls.length - 1}><ChevronDown size={13} /></button>
                <button className={css({ ...blockIconBtnCss, _hover: { color: "#f87171", backgroundColor: "rgba(239,68,68,0.1)" } })} onClick={() => removeInstagramUrl(i)}><X size={13} /></button>
              </div>
            ))}
            <button className={addBlockBtnCss} onClick={addInstagramUrl} style={{ width: "100%" }}>
              <GalleryHorizontal size={13} /> URL 추가
            </button>
          </div>
        </div>
      )}

      <div className={formBtnRowCss}>
        <button onClick={onCancel} className={cancelBtnCss}>취소</button>
        <motion.button onClick={handleSave} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className={saveBtnCss}>
          저장
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── MagazineTab ──────────────────────────────────────────────
const toForm = (item) => ({
  magazineType: "blog",
  instagramUrls: [],
  ...item,
  tags: Array.isArray(item.tags) ? item.tags.join(", ") : (item.tags || ""),
  // 구버전 {heading,body} 배열은 text 블록으로 마이그레이션
  content: (item.content || []).map((b) =>
    b.type ? b : { type: "text", heading: b.heading || "", body: b.body || "" }
  ),
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
                onClick={() => setMode(item)}
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
