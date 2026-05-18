// Supabase service-role 클라이언트 (lazy).
// 모듈 로드 시점에 throw하면 Supabase를 안 쓰는 라우트까지 죽으므로,
// 첫 호출 시점에 환경변수를 검증한다.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경변수가 설정되지 않았습니다');
  }
  // supabase-js는 realtime 모듈을 무조건 인스턴스화하는데, Node 20은 native WebSocket이 없어 createClient가 throw.
  // Storage만 쓰지만 realtime client가 강제 로드되니 ws를 transport로 주입해 우회한다.
  _client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { transport: WebSocket as unknown as typeof globalThis.WebSocket },
  });
  return _client;
}

export const STORAGE_BUCKET = process.env.SUPABASE_BUCKET ?? 'uploads';
