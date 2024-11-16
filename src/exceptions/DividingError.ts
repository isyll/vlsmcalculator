export enum ErrorType {
  NoSubnetsProvided = 'NoSubnetsProvided',
  NotEnoughIPs = 'NotEnoughIPs',
  SubnetsMustHaveAtLeast2Hosts = 'SubnetsMustHaveAtLeast2Hosts',
  SubnetSizeIsTooLarge = 'SubnetSizeIsTooLarge',
}

class DividingError extends Error {
  constructor(
    public readonly type: ErrorType,
    message?: string,
  ) {
    super(message)
  }
}

export default DividingError
