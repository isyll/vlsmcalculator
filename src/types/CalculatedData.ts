import Network from '@/models/Network'
import { Subnet } from '@/validation/subnetSchema'

type CalculatedData = { network: Network } & Subnet

export default CalculatedData
