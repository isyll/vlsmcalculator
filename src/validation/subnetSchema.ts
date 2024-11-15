import { z } from 'zod'

const subnetSchema = z.object({
  name: z.string().min(1, { message: "The subnet's name is required." }),
  size: z
    .number({ message: 'This field must be a number' })
    .min(2, { message: 'Subnets must have at least 2 hosts.' }),
})

export type Subnet = z.infer<typeof subnetSchema>

export default subnetSchema
