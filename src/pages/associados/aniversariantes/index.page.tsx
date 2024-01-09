import { Container } from './styled'
import { useRouter } from 'next/router'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { useId } from '@/context'
import { GridColDef } from '@mui/x-data-grid'
import TableBirthdays from '@/components/TableBirthdays'

export default function AssociadoList({ data }: any) {

  const router = useRouter()
  const { selectedRowIds } = useId()

  const columnsBirthdays: GridColDef[] = [
    {
      field: 'id',
      headerName: 'id',
      disableColumnMenu: true,
      width: 80,
    },
    {
      field: 'nome_profissional',
      headerName: 'Tratamento',
      width: 200,
    },
    {
      field: 'nome_completo',
      headerName: 'Nome',
      width: 200,
    },
    {
      field: 'email',
      headerName: 'E-mail',
      width: 200,
    },
    {
      field: 'data_nascimento',
      headerName: 'Data Nascimento',
      width: 200,
    }
  ]

  
  return (
    <Container>
      <h3>Aniversariantes</h3>

      <TableBirthdays columns={columnsBirthdays} rows={data} w="100%"/>
      
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
      ]
    });

    const data = response.map((item) => {
      return {
        ...item,
        // Convertendo o campo 'numero_proposta_SBA' para string
        numero_proposta_SBA: item.numero_proposta_SBA !== null ? item.numero_proposta_SBA.toString() : null,
      }
    });

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
