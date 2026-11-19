import { useQuery } from '@tanstack/react-query';
import { hrService } from './hr-service';

// 회원·회비 화면의 모든 쿼리 키는 이 값으로 시작한다.
// 무엇이든 바꾼 뒤에는 이 키로 한꺼번에 다시 불러와 두 탭의 숫자가 어긋나지 않게 한다.
export const HR_QUERY_KEY = 'hr';

export const hrKeys = {
  all: [HR_QUERY_KEY] as const,
  overview: [HR_QUERY_KEY, 'overview'] as const,
  member: (id: number) => [HR_QUERY_KEY, 'member', id] as const,
  applications: [HR_QUERY_KEY, 'applications'] as const,
  deposits: (month: string) => [HR_QUERY_KEY, 'deposits', month] as const,
  devices: [HR_QUERY_KEY, 'devices'] as const,
};

export function useHrOverview() {
  return useQuery({
    queryKey: hrKeys.overview,
    queryFn: hrService.fetchOverview,
    // 입금은 총무 휴대폰에서 수시로 올라오므로, 화면으로 돌아올 때마다 새로 불러온다
    staleTime: 15_000,
  });
}

export function useHrMember(id: number | null) {
  return useQuery({
    queryKey: hrKeys.member(id ?? 0),
    queryFn: () => hrService.fetchMember(id as number),
    enabled: id !== null,
  });
}

export function useHrApplications(enabled = true) {
  return useQuery({
    queryKey: hrKeys.applications,
    queryFn: hrService.fetchApplications,
    enabled,
  });
}

export function useHrDeposits(month: string | null) {
  return useQuery({
    queryKey: hrKeys.deposits(month ?? ''),
    queryFn: () => hrService.fetchDeposits(month as string),
    enabled: month !== null,
    // 달을 바꿀 때 목록이 비었다가 다시 차지 않게, 새 달이 올 때까지 앞 달 목록을 보여 준다
    placeholderData: (prev) => prev,
  });
}

export function useHrDevices() {
  return useQuery({ queryKey: hrKeys.devices, queryFn: hrService.fetchDevices });
}
