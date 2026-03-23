export const HOME_COMMANDS = ['profile', 'github', 'projects', 'note', 'clean'] as const

export function formatHomeCommand(command: (typeof HOME_COMMANDS)[number]) {
  return `/${command}`
}
