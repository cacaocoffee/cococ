# 프로젝트 아키텍처 & 패턴 참고 문서

> 새 프로젝트 시작 시 바로 적용 가능한 기술 스택, 패턴, 컨벤션 정리

---

## 기술 스택

| 분류 | 라이브러리 |
|---|---|
| 프레임워크 | React 19 + TypeScript 5.9 |
| 빌드 | Vite 7 |
| 라우팅 | TanStack Router (파일 기반) |
| 서버 상태 | TanStack React Query |
| 폼 | TanStack React Form |
| 스키마 검증 | Valibot |
| 스타일링 | PandaCSS |
| UI 프리미티브 | React Aria Components |
| 오버레이 | Overlay Kit |
| 에디터 | Tiptap |
| DnD | DnD Kit |
| 차트 | Recharts / D3 |
| 문서화 | Storybook v10 (react-vite) |

---

## 프로젝트 구조

```
/
├── src/
│   ├── components/     # 공통 컴포넌트
│   ├── domain/         # 기능 도메인 (service, query, dto, types)
│   ├── hooks/          # 커스텀 훅
│   ├── routes/         # TanStack Router 파일 기반 라우팅
│   ├── utils/          # fetcher, 날짜, 검증 유틸
│   └── main.tsx
├── packages/
│   ├── design-system/  # PandaCSS 프리셋, 토큰, 유틸리티
│   └── ui/             # 공유 컴포넌트 + Storybook
```

### 도메인 파일 구성

```
domain/{feature}/
├── {feature}-service.ts          # API 호출
├── {feature}-query-options.ts    # queryOptions + 훅
├── {feature}-mutation-options.ts
├── {entity}-dto.ts               # API DTO + Builder
└── types.ts
```

---

## 파일 네이밍

| 대상 | 패턴 | 예시 |
|---|---|---|
| 파일/폴더 | kebab-case | `vendor-service.ts` |
| 컴포넌트 | PascalCase | `VendorTable` |
| 타입/DTO | PascalCase + 접미사 | `VendorDTO`, `CreateVendorPayload` |
| 쿼리 키 상수 | CONSTANT_CASE | `VENDOR_QUERY_KEY` |
| 훅 | use 접두사 + camelCase | `useVendorQuery` |
| Story 파일 | `{Component}.stories.tsx` | `Button.stories.tsx` |

---

## 스타일링 패턴 (PandaCSS)

```tsx
import { css, cx } from "@/design-system/css";
import { Flex } from "@/design-system/jsx";
import { token } from "@/design-system/tokens";

// CSS 클래스는 컴포넌트 상단에 분리 정의
const containerCss = css({
    display: "flex",
    gap: "16px",
    padding: "16px",
    color: "darkgreen.0",                          // 토큰 키 직접 사용
    border: "1px solid token(colors.gray.20)",     // token() 참조
});

// 조건부 조합 — 삼항 대신 condition && css 패턴
className={cx(containerCss, isActive && activeCss, disabled && disabledCss)}

// ! 플래그로 강제 오버라이드 (disabled 등 우선순위 필요시)
const disabledCss = css({
    backgroundColor: "gray.40!",
    color: "gray.50!",
    cursor: "not-allowed",
});

// CSS 변수로 동적 값 주입 (props → style → css var)
style={{ "--btn-width": `${width}px` } as CSSProperties}
className={css({ width: "var(--btn-width, auto)" })}

// Flex 컴포넌트로 레이아웃
<Flex gap={16} direction="column" alignItems="center">

// css() 밖에서 토큰 참조
color={token("colors.darkgreen.0")}
```

**디자인 토큰 체계:**
- 컬러: `colors.{name}.{shade}` (shade: 0, 20, 40, 60, ...)
- 브레이크포인트: tablet(768px), laptop(1024px), pc(1440px)

---

## UI 컴포넌트 구현 방식

React Aria Components를 프리미티브로 래핑해 접근성 보장.

```tsx
import { css, cx } from "@/design-system/css";
import { Button as AriaButton } from "react-aria-components";
import type { ComponentProps, CSSProperties, ElementType } from "react";

type CommonButtonProps = {
    variant: "basic" | "primary" | "large";
    width?: number;
    isPending?: boolean;
};

// Generic으로 element type 유연하게 지원
type ButtonProps<T extends ElementType = "button"> =
    Omit<ComponentProps<T>, "width"> & CommonButtonProps;

export function Button<T extends ElementType = "button">({
    variant, width, disabled, isPending, className, children, ...props
}: ButtonProps<T>) {
    return (
        <AriaButton
            isPending={isPending}
            isDisabled={disabled || isPending}
            style={{ "--button-width": width ? `${width}px` : undefined } as CSSProperties}
            className={cx(
                buttonCss,
                variant === "basic" && basicVariantCss,
                variant === "primary" && primaryVariantCss,
                disabled && !isPending && disabledCss,
                isPending && pendingCss,
                className,
            )}
            {...props}
        >
            {children}
        </AriaButton>
    );
}
```

**Render props 패턴 (Select, Combobox 등 내부 상태 노출):**

