import Network from '@/models/Network'
import { FC } from 'react'

type SubnetSummaryProps = {
  networks: Network[]
}

const SubnetSummary: FC<SubnetSummaryProps> = ({ networks }) => {
  const total = networks.length

  return total > 0 && <>3</>
}

export default SubnetSummary
