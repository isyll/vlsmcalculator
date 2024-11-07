import Network from '@/models/Network'
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
import { Subnet } from '@/validation/subnetSchema'

type SubnetSummaryProps = {
  networks: ({ network: Network } & Subnet)[]
}

const SubnetSummary: FC<SubnetSummaryProps> = ({ networks }) => {
  const total = networks.length

  return (
    total > 0 && (
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
            const network = networkItem.network
            const name = networkItem.name
            const size = networkItem.size
            const availableIPs = network.availableIPs

            return (
              <TableRow key={index}>
                <TableCell>{name}</TableCell>
                <TableCell>{size}</TableCell>
                <TableCell>{availableIPs.length}</TableCell>
                <TableCell>{availableIPs.length - size}</TableCell>
                <TableCell>{network.networkAddress.toString()}</TableCell>
                <TableCell>{network.subnetMask.toString()}</TableCell>
                <TableCell>{`${availableIPs[0]} - ${
                  availableIPs[availableIPs.length - 1]
                }`}</TableCell>
                <TableCell>{network.broadcastAddress.toString()}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  )
}

export default SubnetSummary
