import Network from '@/models/Network'
import { Subnet } from '@/validation/subnetSchema'
import IPAddress from '@/models/IPAddress.ts'
import DividingError, { ErrorType } from '@/exceptions/DividingError.ts'

export type divideNetworkWithVLSMOptions = {
  canUseNextNetwork?: boolean
}

export function divideNetworkWithVLSM(
  network: Network,
  subnets: Subnet[],
  options: divideNetworkWithVLSMOptions = { canUseNextNetwork: false },
): Network[] {
  if (subnets.length === 0) {
    throw new DividingError(ErrorType.NoSubnetsProvided, 'No subnets provided.')
  }

  if (subnets.length === 1) {
    return [network]
  }

  const numHosts = subnets.reduce((acc, subnet) => acc + subnet.size, 0)
  const availableIPs = network.availableIPs

  if (availableIPs.length < numHosts) {
    throw new DividingError(
      ErrorType.NotEnoughIPs,
      'Not enough IP addresses for the subnets.',
    )
  }

  if (!subnets.every((subnet) => subnet.size >= 2)) {
    throw new DividingError(
      ErrorType.SubnetsMustHaveAtLeast2Hosts,
      'Subnets must have at least 2 hosts.',
    )
  }

  subnets.sort((a, b) => b.size - a.size)

  const subnetsData: Network[] = []

  for (let i = 0; i < subnets.length; i++) {
    const subnet = subnets[i]

    if (i === 0) {
      const prefix = 32 - Math.ceil(Math.log2(subnet.size + 2))
      const newSubnet = new Network(network.networkAddress, prefix)

      subnetsData.push(newSubnet)

      continue
    }

    const previousSubnet = subnetsData[i - 1]

    if (
      !options.canUseNextNetwork &&
      previousSubnet.broadcastAddress.toInteger() ===
        network.broadcastAddress.toInteger()
    ) {
      throw new DividingError(
        ErrorType.SubnetSizeIsTooLarge,
        'Subnets size is too large.',
      )
    }

    const prefix = 32 - Math.ceil(Math.log2(subnet.size + 2))
    const networkAddress = previousSubnet.broadcastAddress.toInteger() + 1
    const newSubnet = new Network(IPAddress.fromInteger(networkAddress), prefix)

    subnetsData.push(newSubnet)
  }

  return subnetsData
}
