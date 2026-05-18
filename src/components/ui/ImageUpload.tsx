import { useRef, useState } from 'react';
import { ImagePlus, X, Loader } from 'lucide-react';
import { uploadService } from '@/lib/upload';
import { css, cx } from '@/lib/css';
import { colors } from '@/lib/tokens';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}

const wrapCss = css({ display: 'flex', flexDirection: 'column', gap: '8px' });

const labelCss = css({
  fontSize: '11px',
  fontWeight: '700',
  color: colors.textMuted,
  display: 'block',
});

const previewWrapCss = css({
  position: 'relative',
  width: '100%',
  height: '160px',
  borderRadius: '0.75rem',
  overflow: 'hidden',
  backgroundColor: colors.bgSection,
  border: `1px solid ${colors.borderInput}`,
});

const previewImgCss = css({ width: '100%', height: '100%', objectFit: 'cover' });

const previewEmptyCss = css({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  color: colors.textDimmer,
  cursor: 'pointer',
  transition: 'color 0.2s',
  _hover: { color: colors.textMuted },
});

const uploadOverlayCss = css({
  position: 'absolute',
  inset: '0',
  backgroundColor: 'rgba(33,27,18,0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const clearBtnCss = css({
  position: 'absolute',
  top: '8px',
  right: '8px',
  width: '28px',
  height: '28px',
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

const uploadBtnCss = css({
  position: 'absolute',
  bottom: '8px',
  right: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: 'rgba(33,27,18,0.78)',
  color: colors.textSecondary,
  border: `1px solid ${colors.borderStrong}`,
  borderRadius: '0.5rem',
  padding: '6px 12px',
  fontSize: '12px',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'color 0.2s',
  _hover: { color: colors.brand },
});

const urlInputCss = css({
  backgroundColor: colors.bgSection,
  border: `1px solid ${colors.borderInput}`,
  borderRadius: '0.75rem',
  paddingInline: '16px',
  paddingBlock: '10px',
  color: colors.textPrimary,
  fontSize: '12px',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.2s',
  _focus: { borderColor: colors.brand },
});

const hintCss = css({ fontSize: '11px', color: colors.textDimmer });

export default function ImageUpload({ label, value, onChange, required = false }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setLoading(true);
    try {
      const url = await uploadService.upload(file);
      onChange(url);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '업로드 실패';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={wrapCss}>
      <label className={labelCss}>{label}{required && ' *'}</label>

      <div className={previewWrapCss}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
      >
        {value ? (
          <>
            <img src={value} alt="" className={previewImgCss} />
            <button className={clearBtnCss} onClick={() => onChange('')}><X size={13} /></button>
            <button className={uploadBtnCss} onClick={() => inputRef.current?.click()}>
              <ImagePlus size={13} /> 변경
            </button>
          </>
        ) : (
          <div className={previewEmptyCss} onClick={() => inputRef.current?.click()}>
            <ImagePlus size={28} />
            <span style={{ fontSize: '12px', fontWeight: '700' }}>클릭 또는 드래그</span>
          </div>
        )}

        {loading && (
          <div className={uploadOverlayCss}>
            <Loader size={24} color={colors.brand} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          // 같은 파일을 지웠다가 다시 올리면 onChange가 안 뜨는 브라우저 동작 방지.
          e.target.value = '';
          handleFile(file);
        }}
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="또는 이미지 URL 직접 입력..."
        className={urlInputCss}
      />
      <span className={hintCss}>파일 선택 또는 URL 직접 입력</span>
      {error && (
        <span style={{ fontSize: '11px', color: colors.danger, fontWeight: 700 }}>{error}</span>
      )}
    </div>
  );
}
