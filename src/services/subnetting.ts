import Network from '@/models/Network'
import { Subnet } from '@/validation/subnetSchema'

export function divideNetworkWithVLSM(
  network: Network,
  subnets: Subnet[],
): Network[] {
  const numHosts = subnets.reduce((acc, subnet) => acc + subnet.size, 0)
  const availableIPs = network.availableIPs

  if (availableIPs.length < numHosts) {
    throw new Error('Not enough IP addresses for the subnets.')
  }

  if (!subnets.every((subnet) => subnet.size >= 2)) {
    throw new Error('Subnets must have at least 2 hosts.')
  }

  const maxHostsPerSubnet = availableIPs.length / subnets.length - 2
  subnets.sort((a, b) => b.size - a.size)

  if (subnets[0].size > maxHostsPerSubnet) {
    throw new Error('Subnet size is too large.')
  }

  const subnetsData: Network[] = []

  for (let i = 0; i < subnets.length; i++) {
    const subnet = subnets[i]

    if (i === 0) {
      const prefix = 32 - Math.ceil(Math.log2(subnet.size + 2))
      const newSubnet = new Network(network.networkAddress, prefix)

      subnetsData.push(newSubnet)

      continue
    }
    break
    //const previousSubnet = subnetsData[i - 1]
  }

  return subnetsData
}
