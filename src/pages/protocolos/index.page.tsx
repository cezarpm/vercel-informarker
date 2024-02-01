/* eslint-disable eqeqeq */
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
import { useEffect, useState } from 'react'
import { BackPage } from '../../components/BackPage'
import SelectNoComplete from '@/components/SelectNoComplete'
import { z } from 'zod'
import { useForm } from 'react-hook-form'

const shemaFilter = z.object({
  tipo_protocolo_filter: z.string(),

  data_recebimento_filter: z.string(),
  data_recebimento_filter_de: z.string(),
  data_recebimento_filter_ate: z.string(),

  data_envio_filter: z.string(),
  data_envio_filter_de: z.string(),
  data_envio_filter_ate: z.string(),

  meio_recebimento_filter: z.string(),
  meio_envio_filter: z.string(),

  data_encerramento_filter: z.string(),
  usuario_encerramento_filter: z.string(),
})

type SchemaFilter = z.infer<typeof shemaFilter>
export default function ProtocoloList({
  data,
  tipoProtocol,
  meioProtocol,
}: any) {
  const router = useRouter()
  const { selectedRowIds } = useContextCustom()
  const [list, setList] = useState(data)
  const [filterSelect, setFilterSelect] = useState({
    tipo_protocolo_filter: 'Todos',
    data_recebimento_filter: 'Todos',
    data_envio_filter: 'Todos',
    meio_recebimento_filter: 'Todos',
    meio_envio_filter: 'Todos',
    data_encerramento_filter: 'Todos',
    usuario_encerramento_filter: 'Todos',
  })
  // console.log(selectedRowIds)
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'num_protocolo',
      headerName: 'Protocolo',
      width: 135,
      disableColumnMenu: true,
    },
    {
      field: 'tipo_protocolo',
      headerName: 'Tipo Protocolo',
      width: 150,
      disableColumnMenu: true,
    },
    {
      field: 'assunto_protocolo',
      headerName: 'Assunto',
      width: 500,
      disableColumnMenu: true,
    },
    {
      field: 'data_recebimento',
      headerName: 'Recebimento',
      width: 160,
      disableColumnMenu: true,
    },
    {
      field: 'data_envio',
      headerName: 'Envio',
      width: 120,
      disableColumnMenu: true,
    },
    {
      field: 'meio_recebimento',
      headerName: 'Meio Recebimento',
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: 'meio_envio',
      headerName: 'Meio Envio',
      width: 180,
      disableColumnMenu: true,
    },
    {
      field: 'quem_redigiu_documento_a_ser_enviado',
      headerName: 'Quem redigiu o documento',
      width: 210,
      disableColumnMenu: true,
    },
    {
      field: 'entregue_em_maos',
      headerName: 'Entregue em Mãos',
      width: 180,
      disableColumnMenu: true,
    },
    {
      field: 'obrigatoria_resp_receb',
      headerName: 'Requer resposta?',
      width: 180,
      disableColumnMenu: true,
    },
    {
      field: 'anexos',
      headerName: 'Anexos',
      width: 180,
      disableColumnMenu: true,
    },
    {
      field: 'data_encerramento_protocolo',
      headerName: 'Data encerramento',
      width: 180,
      disableColumnMenu: true,
    },
    {
      field: 'usuario_encerramento_protocolo',
      headerName: 'Usuário Encerramento',
      width: 180,
      disableColumnMenu: true,
    },
  ]

  const { register, watch, setValue } = useForm<SchemaFilter>()
  function BuscarFiltro() {
    // Inicialize a lista com os dados originais
    let filteredList: any = data
    const protocoloFilter = watch('tipo_protocolo_filter')
    const recebimentoFilter = watch('data_recebimento_filter')
    const envioFilter = watch('data_envio_filter')
    const meioRecebidoFilter = watch('meio_recebimento_filter')
    const meioEvnioFilter = watch('meio_envio_filter')
    const dataEncerramentoFilter = watch('data_encerramento_filter')
    const usuarioEncerramentoFilter = watch('usuario_encerramento_filter')
    const filterSelected = {
      tipo_protocolo_filter: protocoloFilter,
      data_recebimento_filter: recebimentoFilter,
      data_envio_filter: envioFilter,
      meio_recebimento_filter: meioRecebidoFilter,
      meio_envio_filter: meioEvnioFilter,
      data_encerramento_filter: dataEncerramentoFilter,
      usuario_encerramento_filter: usuarioEncerramentoFilter,
    }
    if (protocoloFilter !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        const situacaoMatch =
          protocoloFilter === 'Todos' || item.tipo_protocolo === protocoloFilter
        return situacaoMatch
      })
    }
    if (recebimentoFilter && recebimentoFilter !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        return item.data_recebimento === recebimentoFilter
      })
    }

    if (envioFilter && envioFilter !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        return item.data_envio === envioFilter
      })
    }

    if (meioRecebidoFilter && meioRecebidoFilter !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        return item.meio_recebimento === meioRecebidoFilter
      })
    }

    if (meioEvnioFilter && meioEvnioFilter !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        return item.meio_envio === meioEvnioFilter
      })
    }
    if (dataEncerramentoFilter && dataEncerramentoFilter !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        return item.data_encerramento === dataEncerramentoFilter
      })
    }

    salvarDadosNoCache('@valuesSelected', filterSelected)
    salvarDadosNoCache('@filtro', filteredList)
    setList(filteredList)
  }
  async function salvarDadosNoCache(chave: any, dados: any) {
    const dadosParaCache = new Response(JSON.stringify(dados))
    const cache = await caches.open('cache')
    await cache.put(chave, dadosParaCache)
  }

  function defaultFilters() {
    setValue('tipo_protocolo_filter', 'Todos')
    setValue('data_encerramento_filter', 'Todos')
    setValue('data_envio_filter', 'Todos')
    setValue('data_recebimento_filter', 'Todos')
    setValue('meio_envio_filter', 'Todos')
    setValue('meio_recebimento_filter', 'Todos')
    setValue('usuario_encerramento_filter', 'Todos')
  }

  async function buscarDadosNoCache(chave: any) {
    const cache = await caches.open('cache') // Abre o cache pelo nome
    const resposta = await cache.match(chave) // Busca a resposta no cache pela chave

    if (!resposta) {
      console.log('Nenhum dado encontrado para essa chave:', chave)
      return null // Retorna nulo se não encontrar nada
    }

    // Se encontrou, retorna os dados convertidos de volta para o formato original (e.g., JSON)
    return await resposta.json()
  }

  useEffect(() => {
    buscarDadosNoCache('@filtro').then((dados) => {
      if (dados !== null) {
        setList(dados)
      } else {
        setList(data)
      }
    })

    buscarDadosNoCache('@valuesSelected').then((dados) => {
      // console.log('Dados de @valuesSelected:', dados)
      if (dados !== null) {
        const getItemsFilter = dados
        setFilterSelect(getItemsFilter)
        setValue('tipo_protocolo_filter', getItemsFilter.tipo_protocolo_filter)
        setValue('data_envio_filter', getItemsFilter.data_recebimento_filter)
        setValue(
          'data_recebimento_filter',
          getItemsFilter.data_recebimento_filter,
        )
        setValue(
          'meio_recebimento_filter',
          getItemsFilter.meio_recebimento_filter,
        )
        setValue('meio_envio_filter', getItemsFilter.meio_envio_filter)
        setValue(
          'usuario_encerramento_filter',
          getItemsFilter.usuario_encerramento,
        )
        setValue(
          'data_encerramento_filter',
          getItemsFilter.data_encerramento_filter,
        )
        BuscarFiltro()
      } else {
        defaultFilters()
      }
    })
  }, [data])
 
  const objTodos = {
    id: 0,
    ocorrencia_tabela: 'Todos',
  }
  const isTipoProtocol = tipoProtocol?.map((item: any) => {
    return {
      ...item,
    }
  })
  isTipoProtocol.unshift(objTodos)

  const isMeioProtocol = tipoProtocol?.map((item: any) => {
    return {
      ...item,
    }
  })
  isMeioProtocol.unshift(objTodos)

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

  return (
    <Container>
      <div style={{ paddingBottom: '3rem' }}>
        <p>Protocolos</p>
        <Box
          style={{
            marginTop: '0.5rem',
            justifyContent: 'space-between',
            alignItems: 'end',
          }}
        >
          <div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {filterSelect.tipo_protocolo_filter &&
              filterSelect.tipo_protocolo_filter !== 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`${filterSelect.tipo_protocolo_filter}`}
                  title="Tipo Protocolo"
                  data={isTipoProtocol}
                  // data={dataSimNao}
                  {...register('tipo_protocolo_filter')}
                />
              ) : null}

              {filterSelect.tipo_protocolo_filter &&
              filterSelect.tipo_protocolo_filter === 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`Todos`}
                  title="Tipo Protocolo"
                  // data={dataTipoEmpresa}
                  data={tipoProtocol}
                  {...register('tipo_protocolo_filter')}
                />
              ) : null}

              {filterSelect.data_envio_filter &&
              filterSelect.data_envio_filter !== 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`${filterSelect.data_envio_filter}`}
                  title="Envio"
                  {...register('data_envio_filter')}
                  // data={isDataSimNao}
                  // data={() => []}
                  data={dataSimNao}
                />
              ) : null}

              {filterSelect.data_envio_filter &&
              filterSelect.data_envio_filter === 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`Todos`}
                  title="Envio"
                  {...register('data_envio_filter')}
                  data={dataSimNao}
                  // data={() => []}
                  // data={dataSimNao}
                />
              ) : null}

              {filterSelect.data_recebimento_filter &&
              filterSelect.data_recebimento_filter !== 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`${filterSelect.data_recebimento_filter}`}
                  title="data_recebimento_filter"
                  {...register('data_recebimento_filter')}
                  data={dataSimNao}
                  // data={() => []}
                />
              ) : null}

              {filterSelect.data_recebimento_filter &&
              filterSelect.data_recebimento_filter === 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`Todos`}
                  title="Recebimento"
                  {...register('data_recebimento_filter')}
                  data={dataSimNao}
                />
              ) : null}

              {filterSelect.data_envio_filter &&
              filterSelect.data_envio_filter !== 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`${filterSelect.data_envio_filter}`}
                  title="Envio"
                  {...register('data_envio_filter')}
                  data={dataSimNao}
                />
              ) : null}

              {filterSelect.data_envio_filter &&
              filterSelect.data_envio_filter === 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`Todos`}
                  title="Envio"
                  {...register('data_envio_filter')}
                  data={dataSimNao}
                  // data={() => []}
                />
              ) : null}

              {filterSelect.meio_recebimento_filter &&
              filterSelect.meio_recebimento_filter !== 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`${filterSelect.meio_recebimento_filter}`}
                  title="Meio recebimento"
                  {...register('meio_recebimento_filter')}
                  data={dataSimNao}
                  // data={() => []}
                />
              ) : null}

              {filterSelect.meio_recebimento_filter &&
              filterSelect.meio_recebimento_filter === 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`Todos`}
                  title="Meio recebimento"
                  {...register('meio_recebimento_filter')}
                  data={isMeioProtocol}
                  // data={() => []}
                />
              ) : null}
              {filterSelect.meio_envio_filter &&
              filterSelect.meio_envio_filter !== 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`${filterSelect.meio_envio_filter}`}
                  title="Meio Envio"
                  {...register('meio_envio_filter')}
                  data={meioProtocol}
                  // data={() => []}
                />
              ) : null}

              {filterSelect.meio_envio_filter &&
              filterSelect.meio_envio_filter === 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`Todos`}
                  title="Meio Envio"
                  {...register('meio_envio_filter')}
                  data={meioProtocol}
                  // data={() => []}
                />
              ) : null}

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
            </div>
          </div>
          <BackPage backRoute="/" discartPageBack />
        </Box>
      </div>

      {/* <DataGridDemo columns={columns} rows={data} w="100%" /> */}
      {list && <DataGridDemo columns={columns} rows={list} w="100%" />}

      <Box>
        <Button
          title="Visualizar"
          style={{ backgroundColor: '#4471C6' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn(
                'Você não selecionou nenhum protocolo para visualizar!',
              )
            } else if (selectedRowIds.length >= 2) {
              toast.warn('Selecione apenas 1 protocolo para visualizar!')
            } else {
              router.push(`/protocolos/visualizar/${selectedRowIds}`)
            }
          }}
        />
        <Button
          title="Atualizar"
          style={{ backgroundColor: '#528035' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('Você não selecionou nenhum protocolo para atualizar!')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('Selecione apenas 1 protocolo para atualizar!')
            } else {
              router.push(`/protocolos/atualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Incluir"
          style={{ backgroundColor: '#ED7D31' }}
          onClick={() => {
            router.push('/protocolos/incluir')
          }}
        />

        <Modal
          title="Excluir"
          bgColor="#BE0000"
          routeDelete="/protocolos/excluir"
          data={selectedRowIds}
          redirectRouter="/protocolos"
        />
      </Box>
    </Container>
  )
}
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // ADEQUAR QUANDO DESENVOLVER FUNCIONALIDADES!
    const response = await prisma.protocolos.findMany({
      orderBy: {
        id: 'desc',
      },
    })
    const data = response.map((item) => {
      return {
        ...item,
        data_recebimento:
          item.data_recebimento != undefined
            ? new Date(item.data_recebimento)
                .toISOString()
                .replace(/T.*/, '')
                .split('-')
                .reverse()
                .join('/')
            : null,
        data_envio:
          item.data_envio != undefined
            ? new Date(item.data_envio)
                .toISOString()
                .replace(/T.*/, '')
                .split('-')
                .reverse()
                .join('/')
            : null,
        data_encerramento:
          item.data_encerramento != undefined
            ? new Date(item.data_encerramento)
                .toISOString()
                .replace(/T.*/, '')
                .split('-')
                .reverse()
                .join('/')
            : null,
        entregue_em_maos:
          item.entregue_em_maos != undefined
            ? item.entregue_em_maos == true
              ? 'Sim'
              : 'Não'
            : null,
        obrigatoria_resp_receb:
          item.obrigatoria_resp_receb != undefined
            ? item.obrigatoria_resp_receb == true
              ? 'Sim'
              : 'Não'
            : null,
      }
    })

    const tipoProtocol = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Tipo_Protocol',
      },
    })
    const meioProtocol = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Meio_Protocol',
      },
    })

    return {
      props: {
        data,
        tipoProtocol,
        meioProtocol,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados do protocolo:', error)
    return {
      props: {
        data: [],
        tipoProtocol: [],
      },
    }
  } finally {
    prisma.$disconnect()
  }
}
