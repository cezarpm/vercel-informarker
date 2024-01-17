/* eslint-disable camelcase */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== `PUT`) {
    const MessageErrorMethodInvalid = `Error method invalid`
    return res.status(405).json({ message: `${MessageErrorMethodInvalid}` })
  }
  const {
    id,
    matricula_saerj,
    data_votacao_inicio,
    data_votacao_fim,
    chapas,
    status,
  } = req.body

  try {
    await prisma.votacao.update({
      where: { id },
      data: {
        data_votacao_fim: new Date(data_votacao_fim).toISOString(),
        data_votacao_inicio: new Date(data_votacao_inicio).toISOString(),
        matricula_saerj,
        chapas: {
          chapas: [...chapas],
        },
        status,
      },
    })
    return res.status(200).end()
  } catch (error) {
    console.log(error)
    const MessageError = `Error connect db`
    return res.status(500).json({ message: `${MessageError}`, error })
  }
}
