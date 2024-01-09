import React from 'react'
import { Button } from '@/components/Button'
import { Box, Container } from './styled'
import DataGridDemo from '@/components/TableList'
import { GridColDef } from '@mui/x-data-grid'
import { CaretRight } from 'phosphor-react'
import Modal from '@/components/Modal'
import { toast } from 'react-toastify'

import Link from 'next/link'
import { useRouter } from 'next/router'
import { useId } from '@/context'
import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

export default function ChapasList({ data }: any) {
  const { selectedRowIds } = useId()
  const router = useRouter()
  const columns: GridColDef[] = [
    { field: 'titulo_chapa', headerName: 'Titulo da chapa', flex: 1 },
    {
      field: 'nome_presidente',
      headerName: 'Presidente da chapa',
      flex: 1,
    },
    {
      field: 'data_formacao',
      headerName: 'Data de formacao',
      flex: 1,
    },
    {
      field: 'pessoas_compoe',
      headerName: 'Pessoas que compoe a chapa',
      flex: 1,
    },
  ]

  const dataFormattedDate = data.map((item: any) => ({
    ...item,
    data_formacao: format(new Date(item.data_formacao), 'dd/MM/yyyy'),
  }))

  return (
    <Container>
      <p>
        <span>Chapas</span>
      </p>
      <Box>
        <DataGridDemo columns={columns} rows={dataFormattedDate} w="90%" />
      </Box>
      <Box>
        <Button
          title="Cadastrar"
          style={{ backgroundColor: '#f67200' }}
          onClick={() => {
            router.push('/chapas/cadastro')
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
              router.push(`/chapas/visualizar/${selectedRowIds}`)
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
              router.push(`/chapas/atualizar/${selectedRowIds}`)
            }
          }}
        />

        <Modal
          title="Deletar"
          bgColor="#ff0000"
          routeDelete="/chapas/delete"
          data={selectedRowIds}
          redirectRouter="/chapas"
        />
      </Box>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await prisma.chapas.findMany()

    const data = response.map((item) => {
      return {
        id: item.id,
        titulo_chapa: item.titulo_chapa,
        nome_presidente: item.nome_presidente,
        data_formacao: item.data_formacao.toString(),
        pessoas_compoe: item.pessoas_compoe,
      }
    })

    return {
      props: {
        data,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados das diretorias:', error)
    return {
      props: {
        data: [],
      },
    }
  }
}
