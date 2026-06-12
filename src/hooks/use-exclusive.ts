import { useStdin } from 'ink';
import { useCallback } from 'react';

export function useExclusive(): <T>(task: () => Promise<T>) => Promise<T> {
  const { setRawMode, isRawModeSupported } = useStdin();

  return useCallback(
    async <T>(task: () => Promise<T>): Promise<T> => {
      if (isRawModeSupported) {
        setRawMode(false);
      }
      try {
        return await task();
      } finally {
        if (isRawModeSupported) {
          setRawMode(true);
        }
      }
    },
    [setRawMode, isRawModeSupported],
  );
}
