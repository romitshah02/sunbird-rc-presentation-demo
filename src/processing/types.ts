export interface Verdict {
  ok: boolean
  // Result headline; the page falls back to "✓ Valid" / "✗ Not valid".
  headline?: string
  message: string
}
