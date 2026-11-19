-- 지금 웹 지원 양식이 보내는 항목을 지원서 표에 더한다.
-- 양식은 이 항목들을 보내는데 표에는 컬럼이 없어서 제출이 400으로 거절되고 있었다.
-- 이미 있는 컬럼은 건너뛰고, 기존 지원서의 값은 건드리지 않는다.

ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "howKnow" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "scaleDesignTool" INTEGER;
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "mainDesign" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "scaleCameraTool" INTEGER;
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "mainProject" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "q2_motivation" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "q3_drink" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "q4_contribution" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "interviewSchedule" TEXT;
