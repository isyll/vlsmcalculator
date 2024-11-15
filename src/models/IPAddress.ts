export default class IPAddress {
  constructor(private readonly address: string) {
    if (!IPAddress.isValidIP(address)) {
      throw new Error('Invalid IP address')
    }
  }

  toString() {
    return this.address
  }

  toInteger(): number {
    return (
      this.address
        .split('.')
        .reduce((acc, byte) => (acc << 8) + parseInt(byte), 0) >>> 0
    )
  }

  static fromInteger(intValue: number): IPAddress {
    const bytes = [
      (intValue >> 24) & 255,
      (intValue >> 16) & 255,
      (intValue >> 8) & 255,
      intValue & 255,
    ]
    return new IPAddress(bytes.join('.'))
  }

  static isValidIP(address: string): boolean {
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/
    return ipRegex.test(address)
  }
}
