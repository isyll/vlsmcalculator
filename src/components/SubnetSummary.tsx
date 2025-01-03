import { FC } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import CalculatedData from '@/types/CalculatedData'
import { subnetMaskToCidr } from '@/utils/conversion.ts'

type SubnetSummaryProps = {
  networks: CalculatedData[]
}

const SubnetSummary: FC<SubnetSummaryProps> = ({ networks }) => {
  const total = networks.length

  return (
    total > 0 && (
      <div>
        <Table>
          <TableCaption>List of subnets.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Hosts needed</TableHead>
              <TableHead>Hosts available</TableHead>
              <TableHead>Unused hosts</TableHead>
              <TableHead>Network address</TableHead>
              <TableHead>Mask</TableHead>
              <TableHead>Range</TableHead>
              <TableHead>Broadcast</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {networks.map((networkItem, index) => {
              const name = networkItem.name
              const size = networkItem.size
              const network = networkItem.network
              const availableIPs = network.availableIPs
              const cidr = subnetMaskToCidr(network.subnetMask.toString())

              return (
                <TableRow key={index}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{size}</TableCell>
                  <TableCell>{availableIPs.length}</TableCell>
                  <TableCell>{availableIPs.length - size}</TableCell>
                  <TableCell>{network.networkAddress.toString()}</TableCell>
                  <TableCell>
                    {network.subnetMask.toString() + ` - /${cidr}`}
                  </TableCell>
                  <TableCell>{`${availableIPs[0]} - ${
                    availableIPs[availableIPs.length - 1]
                  }`}</TableCell>
                  <TableCell>{network.broadcastAddress.toString()}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )
  )
}

export default SubnetSummary
