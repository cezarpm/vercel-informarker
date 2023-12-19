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

  return (
    <Container>
      <p>
        <span>
          <Link href={'/tabelas'}>Tabelas</Link>
        </span>
        <CaretRight size={14} />
        <span>Tipo Empresa</span>
      </p>
      <Box>
        <DataGridDemo columns={columns} rows={data} w="26%" />
      </Box>
      <Box>
        <Button
          title="Cadastrar"
          style={{ backgroundColor: '#f67200' }}
          onClick={() => {
            router.push('/tabelas/tipoEmpresa/cadastro')
          }}
        />
        <Button
          title="Visualizar"
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('você não selecionou o tratamento para visualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 tratamento para visualizar')
            } else {
              router.push(`/tabelas/tipoEmpresa/visualizar/${selectedRowIds}`)
            }
          }}
        />
        <Button
          title="Atualizar"
          style={{ backgroundColor: '#6f9622' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('você não selecionou o tratamento para atualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 tratamento para atualizar')
            } else {
              router.push(`/tabelas/tipoEmpresa/atualizar/${selectedRowIds}`)
            }
          }}
        />

        <Modal
          title="Deletar"
          bgColor="#ff0000"
          routeDelete="/tipoEmpresa/delete"
          data={selectedRowIds}
          redirectRouter="/tabelas/tipoEmpresa"
        />
      </Box>
    </Container>
  )
}
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await prisma.tipoEmpresa.findMany()
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
