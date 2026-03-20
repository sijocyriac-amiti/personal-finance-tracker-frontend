import { useOutletContext } from 'react-router-dom'
import type { ShellOutletContext } from '../components/AppShell'

export function useShellContext() {
  return useOutletContext<ShellOutletContext>()
}
