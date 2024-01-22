import { NextApiRequest, NextApiResponse } from 'next'
import xlsx from 'xlsx'
import * as path from 'path'
import * as fs from 'fs'
import { prisma } from '@/lib/prisma'
import { useArrayDate } from '@/utils/useArrayDate'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const diretorioAtual = process.cwd()
    console.log('Diretório Atual:', diretorioAtual)

    const caminhoPlanilha = path.resolve(
      diretorioAtual,
      'src',
      'planilhas',
      'SEC3.xlsx',
    )
    console.log('Caminho da planilha:', caminhoPlanilha)

    // Verifique se o arquivo existe
    if (!fs.existsSync(caminhoPlanilha)) {
      console.error('O arquivo da planilha não foi encontrado.')
      res.status(404).end()
      return
    }

    const workbook = xlsx.readFile(caminhoPlanilha)

    // Selecione a aba 'tabelas'
    const tabela = workbook.Sheets._SEC3
    const dadosTabela = xlsx.utils.sheet_to_json(tabela)

    const lerTabela = dadosTabela.map((item: any) => {
      const modifiedItem: { [key: string]: any } = {}
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          // Limpar '()', '-' e espaços em branco dos campos TEL1 e TEL2
          if (
            (key === 'TEL1' ||
              key === 'TEL2' ||
              key === 'CEP' ||
              key === 'CPF' ||
              key === 'CRM' ||
              key === 'CELULAR') &&
            typeof item[key] === 'string'
          ) {
            // eslint-disable-next-line no-useless-escape
            modifiedItem[key] = item[key].replace(/[\s()\-.']/g, '')
          } else {
            modifiedItem[key] = item[key]
          }
        }
      }
      return modifiedItem
    })
    console.log(lerTabela)
    try {
      for (const item of lerTabela) {
        console.log('Processando items Tabela:', item)

        const getDateOriginalFormat = item.ADMI
          ? useArrayDate.extrairComponentesData(item.ADMI)
          : null

        console.log(getDateOriginalFormat)

        const transformDateTimeISO = getDateOriginalFormat
          ? useArrayDate.MontarDate(
              String(getDateOriginalFormat.ano),
              String(getDateOriginalFormat.mes),
              String(getDateOriginalFormat.dia),
            )
          : null

        if (item.CATEGORIA === 'REM') {
          item.CATEGORIA = 'Remido'
          item.SITUACAO = 'Ativo'
        } else if (item.CATEGORIA === 'AAD') {
          item.CATEGORIA = 'Aspirante-Adjunto'
          item.SITUACAO = 'Ativo'
        } else if (item.CATEGORIA === 'ADJ') {
          item.CATEGORIA = 'Adjunto'
          item.SITUACAO = 'Ativo'
        } else if (item.CATEGORIA === 'ATV') {
          item.CATEGORIA = 'Ativo'
          item.SITUACAO = 'Ativo'
        } else if (item.CATEGORIA === 'D-1') {
          item.CATEGORIA = 'Inadimplente'
          item.SITUACAO = 'Inativo'
        } else if (item.CATEGORIA === 'D-2') {
          item.CATEGORIA = 'Transferido'
          item.SITUACAO = 'Inativo'
        } else if (item.CATEGORIA === 'D-3') {
          item.CATEGORIA = 'Pediu desligamento'
          item.SITUACAO = 'Inativo'
        } else if (item.CATEGORIA === 'D-4') {
          item.CATEGORIA = 'Falecido'
          item.SITUACAO = 'Falecido'
        } else if (item.CATEGORIA === 'D-6') {
          item.CATEGORIA = 'Pend. Alt. Categoria SBA'
          item.SITUACAO = 'Ativo'
        } else if (item.CATEGORIA === 'D-5') {
          item.CATEGORIA = 'Fora do Pais'
          item.SITUACAO = 'Inativo'
        } else if (item.CATEGORIA === 'D-7') {
          item.CATEGORIA = 'Fora do Pais'
          item.SITUACAO = 'Inativo'
        } else if (item.CATEGORIA === 'DES') {
          item.CATEGORIA = 'Desligado'
          item.SITUACAO = ''
        } else if (item.CATEGORIA === 'HON') {
          item.CATEGORIA = 'Honorário'
          item.SITUACAO = 'Ativo'
        } else if (
          item.CATEGORIA === 'ME1' ||
          item.CATEGORIA === 'ME2' ||
          item.CATEGORIA === 'ME3'
        ) {
          item.CATEGORIA = 'Aspirante'
          item.SITUACAO = 'Ativo'
        } else if (item.CATEGORIA === 'ME4') {
          item.CATEGORIA = 'Aspirante pend. SBA'
          item.SITUACAO = 'Ativo'
        }

        await prisma.adicionais_SAERJ.createMany({
          data: {
            matricula_saerj: item.MATRICULA,
            admissao_saerj: transformDateTimeISO,
            categoria_saerj: `${item.CATEGORIA}`,
            cooperativa: item.COOP,
            nome_pai: item.PAI,
            nome_mae: item.MAE,
            // tsa: ? ,
            observacao_1: item.OBS,
            observacao_2: item.OBS1,
            observacao_3: item.OBS2,
            hospital_1: item.HOSP1,
            hospital_2: item.HOSP2,
            tratamento: item.ILMO,
            cet_data_inicio: item.CETIN,
            cet_data_fim: item.CETFN,
          },
        })
      }
      res.status(200).json({ message: 'dados importados com sucesso!' })
    } catch (error) {
      console.error('Erro ao inserir dados da Tabela no banco:', error)
      res.status(500).json({
        error: 'Erro interno do servidor ao inserir dados da Tabela.',
      })
    }
    console.log('importação finalizada')
  } catch (error) {
    console.error('Erro ao converter planilha para JSON:', error)
    res.status(500).end()
  }
}
