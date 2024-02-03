import { Button } from '@/components/Button'
import { Container, Box, ContainerFormFilter } from './styled'
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
import { useEffect, useState } from 'react'
import { BackPage } from '@/components/BackPage'
import CircularProgress from '@mui/material/CircularProgress'
import { Loading } from '@/components/Loading'

const shemaFilter = z.object({
  categoria_filter: z.string(),
  pendenciaAssociado_filter: z.string(),
  situacao_filter: z.string(),
})

type SchemaFilter = z.infer<typeof shemaFilter>

export default function AssociadoList({
  data,
  situacaoAssociado,
  categoriaAssociado,
}: any) {
  const router = useRouter()
  const { selectedRowIds } = useContextCustom()
  const [List, setList] = useState(data)
  const [filterSelect, setFilterSelect] = useState({
    situacao_filter: 'Todos',
    categoria_filter: 'Todos',
    pendenciaAssociado_filter: 'Todos',
  })
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'id', width: 60 },
    {
      field: 'nome_completo',
      headerName: 'Nome Associado',
      flex: 0.4,
    },
    {
      field: 'matricula_SAERJ',
      headerName: 'Matricula SAERJ',
      width: 177,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'situacao',
      headerName: 'Situação',
      width: 170,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'categoria',
      headerName: 'Categoria',
      width: 150,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'pendencias_SAERJ',
      headerName: 'Pendencias Saerj',
      flex: 0.1,
      align: 'left',
      headerAlign: 'left',
    },
  ]

  const { register, watch, setValue } = useForm<SchemaFilter>()

  const dataSimNao = [
    {
      id: 1,
      ocorrencia_tabela: 'sim',
    },
    {
      id: 2,
      ocorrencia_tabela: 'não',
    },
  ]

  function BuscarFiltro() {
    const situacaoFilter = watch('situacao_filter')
    const categoriaFilter = watch('categoria_filter')
    const pendenciaAssociadoFilter = watch('pendenciaAssociado_filter')

    // Inicialize a lista com os dados originais
    let filteredList = data

    const filterSelected = {
      situacao_filter: situacaoFilter,
      categoria_filter: categoriaFilter,
      pendenciaAssociado_filter: pendenciaAssociadoFilter,
    }
    // Realize a filtragem com base nos valores selecionados
    if (situacaoFilter !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        const situacaoMatch =
          situacaoFilter === 'Todos' || item.situacao === situacaoFilter
        return situacaoMatch
      })
    }

    if (categoriaFilter && categoriaFilter !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        return item.categoria === categoriaFilter
      })
    }

    if (pendenciaAssociadoFilter && pendenciaAssociadoFilter !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        return item.pendenciaAssociado === pendenciaAssociadoFilter
      })
    }

    localStorage.setItem('@valuesSelected', JSON.stringify(filterSelected))
    localStorage.setItem('@filtro', JSON.stringify(filteredList))
    setList(filteredList)

    // Imprima a lista filtrada (opcional, apenas para fins de depuração)
    console.log(filteredList)
  }

  function valuesDefaultFilter() {
    setValue('situacao_filter', 'Todos')
    setValue('categoria_filter', 'Todos')
    setValue('pendenciaAssociado_filter', 'Todos')
  }

  useEffect(() => {
    setList(data)
    const getFilterList = localStorage.getItem('@filtro')
    if (getFilterList !== null) {
      setList(JSON.parse(getFilterList))
    } else {
      setList(data)
    }

    const getFilterSelected = localStorage.getItem('@valuesSelected')
    if (getFilterSelected !== null) {
      const getItemsFilter = JSON.parse(getFilterSelected)
      setFilterSelect(getItemsFilter)
      setValue('situacao_filter', getItemsFilter.situacao_filter)
      setValue('categoria_filter', getItemsFilter.categoria_filter)
      setValue(
        'pendenciaAssociado_filter',
        getItemsFilter.pendenciaAssociado_filter,
      )
      BuscarFiltro()
    } else {
      valuesDefaultFilter()
    }
  }, [data])

  const isDataSituacao = situacaoAssociado?.map((item: any) => {
    return {
      ...item,
    }
  })

  const objTodos = {
    id: 0,
    codigo_tabela: 'Situação_Associado',
    ocorrencia_tabela: 'Todos',
  }
  isDataSituacao.unshift(objTodos)
  const objDataSimNaoTodos = {
    id: 0,
    ocorrencia_tabela: 'Todos',
  }

  const isDataSimNao = dataSimNao?.map((item: any) => {
    return {
      ...item,
    }
  })
  isDataSimNao.unshift(objDataSimNaoTodos)

  const isDataCategoria = situacaoAssociado?.map((item: any) => {
    return {
      ...item,
    }
  })

  const objTodosCategoria = {
    id: 0,
    codigo_tabela: 'Categoria_Associado',
    ocorrencia_tabela: 'Todos',
  }
  isDataCategoria.unshift(objTodosCategoria)

  return (
    <Container>

      <p>Associados</p>
      <ContainerFormFilter>
        <Box style={{ justifyContent: 'start', alignItems: 'end' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {filterSelect.situacao_filter &&
              filterSelect.situacao_filter !== 'Todos' ? (
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                value={`${filterSelect.situacao_filter}`}
                title="Situação"
                data={isDataSituacao}
                {...register('situacao_filter')}
              />
            ) : null}

            {filterSelect.situacao_filter &&
              filterSelect.situacao_filter === 'Todos' ? (
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                value="Todos"
                title="Situação"
                data={situacaoAssociado}
                {...register('situacao_filter')}
              />
            ) : null}

            {filterSelect.categoria_filter &&
              filterSelect.categoria_filter !== 'Todos' ? (
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                value={`${filterSelect.categoria_filter}`}
                title="Categoria"
                data={isDataCategoria}
                {...register('categoria_filter')}
              />
            ) : null}

            {filterSelect.categoria_filter &&
              filterSelect.categoria_filter === 'Todos' ? (
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                value="Todos"
                title="Categoria"
                {...register('categoria_filter')}
                data={categoriaAssociado}
              />
            ) : null}

            {filterSelect.pendenciaAssociado_filter &&
              filterSelect.pendenciaAssociado_filter !== 'Todos' ? (
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                value={`${filterSelect.pendenciaAssociado_filter}`}
                title="Pendência Associado"
                data={isDataSimNao}
                {...register('pendenciaAssociado_filter')}
              />
            ) : null}

            {filterSelect.pendenciaAssociado_filter &&
              filterSelect.pendenciaAssociado_filter === 'Todos' ? (
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                value="Todos"
                title="Pendência Associado"
                {...register('pendenciaAssociado_filter')}
                data={dataSimNao}
              />
            ) : null}
          </div>

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
        <BackPage backRoute="/" discartPageBack />
      </ContainerFormFilter>

      <DataGridDemo columns={columns} rows={List} w="100%" />

      <Box>
        <Button
          style={{ backgroundColor: '#4471C6' }}
          title="Visualizar"
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('Você não selecionou nenhum associado para visualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('Selecione apenas 1 associado para visualizar')
            } else {
              router.push(`/associados/visualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Atualizar"
          style={{ backgroundColor: '#528035' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('Você não selecionou nenhum associado para atualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('Selecione 1 associado para atualizar')
            } else {
              router.push(`/associados/atualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Incluir"
          style={{ backgroundColor: '#ED7D31' }}
          onClick={() => {
            router.push('/associados/cadastro')
          }}
        />

        <Modal
          title="Excluir"
          bgColor="#BE0000"
          routeDelete="/associados/delete/"
          data={selectedRowIds}
          redirectRouter="/associados"
        />
      </Box>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const notViewId = 1
    const response = await prisma.associados.findMany({
      orderBy: {
        id: 'desc',
      },
      where: {
        id: {
          not: notViewId,
        },
      },
    })
    const data = response.map((item) => {
      return {
        id: item.id,
        situacao: item.situacao,
        categoria: item.categoria,
        pendencias_SAERJ: item.pendencias_SAERJ,
        matricula_SAERJ: item.matricula_SAERJ,
        nome_completo: item.nome_completo,
      }
    })

    const situacaoAssociado = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Situação_Associado',
      },
    })

    const categoriaAssociado = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Categoria_Associado',
      },
    })

    return {
      props: {
        data,
        situacaoAssociado,
        categoriaAssociado,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados da empresa:', error)
    return {
      props: {
        data: [],
        situacaoAssociado: [],
        categoriaAssociado: [],
      },
    }
  }
}
