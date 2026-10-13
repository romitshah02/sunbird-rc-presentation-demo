import VpPage from '../VpPage'
import { body } from '../bodies/transport'
import { evaluateTransport } from '../processing/transport'

export default function Transport() {
  return (
    <VpPage
      title="Transport Pass"
      hint="Scan with your wallet"
      body={body}
      theme="transport"
      evaluate={evaluateTransport}
    />
  )
}
