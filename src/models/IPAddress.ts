export default class IPAddress {
  constructor(private _address: string) {}

  get address() {
    return this._address
  }

  toInteger(): number {
    return this._address
      .split('.')
      .reduce((acc, byte) => (acc << 8) + parseInt(byte), 0)
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
}
