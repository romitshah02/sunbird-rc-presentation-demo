import VpPage from '../VpPage'
import { body } from '../bodies/transport'

export default function Transport() {
  return <VpPage title="Transport Pass" hint="Scan with your wallet" body={body} theme="transport" />
}
