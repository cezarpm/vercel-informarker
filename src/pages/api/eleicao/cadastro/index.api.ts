/* eslint-disable camelcase */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { data_votacao_inicio, data_votacao_fim, chapas, matricula_saerj } =
      req.body

    await prisma.votacao.create({
      data: {
        matricula_saerj,
        data_votacao_fim,
        data_votacao_inicio,
        chapas: {
          chapas: [...chapas],
        },
        status: 'ATIVA',
      },
    })

    return res.status(201).end()
  } catch (error) {
    console.log(error)
    const ErrorMessage = `Error conect database`
    return res.status(500).json({ message: `${ErrorMessage}` })
  }
}
