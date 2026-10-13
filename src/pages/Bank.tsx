import VpPage from '../VpPage'
import { body } from '../bodies/bank'

export default function Bank() {
  return <VpPage title="Bank Verification" hint="Scan with your wallet" body={body} theme="bank" />
}
