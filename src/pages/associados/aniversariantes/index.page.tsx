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

    const data = await Promise.all(response.map(async (item) => {
      var tratamento = "";
      if (item.matricula_SAERJ != null) {
        const response_saerj = await prisma.adicionais_SAERJ.findFirst({
          where: {
            matricula_saerj: (item.matricula_SAERJ)?.toString(),
          },
        });
        tratamento = response_saerj?.tratamento ?? "";
      }

      return {
        ...item,
        numero_proposta_SBA: item.numero_proposta_SBA !== null ? item.numero_proposta_SBA.toString() : null,
        data_nascimento: item.data_nascimento !== null ? item.data_nascimento.toISOString().replace(/T.*/, '').split('-').reverse().join('/') : null,
        data_inicio_especializacao: item.data_inicio_especializacao !== null ? item.data_inicio_especializacao.toISOString().replace(/T.*/, '').split('-').reverse().join('/') : null,
        data_previsao_conclusao: item.data_previsao_conclusao !== null ? item.data_previsao_conclusao.toISOString().replace(/T.*/, '').split('-').reverse().join('/') : null,
        tratamento: tratamento,
      };
    }));

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
