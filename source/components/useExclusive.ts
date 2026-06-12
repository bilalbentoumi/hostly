import { useStdin } from 'ink';
import { useCallback } from 'react';

/**
 * Returns a runner that releases Ink's raw-mode grip on stdin while an async
 * task runs, so child processes (e.g. a `sudo` password prompt) can use the
 * terminal, then restores it.
 */
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
