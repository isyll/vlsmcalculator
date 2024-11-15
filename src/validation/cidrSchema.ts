import { z } from 'zod'

const msg = 'Invalid CIDR notation, must be between /0 and /32'

const cidrSchema = z.number().int().min(0, msg).max(32, msg)

export default cidrSchema
