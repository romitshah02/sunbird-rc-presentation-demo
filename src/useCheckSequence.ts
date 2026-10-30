import { useEffect, useState } from 'react'

const STEP_MS = 900
const SETTLE_MS = 260

// Animates N credential checks resolving one after another once `active` turns true (e.g. the
// verifier reports verified:true), instead of revealing all of them at once. `done` counts how
// many checks have resolved so far; `settled` flips true once the whole sequence (plus a short
// pause) has finished, which is when dependent UI (pills, the decision button) should unlock.
// Respects prefers-reduced-motion by skipping straight to the end.
export function useCheckSequence(active: boolean, count: number) {
  const [done, setDone] = useState(0)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    if (!active) {
      setDone(0)
      setSettled(false)
      return
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stepMs = reduceMotion ? 0 : STEP_MS
    const timers: ReturnType<typeof setTimeout>[] = []
    setDone(0)
    setSettled(false)
    for (let i = 1; i <= count; i++) {
      timers.push(setTimeout(() => setDone(i), stepMs * i))
    }
    timers.push(setTimeout(() => setSettled(true), stepMs * count + (reduceMotion ? 0 : SETTLE_MS)))
    return () => timers.forEach(clearTimeout)
  }, [active, count])

  return { done, settled }
}
