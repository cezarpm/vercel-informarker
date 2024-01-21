import React from 'react'
import { Button } from '@/components/Button'
import { Box, Container } from './styled'
import DataGridDemo from '@/components/TableList'
import { GridColDef } from '@mui/x-data-grid'

import Modal from '@/components/Modal'
import { toast } from 'react-toastify'

import { useRouter } from 'next/router'
import { useContextCustom } from '@/context'
import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'

export default function DiretoriasList({ data }: any) {
  const { selectedRowIds } = useContextCustom()
  const router = useRouter()
  const columns: GridColDef[] = [
    { field: 'numero_eleicao', headerName: 'Numero Eleição', flex: 1 },
    {
      field: 'cod_chapa',
      headerName: 'Código Chapa',
      flex: 1,
    },
    {
      field: 'matricula_saerj',
      headerName: 'Matricula SAERJ',
      flex: 1,
    },
    {
      field: 'candidato_cargo',
      headerName: 'Cargo candidato',
      flex: 1,
    },
  ]

  return (
    <Container>
      <p>
        <span>Diretorias</span>
      </p>
      <Box>
        <DataGridDemo columns={columns} rows={data} w="90%" />
      </Box>
      <Box>

        <Button
          title="Visualizar"
          style={{ backgroundColor: '#4471C6' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('você não selecionou o cargo para visualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 cargo para visualizar')
            } else {
              router.push(`/diretorias/visualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Atualizar"
          style={{ backgroundColor: '#528035' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('você não selecionou o cargo para atualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 cargo para atualizar')
            } else {
              router.push(`/diretorias/atualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Incluir"
          style={{ backgroundColor: '#BE0000' }}
          onClick={() => {
            router.push('/diretorias/cadastro')
          }}
        />




        <Modal
          title="Excluir"
          bgColor="#ff0000"
          routeDelete="/diretorias/delete"
          data={selectedRowIds}
          redirectRouter="/diretorias"
        />
      </Box>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await prisma.diretorias.findMany()

    const data = response.map((item) => {
      return {
        id: item.id,
        numero_eleicao: item.numero_eleicao,
        cod_chapa: item.cod_chapa,
        matricula_saerj: item.matricula_saerj,
        candidato_cargo: item.candidato_cargo,
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
