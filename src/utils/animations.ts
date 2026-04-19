const DELAY_CYCLE_LENGTH = 6

export function revealDelayClass(index: number): string {
  return `reveal-delay-${Math.min(index % DELAY_CYCLE_LENGTH + 1, DELAY_CYCLE_LENGTH)}`
}