```tsx
<AriaSelect>
    {({ isOpen, selectedItem }) => (
        <>
            <SelectButton isOpen={isOpen} />
            <SelectPopover>...</SelectPopover>
        </>
    )}
</AriaSelect>
```

---

## Storybook 설정 & Story 작성 패턴

### 설정 (`.storybook/main.ts`)

```ts
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: ["@storybook/addon-docs"],
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
};

export default config;
```

### 글로벌 프리뷰 (`.storybook/preview.ts`)

```ts
import type { Preview } from "@storybook/react";
import "../src/styles.css";  // PandaCSS 글로벌 스타일

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        layout: "fullscreen",  // 기본 레이아웃 fullscreen
    },
};

export default preview;
```

### Story 작성 패턴

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./index";

// 메타 — satisfies로 타입 안전하게
const meta = {
    title: "ui/Button",          // 카테고리/컴포넌트명
    component: Button,
    parameters: { layout: "centered" },   // 개별 오버라이드
    tags: ["autodocs"],          // 자동 문서화 활성화
    args: {},                    // 공통 기본 args
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 Story — named export
export const Primary: Story = {
    name: "Primary",
    args: {
        variant: "primary",
        children: "버튼",
        width: 120,
    },
};

// JSX children
export const WithIcon: Story = {
    name: "With Icon",
    args: {
        variant: "basic",
        children: (
            <>
                <DownloadIcon width={14} />
                <span>다운로드</span>
            </>
        ),
    },
};

// 상태가 필요한 controlled Story → render() 사용
export const Controlled: Story = {
    name: "Controlled",
    args: { ...Primary.args },
    render: (args) => {
        const [value, setValue] = useState("");
        return (
            <>
                <Select {...args} value={value} onChange={setValue} />
                <p>선택값: {value}</p>
            </>
        );
    },
};
```

**스크립트 (`package.json`):**

```json
{
    "scripts": {
        "storybook": "storybook dev -p 6006",
        "build-storybook": "storybook build"
    },
    "devDependencies": {
        "storybook": "^10.0.0",
        "@storybook/react-vite": "^10.0.0",
        "@storybook/addon-docs": "^10.0.0"
    }
}
```

---

## 라우트 패턴 (TanStack Router)

```tsx
import { createFileRoute, redirect } from "@tanstack/react-router";
import * as v from "valibot";

// 쿼리 파라미터 스키마 — 타입 + 검증 + 기본값 한 번에
const searchSchema = v.object({
    tab: v.fallback(v.optional(v.picklist(["all", "active", "inactive"])), "all"),
    page: v.fallback(v.optional(v.number()), 1),
    size: v.fallback(v.optional(v.number()), 10),
    keyword: v.optional(v.string()),
    startDate: v.optional(v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/))),
});
export type PageSearchSchema = v.InferOutput<typeof searchSchema>;

export const Route = createFileRoute("/some-feature/")({
    async beforeLoad({ context: { me, queryClient } }) {
        if (!hasPermission(me)) throw new ForbiddenError();
        await queryClient.ensureQueryData(featureQueryOptions(defaultParams));
    },

    validateSearch(search) {
        return v.parse(searchSchema, search);
    },

    errorComponent({ error }) {
        if (error instanceof ForbiddenError) return <NotAuthorizedPage />;
        return <ErrorPage error={error} />;
    },

    pendingComponent: () => <LoadingSpinner />,
    component: RouteComponent,
});

function RouteComponent() {
    const { tab, page } = Route.useSearch();
    const { me } = Route.useRouteContext();
}
```

---

## 서비스 레이어

```ts
// feature-service.ts — 단일 객체로 namespace
export const featureService = {
    async fetchList(params: FetchListParams): Promise<PaginatedDTO<FeatureDTO>> {
        const qs = new URLSearchParams();
        if (params.page) qs.set("page", String(params.page));
        if (params.keyword) qs.set("keyword", params.keyword);

        const res = await fetcher<FeatureApiResponse>(`/v1/feature?${qs}`);
        return Feature.fromApiDTO(res);
    },

    async create(payload: CreateFeaturePayload): Promise<void> {
        await fetcher("/v1/feature", { method: "POST", body: JSON.stringify(payload) });
    },

    async update(id: number, payload: UpdateFeaturePayload): Promise<void> {
        await fetcher(`/v1/feature/${id}`, { method: "PUT", body: JSON.stringify(payload) });
    },

    async delete(id: number): Promise<void> {
        await fetcher(`/v1/feature/${id}`, { method: "DELETE" });
    },
};
```

---

## DTO 빌더 패턴

API 타입과 도메인 타입을 분리하고, 변환 책임을 Builder에 집중.

```ts
// feature-dto.ts

// API 원본 타입 (서버 응답 형식)
type FeatureApiDTO = {
    id: number;
    feature_name: string;
    created_at: string;
    is_active: boolean;
};

// 도메인 타입 (UI에서 사용)
export type FeatureDTO = {
    id: number;
    name: string;
    createdAt: Date;
    isActive: boolean;
};

