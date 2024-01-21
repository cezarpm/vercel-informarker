import { Button } from '@/components/Button'
import { Container, Box } from './styled'
import { useRouter } from 'next/router'
import DataGridDemo from '@/components/TableList'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { useContextCustom } from '@/context'
import { GridColDef } from '@mui/x-data-grid'
import { toast } from 'react-toastify'
import Modal from '@/components/Modal'
import SelectNoComplete from '@/components/SelectNoComplete'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { BackPage } from '@/components/BackPage'
import { useEffect, useState } from 'react'

const shemaFilter = z.object({
  codigo_tabela: z.string(),
})

type SchemaFilter = z.infer<typeof shemaFilter>
export default function EmpresaList({ data }: any) {
  const { selectedRowIds } = useContextCustom()
  const [list, setList] = useState(data)
  const router = useRouter()
  const { register, watch } = useForm<SchemaFilter>()
  console.log(selectedRowIds)

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'codigo_tabela',
      headerName: 'Código tabela',
      width: 170,
    },
    {
      field: 'ocorrencia_tabela',
      headerName: 'Ocorrencia',
      width: 220,
      editable: true,
    },
    {
      field: 'complemento_ocorrencia_selecao',
      headerName: 'Complemento',
      flex: 0.2,
      editable: true,
    },

    {
      field: 'ocorrencia_ativa',
      headerName: 'Ativo',
      width: 110,
      editable: true,
    },
  ]

  const codigosTabelaUnicos = new Set()

  const resultadoCodigoTabelasUnicos = data.filter((item: any) => {
    if (!codigosTabelaUnicos.has(item.codigo_tabela)) {
      codigosTabelaUnicos.add(item.codigo_tabela)
      return true
    }
    return false
  })

  const newDescriptionKeys = resultadoCodigoTabelasUnicos.map((item: any) => {
    return {
      ocorrencia_tabela: item.codigo_tabela,
    }
  })

  function BuscarFiltro() {
    // Inicialize a lista com os dados originais
    let filteredList = data
    const CodigoPesquisado = watch('codigo_tabela')

    console.log(CodigoPesquisado)

    // Realize a filtragem com base nos valores selecionados
    if (CodigoPesquisado !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        const situacaoMatch =
          CodigoPesquisado === 'Todos' ||
          item.codigo_tabela === CodigoPesquisado
        return situacaoMatch
      })
    }
    console.log(filteredList)
    // Atualize o estado com os dados filtrados
    setList(filteredList)
  }

  useEffect(() => {
    setList(data)
  }, [data])
  return (
    <Container>
      <BackPage backRoute="/" discartPageBack />
      <p>Tabelas</p>
      <Box
        style={{
          marginTop: '0.5rem',
          justifyContent: 'flex-start',
          alignItems: 'end',
          width: '20%',
        }}
      >
        <SelectNoComplete
          p="0px 0px 0px 5px"
          title="Código Tabela"
          value="Todos"
          {...register('codigo_tabela')}
          data={newDescriptionKeys}
        />
        <Button
          style={{
            margin: '0px',
            fontSize: '12px',
            width: '5rem',
            border: 'solid 1px',
            padding: '0.5rem',
          }}
          title="Buscar"
          onClick={BuscarFiltro}
        />
      </Box>
      <DataGridDemo columns={columns} rows={list} w="100%" />
      <Box>
        <Button
          style={{ backgroundColor: '#4471C6' }}
          title="Visualizar"
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('você não selecionou nenhum item para visualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 item para visualizar')
            } else {
              router.push(`/tabelas/visualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Atualizar"
          style={{ backgroundColor: '#528035' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('você não selecionou nenhum para atualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 item para atualizar')
            } else {
              router.push(`/tabelas/atualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Incluir"
          style={{ backgroundColor: '#ED7D31' }}
          onClick={() => {
            router.push('/tabelas/cadastro')
          }}
        />

        <Modal
          title="Excluir"
          bgColor="#BE0002"
          routeDelete="/tabelas/delete/"
          data={selectedRowIds}
          redirectRouter="tabelas"
        />
      </Box>
    </Container>
  )
}
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await prisma.tabelas.findMany()
    const data = response.map((item) => {
      return {
        id: item.id,
        codigo_tabela: item.codigo_tabela,
        ocorrencia_tabela: item.ocorrencia_tabela,
        complemento_ocorrencia_selecao: item.complemento_ocorrencia_selecao,
        ocorrencia_ativa: item.ocorrencia_ativa ? 'sim' : 'não',
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
