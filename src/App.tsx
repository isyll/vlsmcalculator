import { memo, useCallback, useState } from 'react'
import NetworkForm from './components/NetworkForm'
import SubnetSummary from './components/SubnetSummary'
import { NetworkFormData } from './validation/networkFormSchema'
import Network from './models/Network'
import { divideNetworkWithVLSM } from './services/subnetting'
import IPAddress from './models/IPAddress'

function App() {
  const [errMsg, setErrMsg] = useState('')
  const onSubmit = useCallback((data: NetworkFormData) => {
    const networkIP = new IPAddress(data.address)
    const network = new Network(networkIP, +data.mask)
    try {
      const subnets: Network[] = divideNetworkWithVLSM(network, data.subnets)
      setNetworks(subnets)
      if (errMsg !== '') {
        setErrMsg('')
      }
    } catch (e) {
      setNetworks([])
      if (e instanceof Error) {
        setErrMsg(e.message)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [networks, setNetworks] = useState<Network[]>([])

  return (
    <main className='flex place-content-center h-full w-full'>
      <NetworkForm onSubmit={onSubmit} />
      <MemoizedSubnetSummary networks={networks} />
      {errMsg && <h3>{errMsg}</h3>}
    </main>
  )
}

type MemoizedSubnetSummaryProps = Readonly<{ networks: Network[] }>

const MemoizedSubnetSummary = memo(
  ({ networks }: MemoizedSubnetSummaryProps) => (
    <SubnetSummary networks={networks} />
  ),
  (prevProps, nextProps) => {
    if (prevProps.networks.length !== nextProps.networks.length) {
      return false
    }

    for (let i = 0; i < prevProps.networks.length; i++) {
      if (!prevProps.networks[i].equals(nextProps.networks[i])) {
        return false
      }
    }

    return true
  },
)

export default App
