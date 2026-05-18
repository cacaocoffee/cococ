import { useRef, useState } from 'react';
import { ImagePlus, X, Loader } from 'lucide-react';
import { uploadService } from '@/lib/upload';
import { css } from '@/lib/css';
import { colors } from '@/lib/tokens';

interface GalleryUploadProps {
  label: string;
  value?: string[];
  onChange: (urls: string[]) => void;
}

const wrapCss = css({ display: 'flex', flexDirection: 'column', gap: '8px' });

const labelCss = css({
  fontSize: '11px',
  fontWeight: '700',
  color: colors.textMuted,
  display: 'block',
});

const gridCss = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '8px',
});

const thumbWrapCss = css({
  position: 'relative',
  aspectRatio: '1',
  borderRadius: '0.5rem',
  overflow: 'hidden',
  backgroundColor: colors.bgSection,
});

const thumbImgCss = css({ width: '100%', height: '100%', objectFit: 'cover' });

const removeBtnCss = css({
  position: 'absolute',
  top: '4px',
  right: '4px',
  width: '22px',
  height: '22px',
  borderRadius: '9999px',
  backgroundColor: 'rgba(33,27,18,0.78)',
  color: colors.textPrimary,
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  _hover: { backgroundColor: colors.dangerBg, color: colors.danger },
});

const addBtnCss = css({
  aspectRatio: '1',
  borderRadius: '0.5rem',
  backgroundColor: colors.bgSection,
  border: `1px dashed ${colors.borderInput}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  cursor: 'pointer',
  color: colors.textDimmer,
  fontSize: '10px',
  fontWeight: '700',
  transition: 'color 0.2s, border-color 0.2s',
  _hover: { color: colors.brand, borderColor: colors.brand },
});

const loadingThumbCss = css({
  aspectRatio: '1',
  borderRadius: '0.5rem',
  backgroundColor: colors.bgSection,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export default function GalleryUpload({ label, value = [], onChange }: GalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    setLoading(true);
    try {
      const urls = await Promise.all(Array.from(files).map((f) => uploadService.upload(f)));
      onChange([...value, ...urls]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '업로드 실패';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className={wrapCss}>
      <label className={labelCss}>{label}</label>

      <div className={gridCss}>
        {value.map((url, i) => (
          <div key={i} className={thumbWrapCss}>
            <img src={url} alt="" className={thumbImgCss} />
            <button className={removeBtnCss} onClick={() => remove(i)}><X size={11} /></button>
          </div>
        ))}

        {loading && (
          <div className={loadingThumbCss}>
            <Loader size={18} color={colors.brand} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}

        <div
          className={addBtnCss}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        >
          <ImagePlus size={18} />
          추가
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => {
          // handleFiles 동기 부분이 FileList를 Array.from으로 캡쳐한 뒤에 value를 비워야 한다.
          // (input.value = '' 가 FileList를 같이 비우는 브라우저 특성)
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {error && (
        <span style={{ fontSize: '11px', color: colors.danger, fontWeight: 700 }}>{error}</span>
      )}
    </div>
  );
}
