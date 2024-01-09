import DataGridDemo from '@/components/TableList'
import { Box, Container } from './styled'
import { GetStaticProps } from 'next'
import { prisma } from '@/lib/prisma'
import { GridColDef } from '@mui/x-data-grid'
import { useId } from '@/context'
import { Button } from '@/components/Button'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

export default function Logs({ data }: any) {
  console.log(data)
  const { selectedRowIds } = useId()
  const router = useRouter()

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'id',
      disableColumnMenu: true,
    },
    {
      field: 'cod_log',
      headerName: 'Código log',
      flex: 1,
    },
    {
      field: 'ocorrencia_log',
      headerName: 'Ocorrencia log',
      flex: 1,
    },
    {
      field: 'data_hora_log',
      headerName: 'Data Hora Log',
      flex: 1,
      disableColumnMenu: true,
    },
  ]
  return (
    <Container>
      <p>Logs</p>

      <Box>
        <DataGridDemo columns={columns} rows={data} w={'50%'} />
      </Box>
      <Box>
        <Button
          style={{ backgroundColor: '#4471C6' }}
          title="Visualizar"
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('você não selecionou a empresa para visualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 empresa para visualizar')
            } else {
              router.push(`/logs/visualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Retornar"
          style={{ backgroundColor: '#b34db2' }}
          onClick={() => {
            router.push('/')
          }}
        />
      </Box>
    </Container>
  )
}
export const getStaticProps: GetStaticProps = async () => {
  try {
    const response = await prisma.logs.findMany({
      orderBy: {
        id: 'desc',
      },
    })

    const convertedData = response.map((log) => ({
      ...log,
      data_hora_log: log.data_hora_log.toISOString(),
    }))

    return {
      props: {
        data: convertedData,
      },
    }
  } catch (error) {
    console.error(error, 'Erro ao buscar Logs no Banco')
    return {
      props: {
        data: [],
      },
    }
  } finally {
    await prisma.$disconnect()
  }
}
