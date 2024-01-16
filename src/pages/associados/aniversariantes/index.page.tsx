/* eslint-disable camelcase */
import { Box, Container } from './styled'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { GridColDef } from '@mui/x-data-grid'
import TableBirthdays from '@/components/TableBirthdays'
import { ArrowBendDownLeft } from 'phosphor-react'
import Link from 'next/link'

export default function Aniversariantes({ data }: any) {
  const columnsBirthdays: GridColDef[] = [
    {
      field: 'id',
      headerName: 'id',
      disableColumnMenu: true,
      width: 80,
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

  return (
    <Container>
      <Box style={{ justifyContent: 'space-between' }}>
        <p>Aniversariantes</p>
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            fontFamily: 'Roboto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#000',
          }}
        >
          <ArrowBendDownLeft size={32} />
          Retornar
        </Link>
      </Box>

      <TableBirthdays columns={columnsBirthdays} rows={data} w="100%" />
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

    const data = await Promise.all(
      response.map(async (item) => {
        let tratamento = ''
        if (item.matricula_SAERJ != null) {
          const response_saerj = await prisma.adicionais_SAERJ.findFirst({
            where: {
              matricula_saerj: item.matricula_SAERJ?.toString(),
            },
          })
          tratamento = response_saerj?.tratamento ?? ''
        }

        return {
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
          tratamento,
        }
      }),
    )

    console.log('AQUI', data)
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
