-- Add missing "generation" column to "Application" table.
-- schema.prisma는 이미 generation 필드를 가지고 있었지만 init 마이그레이션엔 누락되어
-- 운영 DB와 코드 사이 스키마 드리프트가 발생함. IF NOT EXISTS로 멱등 처리.

ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "generation" INTEGER NOT NULL DEFAULT 0;
