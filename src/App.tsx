import { memo, useCallback, useState } from 'react'
import NetworkForm from './components/NetworkForm'
import SubnetSummary from './components/SubnetSummary'
import { NetworkFormData } from './validation/networkFormSchema'
import Network from './models/Network'
import { divideNetworkWithVLSM } from './services/subnetting'
import IPAddress from './models/IPAddress'
import CalculatedData from './types/CalculatedData'

function App() {
  const [errMsg, setErrMsg] = useState('')
  const onSubmit = useCallback((data: NetworkFormData) => {
    const networkIP = new IPAddress(data.address)
    const network = new Network(networkIP, data.mask)

    try {
      const subnets: Network[] = divideNetworkWithVLSM(network, data.subnets)
      const subnetData = subnets.map((subnet, index) => ({
        network: subnet,
        ...data.subnets[index],
      }))
      setNetworks(subnetData)
      setErrMsg('')
    } catch (e) {
      if (e instanceof Error) {
        setNetworks([])
        setErrMsg(e.message)
      }
    }
  }, [])
  const [networks, setNetworks] = useState<CalculatedData[]>([])

  return (
    <main className='flex flex-col items-center h-full w-full'>
      <NetworkForm onSubmit={onSubmit} />
      <MemoizedSubnetSummary networks={networks} />
      {errMsg && <h3>{errMsg}</h3>}
    </main>
  )
}

type MemoizedSubnetSummaryProps = Readonly<{
  networks: CalculatedData[]
}>

const MemoizedSubnetSummary = memo(
  ({ networks }: MemoizedSubnetSummaryProps) => (
    <SubnetSummary networks={networks} />
  ),
  (prevProps, nextProps) => {
    if (prevProps.networks.length !== nextProps.networks.length) {
      return false
    }

    for (let i = 0; i < prevProps.networks.length; i++) {
      if (
        !prevProps.networks[i].network.equals(nextProps.networks[i].network)
      ) {
        return false
      }
    }

    return true
  },
)

export default App
