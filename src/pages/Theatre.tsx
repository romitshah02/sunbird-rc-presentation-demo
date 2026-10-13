import { useSearchParams } from 'react-router-dom'
import VpPage from '../VpPage'
import { body } from '../bodies/theatre'
import { theatreEvaluators } from '../processing/theatre'

// /theatre?check=adult requires valid + 18+; anything else is the plain valid-student check.
export default function Theatre() {
  const [params] = useSearchParams()
  const mode = params.get('check') === 'adult' ? 'adult' : 'valid'
  return (
    <VpPage
      title="Theatre Tickets"
      hint={mode === 'adult' ? 'Scan with your wallet · 18+ check' : 'Scan with your wallet'}
      body={body}
      theme="theatre"
      evaluate={theatreEvaluators[mode]}
    />
  )
}
