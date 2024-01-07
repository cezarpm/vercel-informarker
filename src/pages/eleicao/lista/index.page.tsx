import { Button } from '@/components/Button'
import { Container, Box } from './styled'
import { useRouter } from 'next/router'
import DataGridDemo from '@/components/TableList'
import { useId } from '@/context'
import { GridColDef } from '@mui/x-data-grid'
import { toast } from 'react-toastify'
import Modal from '@/components/Modal'
import { GetServerSideProps } from 'next'
import { Typography } from '@mui/material'
import { prisma } from '@/lib/prisma'

export default function eleicaoList({ data }: any) {
  const router = useRouter()
  const { selectedRowIds } = useId()

  console.log(data)

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'id',
      disableColumnMenu: true,
      width: 80,
    },
    {
      field: 'matricula_saerj',
      headerName: 'Nome da chapa',
      width: 150,
    },
    {
      field: 'data_votacao_inicio',
      headerName: 'Data de inicio',
      width: 150,
      renderCell: (params) => {
        return (
          <Typography>
            {new Date(params.value).toLocaleDateString()}
          </Typography>
        )
      }
    },

    {
      field: 'data_votacao_fim',
      headerName: 'Data do fim da votação',
      width: 150,
      renderCell: (params) => {
        return (
          <Typography>
            {new Date(params.value).toLocaleDateString()}
          </Typography>
        )
      }
    },

    {
      field: 'status',
      headerName: 'Estado da votação',
      disableColumnMenu: true,
      width: 80,
    },

  ]

  return (
    <Container>
      <p>Chapas</p>

      <DataGridDemo columns={columns} rows={data} w="100%" />

      <Box>
        <Button
          style={{ backgroundColor: '#4471C6' }}
          title="Visualizar"
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('você não selecionou a chapa para visualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 chapa para visualizar')
            } else {
              router.push(`/eleicao/visualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Atualizar"
          style={{ backgroundColor: '#528035' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('você não selecionou a chapa para atualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 chapa para atualizar')
            } else {
              router.push(`/eleicao/atualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Incluir"
          style={{ backgroundColor: '#ED7D31' }}
          onClick={() => {
            router.push('/eleicao/cadastro')
          }}
        />

        <Modal
          title="Excluir"
          bgColor="#BE0000"
          routeDelete="/eleicao/delete/"
          data={selectedRowIds}
          redirectRouter="/eleicao/lista"
        />

        {/* <Button
          title="Retornar"
          style={{ backgroundColor: '#b34db2' }}
          onClick={() => {
            router.push('/')
          }}
        /> */}
      </Box>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const data = await prisma.votacao.findMany()

    return {
      props: {
        data,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados da chapa:', error)
    return {
      props: {
        data: [],
        dataTipochapa: [],
      },
    }
  }
}
