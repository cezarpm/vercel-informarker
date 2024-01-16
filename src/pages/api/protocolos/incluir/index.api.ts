// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const schemaProtocoloForm = z.object({
  num_protocolo: z.string(),
  assunto_protocolo: z.string(),
  tipo_protocolo: z.string(),
  data_recebimento_dia: z.number(),
  data_recebimento_mes: z.number(),
  data_recebimento_ano: z.number(),
  data_envio_dia: z.number(),
  data_envio_mes: z.number(),
  data_envio_ano: z.number(),
  meio_recebimento: z.string(),
  meio_envio: z.string(),
  quem_redigiu_documento_a_ser_enviado: z.string(),
  entregue_em_maos: z.boolean(),
  doc_entrada_requer_resposta: z.boolean(),
  anexos: z.string(), // ALTERAR PARA ANEXO DE ARQUIVO
  data_encerramento_protocolo_dia: z.number(),
  data_encerramento_protocolo_mes: z.number(),
  data_encerramento_protocolo_ano: z.number(),
  usuario_encerramento_protocolo: z.string(), // ALTERAR PARA USUÁRIO
})

type SchemaProtocoloForm = z.infer<typeof schemaProtocoloForm>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const data: SchemaProtocoloForm = req.body

  try {
    await prisma.protocolos.create({
      data: {
        ...data,
        data_envio_dia: Number(data.data_envio_dia),
        data_envio_mes: Number(data.data_envio_mes),
        data_envio_ano: Number(data.data_envio_ano),
      },
    })
    return res.status(201).end()
  } catch (error) {
    console.log(error)
    const ErrorMessage = `Error conect database`
    return res.status(500).json({ message: `${ErrorMessage}` })
  }
}
