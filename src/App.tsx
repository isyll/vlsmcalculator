import { memo, useCallback, useEffect, useState } from 'react'
import NetworkForm from './components/NetworkForm'
import SubnetSummary from './components/SubnetSummary'
import { NetworkFormData } from './validation/networkFormSchema'
import Network from './models/Network'
import { divideNetworkWithVLSM } from './services/subnetting'
import IPAddress from './models/IPAddress'
import CalculatedData from './types/CalculatedData'
import DividingError, { ErrorType } from '@/exceptions/DividingError.ts'
import { Button } from '@/components/ui/button.tsx'

function App() {
  // Disable scrolling on `<input type=number>`
  useEffect(() => {
    const handleWheel = function () {
      const activeElement = document.activeElement as HTMLElement

      if (
        activeElement.tagName === 'INPUT' &&
        (activeElement as HTMLInputElement).type === 'number'
      ) {
        activeElement.blur()
      }
    }

    document.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      document.removeEventListener('wheel', handleWheel)
    }
  }, [])

  const [state, setState] = useState<{
    networks: CalculatedData[]
    errMsg: string
    actionElement: JSX.Element | null
  }>({
    networks: [],
    errMsg: '',
    actionElement: null,
  })

  const onSubmit = useCallback(
    (data: NetworkFormData) => {
      const networkIP = new IPAddress(data.address)
      const network = new Network(networkIP, data.mask)

      try {
        const subnets: Network[] = divideNetworkWithVLSM(network, data.subnets)
        const subnetData = subnets.map((subnet, index) => ({
          network: subnet,
          ...data.subnets[index],
        }))

        setState({
          networks: subnetData,
          errMsg: '',
          actionElement: null,
        })
      } catch (e) {
        if (e instanceof DividingError) {
          let element: typeof state.actionElement = null

          if (e.type === ErrorType.SubnetSizeIsTooLarge) {
            element = (
              <Button
                onClick={() =>
                  setState({
                    errMsg: '',
                    actionElement: null,
                    // Here we need to ensure that divideNetworkWithVLSM() does
                    // not trigger a new exception. In this case, the error will
                    // not be processed and will result in a UI error.
                    networks: divideNetworkWithVLSM(network, data.subnets, {
                      canUseNextNetwork: true,
                    }).map((subnet, index) => ({
                      network: subnet,
                      ...data.subnets[index],
                    })),
                  })
                }
              >
                Authorize usage of next network
              </Button>
            )
          }

          setState({
            networks: [],
            errMsg: e.message,
            actionElement: element,
          })
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <main className='flex flex-col items-center h-full w-full'>
      <NetworkForm onSubmit={onSubmit} />
      <MemoizedSubnetSummary networks={state.networks} />
      <div className='flex gap-2'>
        {state.errMsg && <h3>{state.errMsg}</h3>}
        {state.actionElement && state.actionElement}
      </div>
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
        !prevProps.networks[i].network.equals(nextProps.networks[i].network) ||
        prevProps.networks[i].name !== nextProps.networks[i].name ||
        prevProps.networks[i].size !== nextProps.networks[i].size
      ) {
        return false
      }
    }

    return true
  },
)

export default App
