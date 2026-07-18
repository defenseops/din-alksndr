import { useContext } from 'react';
import { AuthCtx } from './adminAuthCtx';

export function useAdminAuth() {
  return useContext(AuthCtx);
}
