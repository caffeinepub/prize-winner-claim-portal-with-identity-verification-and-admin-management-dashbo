import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ClaimStatus } from '../backend';

export function useUpdateClaimStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ claimId, status }: { claimId: string; status: ClaimStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateClaimStatus(claimId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });
}

export function useAdminResponse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ claimId, response }: { claimId: string; response: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminResponse(claimId, response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });
}
