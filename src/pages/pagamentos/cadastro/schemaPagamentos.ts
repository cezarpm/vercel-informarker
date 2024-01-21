import { z } from 'zod'

export const schemaPagamentos = z.object({
  matricula_saerj: z.string().min(1, { message: 'Campo Obrigatório' }),
  tipo_pagamento: z.string().min(1, { message: 'Campo Obrigatório' }),
  ano_anuidade: z.string(),
  data_pagto_unica: z.date(),
  valor_pagto_unica: z.string().regex(/^\d+(\.\d{1,2})?$/),
  data_pagto_parcela_1: z.date(),
  valor_pagto_parcela_1: z.string().regex(/^\d+(\.\d{1,2})?$/),
  data_pagto_parcela_2: z.date(),
  valor_pagto_parcela_2: z.string().regex(/^\d+(\.\d{1,2})?$/),
  data_pagto_parcela_3: z.date(),
  valor_pagto_parcela_3: z.string().regex(/^\d+(\.\d{1,2})?$/),
})
