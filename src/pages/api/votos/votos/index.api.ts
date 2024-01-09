// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {

    try {

        const eleicao = await prisma.votacao.findFirst({
            where: {
                id: 1,
            },
        })


        const chapaNomes = eleicao?.chapas.chapas.map((chapa) => chapa.name);


        const votos = await prisma.voto.findMany({
            where: {
                votacao_id: 1,
            },
        })

        const votosCount = await prisma.voto.count({
            where: {
                votacao_id: 1,
            },
        })

        const votosChapasPromise = chapaNomes?.map(async (chapaNome) => {
            console.log(chapaNome);

            const res = await prisma.voto.count({
                where: {
                    votacao_id: 1,
                    nome_chapa: chapaNome,
                },
            })

            console.log(res);

            return {
                chapaNome,
                count: res,
            }

        })

        const votosChapas = await Promise.all(votosChapasPromise)

        const votosBranco = await prisma.voto.count({
            where: {
                votacao_id: 1,
                nome_chapa: 'BRANCO',
            },
        })

        const votosNulo = await prisma.voto.count({
            where: {
                votacao_id: 1,
                nome_chapa: 'NULO',
            },
        })


        const response = {
            votos,
            votosCount,
            votosChapas,
            votosBranco,
            votosNulo,
        }

        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        const ErrorMessage = `Error conect database`
        return res.status(500).json({ message: `${ErrorMessage}` })
    }
}
