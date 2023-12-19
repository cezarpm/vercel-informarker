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
import { CaretRight } from 'phosphor-react'
import Link from 'next/link'
import React from 'react'

export default function CargosList({ data }: any) {
  const { selectedRowIds } = useId()
  const router = useRouter()

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'name',
      headerName: 'Nome',
      flex: 1,
    },
  ]

  // PRECISO ATUALIZAR A LISTA PRO USUARIO VER O ITEM QUE FOI DELETADO SUMIR
  // SE EXISTIR O ID=4 E O ID=4 FOR DELETADO, AO DELETAR ATUALIZAR A LISTA PARA NÃO MOSTRAR ELE!

  // console.log(`resgatado com sucesso! ${selectedRowIds}`)
  return (
    <Container>
      <p>
        <span>
          <Link href={'/tabelas'}>Tabelas</Link>
        </span>
        <CaretRight size={14} />
        <span>Categorias</span>
      </p>
      <Box>
        <DataGridDemo columns={columns} rows={data} w="26%" />
      </Box>
      <Box>
        <Button
          title="Cadastrar"
          style={{ backgroundColor: '#f67200' }}
          onClick={() => {
            router.push('/tabelas/categoria/cadastro')
          }}
        />
        <Button
          title="Visualizar"
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('você não selecionou o cargo para visualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 cargo para visualizar')
            } else {
              router.push(`/tabelas/categoria/visualizar/${selectedRowIds}`)
            }
          }}
        />
        <Button
          title="Atualizar"
          style={{ backgroundColor: '#6f9622' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('você não selecionou o cargo para atualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 cargo para atualizar')
            } else {
              router.push(`/tabelas/categoria/atualizar/${selectedRowIds}`)
            }
          }}
        />

        <Modal
          title="Deletar"
          bgColor="#ff0000"
          routeDelete="/categorias/delete"
          data={selectedRowIds}
          redirectRouter="/tabelas/categoria"
        />
      </Box>
    </Container>
  )
}
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await prisma.categorias.findMany()
    const data = response.map((item) => {
      return {
        id: item.id,
        name: item.name,
      }
    })
    return {
      props: {
        data,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados dos cargos:', error)
    return {
      props: {
        data: [],
      },
    }
  }
}
