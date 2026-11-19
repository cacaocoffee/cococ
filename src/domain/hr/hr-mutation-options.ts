import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hrService } from './hr-service';
import { hrKeys } from './hr-query-options';
import type {
  DepositCreateItem,
  DepositPatchPayload,
  HrOverview,
  HrSettings,
  MemberCreatePayload,
  MemberPatchPayload,
} from './hr-dto';

// 회원·입금·설정 중 무엇을 바꾸든 미납액과 요약 숫자가 함께 달라지므로,
// 바꾼 뒤에는 회원·회비 쿼리를 모두 다시 불러온다.
function useInvalidateHr() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: hrKeys.all });
}

export function useCreateMember() {
  const invalidate = useInvalidateHr();
  return useMutation({
    mutationFn: (data: MemberCreatePayload) => hrService.createMember(data),
    onSettled: invalidate,
  });
}

export function useUpdateMember() {
  const invalidate = useInvalidateHr();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MemberPatchPayload }) =>
      hrService.updateMember(id, data),
    onSettled: invalidate,
  });
}

export function useDeleteMember() {
  const invalidate = useInvalidateHr();
  return useMutation({
    mutationFn: (id: number) => hrService.deleteMember(id),
    onSettled: invalidate,
  });
}

export function useRegisterFromApplications() {
  const invalidate = useInvalidateHr();
  return useMutation({
    mutationFn: ({ applicationIds, joinedMonth }: { applicationIds: number[]; joinedMonth: string }) =>
      hrService.registerFromApplications(applicationIds, joinedMonth),
    onSettled: invalidate,
  });
}

export function useCreateDeposit() {
  const invalidate = useInvalidateHr();
  return useMutation({
    mutationFn: (item: DepositCreateItem) => hrService.createDeposits([item]),
    onSettled: invalidate,
  });
}

/**
 * 입금을 회원에 연결하거나, 연결을 풀거나, 회비 아님으로 표시한다.
 * 연결하거나 회비 아님으로 표시하면 `연결 안 된 입금` 목록에서 빠지는 것이 확실하므로,
 * 서버 응답을 기다리지 않고 목록에서 먼저 지운다. 실패하면 되돌린다.
 */
export function useUpdateDeposit() {
  const qc = useQueryClient();
  const invalidate = useInvalidateHr();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DepositPatchPayload }) =>
      hrService.updateDeposit(id, data),
    onMutate: async ({ id, data }) => {
      const leavesUnmatched = data.ignored === true || typeof data.memberId === 'number';
      if (!leavesUnmatched) return { previous: undefined };
      await qc.cancelQueries({ queryKey: hrKeys.overview });
      const previous = qc.getQueryData<HrOverview>(hrKeys.overview);
      if (previous) {
        qc.setQueryData<HrOverview>(hrKeys.overview, {
          ...previous,
          unmatched: previous.unmatched.filter((d) => d.id !== id),
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) qc.setQueryData(hrKeys.overview, context.previous);
    },
    onSettled: invalidate,
  });
}

export function useDeleteDeposit() {
  const invalidate = useInvalidateHr();
  return useMutation({
    mutationFn: (id: number) => hrService.deleteDeposit(id),
    onSettled: invalidate,
  });
}

export function useUpdateSettings() {
  const invalidate = useInvalidateHr();
  return useMutation({
    mutationFn: (data: Partial<HrSettings>) => hrService.updateSettings(data),
    onSettled: invalidate,
  });
}

export function useDeleteDevice() {
  const invalidate = useInvalidateHr();
  return useMutation({
    mutationFn: (id: number) => hrService.deleteDevice(id),
    onSettled: invalidate,
  });
}
