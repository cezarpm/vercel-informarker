// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const integranteSchema = z.object({
  foto: z.string().min(1, { message: 'O campo foto é obrigatório' }),
  nome: z.string().min(1, { message: 'O campo nome é obrigatório' }),
  cargo: z.string().min(1, { message: 'O campo cargo é obrigatório' }),
})

const schemaChapaForm = z.object({
  nome_da_chapa: z
    .string()
    .min(1, { message: 'O campo nome da chapa é obrigatório' }),
  integrantes: z.array(integranteSchema).nonempty(),
})

type SchemaChapaForm = z.infer<typeof schemaChapaForm>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const data: SchemaChapaForm = req.body

  try {
    await prisma.chapas.create({
      data: {
        nome_chapa: data.nome_da_chapa,
        membros_chapa: data.integrantes,
      },
    })
    return res.status(201).end()
  } catch (error) {
    console.log(error)
    const ErrorMessage = `Error conect database`
    return res.status(500).json({ message: `${ErrorMessage}` })
  }
}
