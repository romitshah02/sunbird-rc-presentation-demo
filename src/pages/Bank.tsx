import VpPage from '../VpPage'
import { body } from '../bodies/bank'
import { evaluateBank } from '../processing/bank'

export default function Bank() {
  return (
    <VpPage
      title="Bank Verification"
      hint="Scan with your wallet"
      body={body}
      theme="bank"
      evaluate={evaluateBank}
    />
  )
}
