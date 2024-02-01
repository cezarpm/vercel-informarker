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
import Link from 'next/link'
import { ArrowBendDownLeft } from 'phosphor-react'
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
export default function ProtocoloList({ data }: any) {
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
      headerName: 'Tipo',
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
    let filteredList = data
    const protocoloFilter = watch('tipo_protocolo_filter')
    const recebimentoFilter = watch('data_recebimento_filter')
    const envioFilter = watch('data_envio_filter')
    const meioRecebidoFilter = watch('meio_recebimento_filter')
    const meioEvnioFilter = watch('meio_envio_filter')
    const dataEncerramentoFilter = watch('data_encerramento_filter')
    const usuarioEncerramentoFilter = watch('usuario_encerramento_filter')
    filteredList = filteredList.filter((item: SchemaFilter) => {
      return (
        (protocoloFilter === 'Todos' ||
          item.tipo_protocolo_filter === protocoloFilter) &&
        (!recebimentoFilter ||
          recebimentoFilter === 'Todos' ||
          item.data_recebimento_filter === recebimentoFilter) &&
        (!envioFilter ||
          envioFilter === 'Todos' ||
          item.data_envio_filter === envioFilter) &&
        (!meioRecebidoFilter ||
          meioRecebidoFilter === 'Todos' ||
          item.meio_recebimento_filter === meioRecebidoFilter) &&
        (!meioEvnioFilter ||
          meioEvnioFilter === 'Todos' ||
          item.meio_envio_filter === meioEvnioFilter) &&
        (!dataEncerramentoFilter ||
          dataEncerramentoFilter === 'Todos' ||
          item.data_encerramento_filter === dataEncerramentoFilter) &&
        (!usuarioEncerramentoFilter ||
          usuarioEncerramentoFilter === 'Todos' ||
          item.usuario_encerramento_filter === usuarioEncerramentoFilter)
      )
    })
    console.log(filteredList)
    // const filterSelected = {
    //   tipo_protocolo_filter: protocoloFilter,
    //   data_recebimento_filter: recebimentoFilter,
    //   data_envio_filter: envioFilter,
    //   meio_recebimento_filter: meioRecebidoFilter,
    //   meio_envio_filter: meioEvnioFilter,
    //   data_encerramento_filter: dataEncerramentoFilter,
    //   usuario_encerramento_filter: usuarioEncerramentoFilter,
    // }

    // // Realize a filtragem com base nos valores selecionados
    // if (protocoloFilter !== 'Todos') {
    //   filteredList = filteredList.filter((item: any) => {
    //     const situacaoMatch =
    //       protocoloFilter === 'Todos' ||
    //       item.tipo_protocolo_filter === protocoloFilter
    //     return situacaoMatch
    //   })
    // }

    // if (recebimentoFilter && recebimentoFilter !== 'Todos') {
    //   filteredList = filteredList.filter((item: any) => {
    //     return item.data_recebimento_filter === recebimentoFilter
    //   })
    // }

    // if (envioFilter && envioFilter !== 'Todos') {
    //   filteredList = filteredList.filter((item: any) => {
    //     return item.faculdade_anestesiologia === envioFilter
    //   })
    // }

    // if (meioRecebidoFilter && meioRecebidoFilter !== 'Todos') {
    //   filteredList = filteredList.filter((item: any) => {
    //     return item.empresa_ativa === meioRecebidoFilter
    //   })
    // }

    // if (meioEvnioFilter && meioEvnioFilter !== 'Todos') {
    //   filteredList = filteredList.filter((item: any) => {
    //     return item.empresa_ativa === meioEvnioFilter
    //   })
    // }
    // if (dataEncerramentoFilter && dataEncerramentoFilter !== 'Todos') {
    //   filteredList = filteredList.filter((item: any) => {
    //     return item.uf === dataEncerramentoFilter
    //   })
    // }
    // if (usuarioEncerramentoFilter && usuarioEncerramentoFilter !== 'Todos') {
    //   filteredList = filteredList.filter((item: any) => {
    //     return item.uf === usuarioEncerramentoFilter
    //   })
    // }
    // TRANSFORMANDO OBJETO EM STRING E SALVANDO NO LOCALSTORAGE
    // localStorage.setItem('@valuesSelected', JSON.stringify(filterSelected))
    // localStorage.setItem('@filtro', JSON.stringify(filteredList))
    // setList(filteredList)

    // useEffect(() => {}, [filterSelect])
  }

  function defaultFilters() {
    setValue('tipo_protocolo_filter_filter', 'Todos')
    setValue('uf_filter', 'Todos')
    setValue('empresa_ativa_filter', 'Todos')
    setValue('patrocinarora_filter', 'Todos')
    setValue('faculdade_anestesiologia_filter', 'Todos')
  }

  useEffect(() => {
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
      setValue('data_encerramento_filter', getItemsFilter.tipo_protocolo_filter)
      setValue('', getItemsFilter.uf_brasil)
      setValue('empresa_ativa_filter', getItemsFilter.empresa_ativa)
      setValue('patrocinarora_filter', getItemsFilter.patrocinadora)
      setValue('faculdade_anestesiologia_filter', getItemsFilter.faculdade)
      BuscarFiltro()
    } else {
      defaultFilters()
    }
  }, [data])

  //  const isDataSimNao = dataSimNao?.map((item: any) => {
  //  return {
  //  ...item,
  //  }
  //  })
  //  isDataSimNao.unshift(objDataSimNaoTodos)
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
                  title="Protocolo"
                  // data={isdataTipoEmpresa}
                  data={dataSimNao}
                  {...register('tipo_protocolo_filter')}
                />
              ) : null}

              {filterSelect.tipo_protocolo_filter &&
              filterSelect.tipo_protocolo_filter === 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`Todos`}
                  title="Protocolo"
                  // data={dataTipoEmpresa}
                  data={dataSimNao}
                  {...register('tipo_protocolo_filter')}
                />
              ) : null}

              {filterSelect.data_recebimento_filter &&
              filterSelect.data_recebimento_filter !== 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`${filterSelect.data_recebimento_filter}`}
                  title="data_recebimento_filter"
                  {...register('data_recebimento_filter')}
                  // data={isDataSimNao}
                  // data={() => []}
                  data={dataSimNao}
                />
              ) : null}

              {filterSelect.data_recebimento_filter &&
              filterSelect.data_recebimento_filter === 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`Todos`}
                  title="data_recebimento_filter"
                  {...register('data_recebimento_filter')}
                  // data={dataSimNao}
                  // data={() => []}
                  data={dataSimNao}
                />
              ) : null}

              {/* {filterSelect.faculdade && filterSelect.faculdade !== 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`${filterSelect.faculdade}`}
                  title="Faculdade Anestesiologia"
                  {...register('faculdade_anestesiologia_filter')}
                  data={isDataSimNao}
                  data={() => []}
                />
              ) : null}

              {filterSelect.faculdade && filterSelect.faculdade === 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`Todos`}
                  title="Faculdade Anestesiologia"
                  {...register('faculdade_anestesiologia_filter')}
                  data={dataSimNao}
                />
              ) : null}

              {filterSelect.empresa_ativa &&
              filterSelect.empresa_ativa !== 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`${filterSelect.empresa_ativa}`}
                  title="Empresa Ativa"
                  {...register('empresa_ativa_filter')}
                  data={isDataSimNao}
                />
              ) : null}

              {filterSelect.empresa_ativa &&
              filterSelect.empresa_ativa === 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`Todos`}
                  title="Empresa Ativa"
                  {...register('empresa_ativa_filter')}
                  // data={dataSimNao}
                  data={() => []}
                />
              ) : null}

              {filterSelect.uf_brasil && filterSelect.uf_brasil !== 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`${filterSelect.uf_brasil}`}
                  title="UF"
                  {...register('uf_filter')}
                  // data={isUfBrasil}
                  data={() => []}
                />
              ) : null}

              {filterSelect.uf_brasil && filterSelect.uf_brasil === 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`Todos`}
                  title="UF"
                  {...register('uf_filter')}
                  // data={ufBrasil}
                  data={() => []}
                />
              ) : null} */}

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

      <DataGridDemo columns={columns} rows={data} w="100%" />
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
    return {
      props: {
        data,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados do protocolo:', error)
    return {
      props: {
        data: [],
      },
    }
  }
}
