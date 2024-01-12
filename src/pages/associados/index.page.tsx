import { Button } from '@/components/Button'
import { Container, Box, ContainerFormFilter } from './styled'
import { useRouter } from 'next/router'
import DataGridDemo from '@/components/TableList'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { useId } from '@/context'
import { GridColDef } from '@mui/x-data-grid'
import { toast } from 'react-toastify'
import Modal from '@/components/Modal'
import SelectNoComplete from '@/components/SelectNoComplete'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Suspense, useState } from 'react'
import { Loading } from './loading'

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
  const { selectedRowIds } = useId()
  const [List, setList] = useState(data)

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'id', width: 60 },
    {
      field: 'nome_completo',
      headerName: 'Nome Associado',
      width: 230,
    },
    {
      field: 'matricula_SAERJ',
      headerName: 'Matricula SAERJ',
      flex: 1,
    },
    {
      field: 'situacao',
      headerName: 'Situação',
      flex: 1,
    },
    {
      field: 'categoria',
      headerName: 'Categoria',
      flex: 1,
    },
    {
      field: 'pendencias_SAERJ',
      headerName: 'Pendencias Saerj',
      flex: 1,
    },
  ]

  const { register, watch } = useForm<SchemaFilter>()

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

    // Atualize o estado com os dados filtrados
    setList(filteredList)

    // Imprima a lista filtrada (opcional, apenas para fins de depuração)
    console.log(filteredList)
  }

  console.log(List)
  return (
    <Suspense fallback={<Loading />}>
      <Container>
        <p>Associados</p>
        <ContainerFormFilter>
          <Box style={{ justifyContent: 'start', alignItems: 'end' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                value="Todos"
                title="Situação"
                data={situacaoAssociado}
                {...register('situacao_filter')}
              />
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                value="Todos"
                title="Categoria"
                {...register('categoria_filter')}
                data={categoriaAssociado}
              />
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                value="Todos"
                title="Pendência Associado"
                {...register('pendenciaAssociado_filter')}
                data={dataSimNao}
              />
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
        </ContainerFormFilter>

        <DataGridDemo columns={columns} rows={List} w="100%" />

        <Box>
          <Button
            style={{ backgroundColor: '#4471C6' }}
            title="Visualizar"
            onClick={() => {
              if (selectedRowIds.length === 0) {
                toast.warn('Você não selecionou a empresa para visualizar')
              } else if (selectedRowIds.length >= 2) {
                toast.warn('Selecione apenas 1 empresa para visualizar')
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
                toast.warn('você não selecionou a empresa para atualizar')
              } else if (selectedRowIds.length >= 2) {
                toast.warn('selecione 1 associados para atualizar')
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
    </Suspense>
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
