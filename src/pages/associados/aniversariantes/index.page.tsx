/* eslint-disable dot-notation */
/* eslint-disable camelcase */
import { Box, Container } from './styled'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { GridColDef } from '@mui/x-data-grid'
import TableBirthdays from '@/components/TableBirthdays'
import { ArrowBendDownLeft } from 'phosphor-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '../../../lib/axios'
import { BackPage } from '../../../components/BackPage'

interface ResponseItem {
  id: number
  data_nascimento?: string | null
  data_inicio_especializacao?: string | null
  data_previsao_conclusao?: string | null
  comprovante_cpf?: string | null
  numero_proposta_SBA?: string | null
  matricula_SAERJ?: number | null
  matricula_SBA?: number | null
  situacao?: string | null
  uf_crm?: string | null
  crm?: string | null
  nome_completo?: string | null
  cpf?: string | null
  sexo?: string | null
  nome_profissional?: string | null
  categoria?: string | null
  cep?: string | null
  logradouro?: string | null
  numero?: number | null
  complemento?: string | null
  bairro?: string | null
  cidade?: string | null
  uf?: string | null
  pais?: string | null
  telefone_celular?: string | null
  telefone_residencial?: string | null
  email?: string | null
  nome_instituicao_ensino_graduacao?: string | null
  ano_conclusao_graduacao?: string | null
  residencia_mec_cnrm?: string | null
  nivel_residencia?: string | null
  nome_hospital_mec?: string | null
  uf_prm?: string | null
  comprovante_endereco?: string | null
  carta_indicacao_2_membros?: string | null
  declaracao_hospital?: string | null
  diploma_medicina?: string | null
  certidao_quitacao_crm?: string | null
  certificado_conclusao_especializacao?: string | null
  declaro_verdadeiras?: string | null
  declaro_quite_SAERJ?: string | null
  pendencias_SAERJ?: string | null
  nome_presidente_regional?: string | null
  sigla_regional?: string | null
  tratamento?: string | null
}

export default function Aniversariantes({ data }: any) {
  const columnsBirthdays: GridColDef[] = [
    {
      field: 'id',
      headerName: 'id',
      disableColumnMenu: true,
      width: 80,
    },
    {
      field: 'categoria',
      headerName: 'Categoria',
      width: 150,
    },
    {
      field: 'situacao',
      headerName: 'Situação',
      width: 150,
    },
    {
      field: 'tratamento',
      headerName: 'Tratamento',
      width: 150,
    },
    {
      field: 'nome_completo',
      headerName: 'Nome',
      width: 250,
    },
    {
      field: 'email',
      headerName: 'E-mail',
      width: 250,
    },
    {
      field: 'data_nascimento',
      headerName: 'Data Nascimento',
      width: 200,
    },
  ]

  const [situacaoAssociado, setSituacaoAssociado] = useState([])
  const [categoriaAssociado, setCategoriaAssociado] = useState([])

  const getFiltros = async (filtro: string) => {
    let rtn
    try {
      const response = await api.get('/tabelas/get/' + filtro)
      rtn = response.data
    } catch (error) {
      console.log(error)
    }

    return rtn
  }

  useEffect(() => {
    const fetchFiltros = async () => {
      const categoriaData = await getFiltros('categoria')
      const situacaoData = await getFiltros('situacao')

      setCategoriaAssociado(categoriaData || [])
      setSituacaoAssociado(situacaoData || [])
    }

    fetchFiltros()
  }, [])

  return (
    <Container>
      <Box style={{ justifyContent: 'space-between' }}>
        <p>Aniversariantes</p>
        <BackPage backRoute="/" discartPageBack />
      </Box>

      <TableBirthdays
        columns={columnsBirthdays}
        rows={data}
        w="100%"
        situacaoAssociado={situacaoAssociado}
        categoriaAssociado={categoriaAssociado}
      />
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await prisma.associados.findMany({
      orderBy: [
        {
          data_nascimento: 'asc',
        },
      ],
    })

    const data: ResponseItem[] = []

    for (const item of response) {
      const obj: ResponseItem = {
        ...item,
        numero_proposta_SBA:
          item.numero_proposta_SBA !== null
            ? item.numero_proposta_SBA.toString()
            : null,
        data_nascimento:
          item.data_nascimento !== null
            ? item.data_nascimento
                .toISOString()
                .replace(/T.*/, '')
                .split('-')
                .reverse()
                .join('/')
            : null,
        data_inicio_especializacao:
          item.data_inicio_especializacao !== null
            ? item.data_inicio_especializacao
                .toISOString()
                .replace(/T.*/, '')
                .split('-')
                .reverse()
                .join('/')
            : null,
        data_previsao_conclusao:
          item.data_previsao_conclusao !== null
            ? item.data_previsao_conclusao
                .toISOString()
                .replace(/T.*/, '')
                .split('-')
                .reverse()
                .join('/')
            : null,
      }

      if (item.matricula_SAERJ != null) {
        const response_saerj = await prisma.adicionais_SAERJ.findFirst({
          where: {
            matricula_saerj: item.matricula_SAERJ?.toString(),
          },
        })
        const tratamento = response_saerj?.tratamento ?? ''
        obj['tratamento'] = tratamento
      }

      if (item.categoria != null) {
        try {
          const response_categoria = await prisma.tabelas.findUnique({
            where: {
              id: Number(item.categoria),
              ocorrencia_ativa: true,
            },
          })

          const categoria = response_categoria?.ocorrencia_tabela ?? ''
          obj['categoria'] = categoria
        } catch (error) {
          console.error('Erro ao obter categoria:', error)
        }
      }

      if (item.situacao != null) {
        try {
          const response_situacao = await prisma.tabelas.findUnique({
            where: {
              id: Number(item.situacao),
              ocorrencia_ativa: true,
            },
          })

          const situacao = response_situacao?.ocorrencia_tabela ?? ''
          obj['situacao'] = situacao
        } catch (error) {
          console.error('Erro ao obter categoria:', error)
        }
      }

      data.push(obj)
    }

    return {
      props: {
        data,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados da empresa:', error)
    return {
      props: {
        data: [],
      },
    }
  }
}