export class FeatureDTOBuilder {
    static fromApiDTO(api: FeatureApiDTO): FeatureDTO {
        return {
            id: api.id,
            name: api.feature_name,
            createdAt: new Date(api.created_at),
            isActive: api.is_active,
        };
    }

    // 페이지네이션 응답 변환
    static fromApiListDTO(res: PaginatedApiResponse<FeatureApiDTO>): PaginatedDTO<FeatureDTO> {
        return {
            items: res.content.map(FeatureDTOBuilder.fromApiDTO),
            totalCount: res.totalElements,
            page: res.number,
            size: res.size,
        };
    }
}
```

---

## Query / Mutation 패턴

```ts
// feature-query-options.ts
export const FEATURE_QUERY_KEY = "feature";

// queryOptions로 key + fn 묶음 → prefetch / ensureQueryData / useQuery 공용
export const featureQueryOptions = (params: FetchListParams) =>
    queryOptions({
        queryKey: [FEATURE_QUERY_KEY, params],
        queryFn: () => featureService.fetchList(params),
    });

export function useFeatureQuery(params: FetchListParams) {
    return useQuery(featureQueryOptions(params));
}
```

```ts
// feature-mutation-options.ts
export function useCreateFeatureMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: featureService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [FEATURE_QUERY_KEY] });
        },
    });
}

export function useDeleteFeatureMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: featureService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [FEATURE_QUERY_KEY] });
        },
    });
}
```

---

## 폼 패턴 (TanStack Form + Valibot)

```tsx
import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import * as v from "valibot";

const schema = v.object({
    name: v.pipe(v.string(), v.minLength(1, "이름을 입력해주세요")),
    email: v.pipe(v.string(), v.email("올바른 이메일 형식이 아닙니다")),
    role: v.picklist(["admin", "viewer"]),
});

const form = useForm({
    defaultValues: { name: "", email: "", role: "viewer" as const },
    validators: { onBlur: valibotValidator(schema) },
    onSubmit: async ({ value }) => {
        await mutation.mutateAsync(value);
    },
});

// 필드 렌더링 — render props
<form.Field name="name">
    {(field) => (
        <Input
            value={field.state.value}
            onChange={(v) => field.handleChange(v)}
            onBlur={field.handleBlur}
            errorMessage={field.state.meta.errors[0]}
        />
    )}
</form.Field>
```

---

## 공통 타입 패턴

```ts
// 페이지네이션
type PaginatedDTO<T> = {
    items: T[];
    totalCount: number;
    page: number;
    size: number;
};

// API 에러 응답
type ApiErrorResponse = {
    code: string;
    name: string;
    message: string;
    errors?: { field: string; message: string }[];
};

// Discriminated Union으로 비동기 상태 표현
type AsyncState<T> =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; error: Error };

// picklist → 리터럴 타입 추론
const TABS = ["all", "active", "inactive"] as const;
type Tab = (typeof TABS)[number];  // "all" | "active" | "inactive"

// 페이로드 타입 — DTO에서 파생
type CreatePayload = Omit<FeatureDTO, "id" | "createdAt">;
type UpdatePayload = Partial<CreatePayload> & { id: number };
```

---

## 권한(RBAC) 패턴

```ts
// roles.ts
export const AppRoles = {
    FEATURE: {
        READ: "FEATURE_READ",
        WRITE: "FEATURE_WRITE",
        DELETE: "FEATURE_DELETE",
    },
} as const;

function checkRole(granted: string[], required: string): boolean {
    return granted.includes(required);
}

// 라우트 beforeLoad
beforeLoad({ context: { me } }) {
    if (!checkRole(me.grantedPermissions, AppRoles.FEATURE.READ)) {
        throw new ForbiddenError();
    }
}

// 컴포넌트 조건부 렌더링
const canWrite = checkRole(me.grantedPermissions, AppRoles.FEATURE.WRITE);
{canWrite && <Button>수정</Button>}
```

---

## fetcher 패턴

```ts
// utils/fetcher.ts
const fetcher = async <T>(url: string, options?: RequestInit): Promise<T> => {
    const res = await fetch(`${import.meta.env.VITE_API_SERVER_URL}${url}`, {
        credentials: "include",  // 세션 쿠키 자동 포함
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if (!res.ok) {
        const error: ApiErrorResponse = await res.json();
        if (res.status === 403) throw new ForbiddenError(error);
        throw new ServerError(res.status, error);
    }

    return res.json() as Promise<T>;
};
```

---

## 오버레이 / 모달 패턴 (Overlay Kit)

```tsx
import { overlay } from "overlay-kit";

// 명령형으로 모달 열기 — JSX 안에서 직접 호출
const handleDelete = () => {
    overlay.open(({ isOpen, close, unmount }) => (
        <Modal isOpen={isOpen} onClose={close} onClosed={unmount}>
            <ConfirmDialog
                message="정말 삭제하시겠습니까?"
                onConfirm={() => { mutation.mutate(id); close(); }}
                onCancel={close}
            />
        </Modal>
    ));
};
```
