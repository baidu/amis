import React, {useContext} from 'react';
import {RenderOptionsContext} from '../factory';

export const RenderOptionsContextProvider = RenderOptionsContext.Provider;

/**
 * Hook to access the AMIS render options context
 * @returns The render options context object
 */
export function useRenderOptionsContext(): React.ContextType<
  typeof RenderOptionsContext
> {
  const context = useContext(RenderOptionsContext);

  if (context === undefined) {
    throw new Error('useEnvContext must be used within an EnvContextProvider');
  }

  return context;
}

export default useRenderOptionsContext;
