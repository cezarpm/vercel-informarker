// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {

    try {
        const { nome_da_chapa, data_inicio, data_fim, chapas, status } = req.body

        console.log('olha euu');


        await prisma.votacao.create({
            data: {
                data_votacao_fim: new Date(data_fim).toISOString(),
                data_votacao_inicio: new Date(data_inicio).toISOString(),
                matricula_saerj: nome_da_chapa,
                chapas: {
                    chapas: [
                        ...chapas
                    ]
                },
                status: 'ATIVA'
            }
        })


        return res.status(201).end()
    } catch (error) {
        console.log(error)
        const ErrorMessage = `Error conect database`
        return res.status(500).json({ message: `${ErrorMessage}` })
    }
}
