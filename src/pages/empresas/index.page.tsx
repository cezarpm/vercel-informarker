import { Button } from '@/components/Button'
import { Container, Box } from './styled'
import { useRouter } from 'next/router'
import DataGridDemo from '@/components/TableList'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { useId } from '@/context'
import { GridColDef } from '@mui/x-data-grid'
import { toast } from 'react-toastify'
import Modal from '@/components/Modal'
export default function EmpresaList({ data }: any) {
  const router = useRouter()
  const { selectedRowIds } = useId()
  // console.log(selectedRowIds)
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'tipo_empresa',
      headerName: 'Tipo Empresa',
      flex: 1,
    },
    {
      field: 'razao_social',
      headerName: 'Razão Social',
      flex: 1,
      editable: true,
    },
    {
      field: 'nome_fantasia',
      headerName: 'Nome Fantasia',
      flex: 1,
      editable: true,
    },
    {
      field: 'cnpj',
      headerName: 'Cnpj',
      flex: 1,
      editable: true,
      // valueGetter: (params: GridValueGetterParams) =>
      //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'cidade',
      headerName: 'Cidade',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      flex: 1,
      // valueGetter: (params: GridValueGetterParams) =>
      //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'bairro',
      headerName: 'Bairro',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      flex: 1,
      // valueGetter: (params: GridValueGetterParams) =>
      //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'uf',
      headerName: 'Uf',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      flex: 1,
      // valueGetter: (params: GridValueGetterParams) =>
      //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },

    {
      field: 'nome_contato_primario',
      headerName: 'Nome Contato Primário',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      flex: 1,
      // valueGetter: (params: GridValueGetterParams) =>
      //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'telefone_contato_primario',
      headerName: 'Telefone',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      flex: 1,
      // valueGetter: (params: GridValueGetterParams) =>
      //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'email_contato_primario',
      headerName: 'Email Contato Primário',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      flex: 1,
      // valueGetter: (params: GridValueGetterParams) =>
      //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
  ]

  // PRECISO ATUALIZAR A LISTA PRO USUARIO VER O ITEM QUE FOI DELETADO SUMIR
  // SE EXISTIR O ID=4 E O ID=4 FOR DELETADO, AO DELETAR ATUALIZAR A LISTA PARA NÃO MOSTRAR ELE!

  // console.log(`resgatado com sucesso! ${selectedRowIds}`)
  return (
    <Container>
      <p>Empresas</p>
      <DataGridDemo columns={columns} rows={data} w="100%" />
      <Box>
        <Button
          title="Cadastrar"
          style={{ backgroundColor: '#f67200' }}
          onClick={() => {
            router.push('/empresas/cadastro')
          }}
        />
        <Button
          title="Visualizar"
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('você não selecionou a empresa para visualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 empresa para visualizar')
            } else {
              router.push(`/empresas/visualizar/${selectedRowIds}`)
            }
          }}
        />
        <Button
          title="Atualizar"
          style={{ backgroundColor: '#6f9622' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('você não selecionou a empresa para atualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 empresa para atualizar')
            } else {
              router.push(`/empresas/atualizar/${selectedRowIds}`)
            }
          }}
        />

        <Modal
          title="Deletar"
          bgColor="#ff0000"
          routeDelete="/empresa/delete/"
          data={selectedRowIds}
          redirectRouter="/empresas"
        />
      </Box>
    </Container>
  )
}
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await prisma.empresa.findMany()
    const data = response.map((item) => {
      return {
        id: item.id,
        tipo_empresa: item.tipo_empresa,
        razao_social: item.razao_social,
        nome_fantasia: item.nome_fantasia,
        cnpj: item.cnpj,
        cidade: item.cidade,
        bairro: item.bairro,
        uf: item.uf,
        nome_contato_primario: item.nome_contato_primario,
        telefone_contato_primario: item.telefone_contato_primario,
        email_contato_primario: item.email_contato_primario,
      }
    })
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
