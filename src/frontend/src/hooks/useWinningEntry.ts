import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { WinningEntry } from '../backend';

export function useGetAllWinningEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<WinningEntry[]>({
    queryKey: ['winningEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWinningEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEntryByNumber() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (prizeNumber: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getEntryByNumber(prizeNumber);
    },
  });
}

export function useClaimWinningEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.claimWinningEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['winningEntries'] });
    },
  });
}
