import { useState } from 'react'
import VpPage from '../VpPage'
import { body } from '../bodies/theatre'
import { evaluateTheatre, type TicketType } from '../processing/theatre'

const OPTIONS: { value: TicketType; label: string }[] = [
  { value: 'kid', label: 'Criança' },
  { value: 'adult', label: 'Adulto (18+)' },
]

export default function Theatre() {
  const [type, setType] = useState<TicketType>('kid')
  return (
    <VpPage
      title="Theatre Tickets"
      hint="Scan with your wallet"
      body={body}
      theme="theatre"
      evaluate={(claims) => evaluateTheatre(type, claims)}
    >
      <div className="options" role="group" aria-label="Ticket type">
        {OPTIONS.map((o) => (
          <button key={o.value} aria-pressed={type === o.value} onClick={() => setType(o.value)}>
            {o.label}
          </button>
        ))}
      </div>
    </VpPage>
  )
}
