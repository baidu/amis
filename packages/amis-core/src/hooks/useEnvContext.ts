import React, {useContext} from 'react';
import {EnvContext} from '../env';

export const EnvContextProvider = EnvContext.Provider;

/**
 * Hook to access the AMIS environment context
 * @returns The environment context object
 */
export function useEnvContext(): React.ContextType<typeof EnvContext> {
  const context = useContext(EnvContext);

  if (context === undefined) {
    throw new Error('useEnvContext must be used within an EnvContextProvider');
  }

  return context;
}

export default useEnvContext;
