// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const schemaCargos = z.object({
  name: z.string(),
})

type schemaCargos = z.infer<typeof schemaCargos>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const data: schemaCargos = req.body

  try {
    await prisma.cargos.create({
      data: {
        name: data.name,
      },
    })
    return res.status(201).end()
  } catch (error) {
    console.log(error)
    const ErrorMessage = `Error conect database`
    return res.status(500).json({ message: `${ErrorMessage}` })
  }
}
