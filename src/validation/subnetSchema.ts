import { z } from 'zod'

const subnetSchema = z.object({
  name: z.string().min(1, { message: "The subnet's name is required." }),
  size: z
    .number()
    .min(1, { message: "The subnet's size must be greater than 1." }),
})

export default subnetSchema
