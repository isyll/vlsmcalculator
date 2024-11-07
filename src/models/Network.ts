import IPAddress from './IPAddress'

export default class Network {
  constructor(
    private baseIP: IPAddress,
    private prefix: number,
  ) {}

  get subnetMask(): IPAddress {
    const mask = (-1 << (32 - this.prefix)) >>> 0
    return IPAddress.fromInteger(mask)
  }

  get networkAddress(): IPAddress {
    const networkAddress = this.baseIP.toInteger() & this.subnetMask.toInteger()
    return IPAddress.fromInteger(networkAddress)
  }

  get broadcastAddress(): IPAddress {
    const broadcastAddress = this.baseIP.toInteger() | (~this.subnetMask >>> 0)
    return IPAddress.fromInteger(broadcastAddress)
  }

  get availableIPs(): IPAddress[] {
    const network = this.networkAddress.toInteger()
    const broadcast = this.broadcastAddress.toInteger()
    const availableIPs = []

    for (let ip = network + 1; ip < broadcast; ip++) {
      availableIPs.push(IPAddress.fromInteger(ip))
    }

    return availableIPs
  }

  equals(other: Network): boolean {
    return (
      this.networkAddress.toInteger() === other.networkAddress.toInteger() &&
      this.prefix === other.prefix
    )
  }
}
