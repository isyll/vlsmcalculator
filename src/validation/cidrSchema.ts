import { z } from 'zod'

const cidrSchema = z
  .string()
  .regex(
    /^(3[0-2]|[1-2]?[0-9])$/,
    'Invalid CIDR notation, must be between /0 and /32',
  )

export default cidrSchema
