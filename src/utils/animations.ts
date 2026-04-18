export function revealDelayClass(index: number): string {
  return `reveal-delay-${Math.min(index % 6 + 1, 6)}`
}
