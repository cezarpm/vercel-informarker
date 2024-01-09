// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {

    try {
        const { nome_da_chapa, data_votacao_inicio, data_votacao_fim, chapas } = req.body

        await prisma.votacao.create({
            data: {
                data_votacao_fim,
                data_votacao_inicio,
                matricula_saerj: nome_da_chapa,
                chapas: {
                    chapas: [
                        ...chapas
                    ]
                },
                status: 'ATIVO'
            }
        })


        return res.status(201).end()
    } catch (error) {
        console.log(error)
        const ErrorMessage = `Error conect database`
        return res.status(500).json({ message: `${ErrorMessage}` })
    }
}
