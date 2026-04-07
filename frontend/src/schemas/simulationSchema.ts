import * as z from 'zod';
export const simulationConfigSchema = z.object({
  payload: z.string().min(1, 'Payload required'),
  srcIp: z.ipv4(),
  destIp: z.ipv4(),
  srcPort: z.number().min(1).max(65535),
  destPort: z.number().min(1).max(65535),
  appProtocol: z.enum(['HTTP', 'HTTPS', 'FTP']),
  appMethod: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  dropChance: z.coerce.number().min(0).max(1).optional(),
});

export type FormSchemaType = z.infer<typeof simulationConfigSchema>;
