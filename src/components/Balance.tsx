import { useEconomyStore } from '../store/economy'
import { formatBalance } from '../utils/formatBalance'
import { Badge } from './Badge'
import { Tooltip } from './Tooltip'

export function Balance() {
  const exp = useEconomyStore((state) => state.exp)
  const diamonds = useEconomyStore((state) => state.diamonds)

  return (
    <div className="flex items-center gap-2">
      <Tooltip label="EXP loads from the server.">
        <Badge tone="exp">EXP {formatBalance(exp)}</Badge>
      </Tooltip>
      <Tooltip label="Diamonds load from the server.">
        <Badge tone="diamond">Diamonds {formatBalance(diamonds)}</Badge>
      </Tooltip>
    </div>
  )
}
