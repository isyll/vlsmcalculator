export function subnetMaskToCidr(mask: string): number {
  const parts = mask.split('.').map(Number)

  let cidr = 0
  parts.forEach((part) => {
    cidr += (part >>> 0).toString(2).padStart(8, '0').split('1').length - 1
  })

  return cidr
}

export function cidrToSubnetMask(cidr: number): string {
  const binaryMask = '1'.repeat(cidr) + '0'.repeat(32 - cidr)

  const maskParts = []
  for (let i = 0; i < 4; i++) {
    maskParts.push(parseInt(binaryMask.slice(i * 8, (i + 1) * 8), 2))
  }

  return maskParts.join('.')
}
