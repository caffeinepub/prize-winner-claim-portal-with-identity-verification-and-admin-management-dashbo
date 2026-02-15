import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { WinnerClaim, ClaimStatus } from '../backend';

export function useSubmitWinnerClaim() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (claim: WinnerClaim) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitWinnerClaim(claim);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });
}

export function useGetAllClaims(statusFilter: ClaimStatus | null = null, page: number = 0, pageSize: number = 20) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['claims', 'all', statusFilter, page, pageSize],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClaims(statusFilter, { page: BigInt(page), pageSize: BigInt(pageSize) });
    },
    enabled: !!actor && !isFetching,
  });
}
