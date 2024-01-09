// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {

    try {
        const id = parseInt(req.query.id) 

        if(!id) {
            return res.status(400).json({ message: 'id is required' })
        }

        const eleicao = await prisma.votacao.findFirst({
            where: {
                id,
            },
        })
        
        const chapaNomes = eleicao?.chapas.chapas.map((chapa) => chapa.nome_chapa);

        const votosCount = await prisma.voto.count({
            where: {
                votacao_id: id,
            },
        })

        const votosChapasPromise = chapaNomes?.map(async (chapaNome) => {

            const res = await prisma.voto.count({
                where: {
                    votacao_id: id,
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
                votacao_id: id,
                nome_chapa: 'BRANCO',
            },
        })

        const votosNulo = await prisma.voto.count({
            where: {
                votacao_id: id,
                nome_chapa: 'NULO',
            },
        })


        const response = {
            name: eleicao?.matricula_saerj,
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
