import { Button } from '@/components/Button'
import { Container, Box } from './styled'
import { useRouter } from 'next/router'
import DataGridDemo from '@/components/TableList'
import { useId } from '@/context'
import { GridColDef } from '@mui/x-data-grid'
import { toast } from 'react-toastify'
import Modal from '@/components/Modal'
import { GetServerSideProps } from 'next'
import Avatar from '@mui/material/Avatar'
import { AvatarGroup } from '@mui/material'
import { api } from '@/lib/axios'
import { prisma } from '@/lib/prisma'

export default function VotacaoList({ data }: any) {
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
      field: 'nome_chapa',
      headerName: 'Nome da chapa',
      width: 150,
    },
    {
      field: 'membros_chapa',
      headerName: 'Membros da chapa',
      width: 200,
      renderCell: ({ row }) => {
        return (
          <AvatarGroup>
            {row.membros_chapa.map((membro: any, index: number) => (
              <Avatar
                key={index}
                alt="Remy Sharp"
                src="/static/images/avatar/1.jpg"
              />
            ))}
          </AvatarGroup>
        )
      },
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
              router.push(`/votacao/visualizar/${selectedRowIds}`)
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
              router.push(`/votacao/atualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Incluir"
          style={{ backgroundColor: '#ED7D31' }}
          onClick={() => {
            router.push('/votacao/cadastro')
          }}
        />

        <Modal
          title="Excluir"
          bgColor="#BE0000"
          routeDelete="/votacao/delete/"
          data={selectedRowIds}
          redirectRouter="/votacao/lista"
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
    const data = await prisma.chapas.findMany()

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
