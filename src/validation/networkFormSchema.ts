import { z } from 'zod'
import ipAddressSchema from './ipAddressSchema'
import subnetSchema from './subnetSchema'
import cidrSchema from './cidrSchema'

const networkFormSchema = z.object({
  address: ipAddressSchema,
  mask: cidrSchema,
  subnets: z.array(subnetSchema),
})

export default networkFormSchema

export type NetworkFormData = z.infer<typeof networkFormSchema>
