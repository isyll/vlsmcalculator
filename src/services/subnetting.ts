// import Network from '@/models/Network'
// import { Subnet } from '@/validation/subnetSchema'

import Network from '@/models/Network'
import { Subnet } from '@/validation/subnetSchema'

// export function isSubnettingPossible(network: Network, subnets: Subnet[]) {
//   const numSubnets = subnets.length
//   const numHosts = subnets.reduce((acc, subnet) => acc + subnet.size, 0)

//   const availableIPs = network.availableIPs
//   if (numHosts > availableIPs.length) {
//     return false
//   }
// }

export function divideNetworkWithVLSM(
  network: Network,
  subnets: Subnet[],
): Network[] {
  return []
}
