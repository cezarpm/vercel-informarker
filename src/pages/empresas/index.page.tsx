/* eslint-disable react-hooks/exhaustive-deps */
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
import { useEffect, useState } from 'react'
import ModalTickets from '@/components/ModalTickets'
import { formatCNPJ } from '@/utils/formatCnpj'
import { BackPage } from '@/components/BackPage'
import { useArrayUfBrasil } from '@/utils/useArrayUfBrasil'

const shemaFilter = z.object({
  tipo_empresa_filter: z.string(),
  patrocinarora_filter: z.string(),
  faculdade_anestesiologia_filter: z.string(),
  empresa_ativa_filter: z.string(),
  uf_filter: z.string(),
})

type SchemaFilter = z.infer<typeof shemaFilter>

interface TypesFilter {
  PatrocinadoraFilter: string
  TipoEmpresaFilter: string
  FaculdadeAnestesiologiaFilter: string
  EmpresaAtivaFilter: string
  UfBrasilFilter: string
}
export default function Empresas({ data, dataTipoEmpresa }: any) {
  const { selectedRowIds } = useContextCustom()
  const router = useRouter()
  const [list, setList] = useState(data)
  const [filterSelect, setFilterSelect] = useState({
    tipo_empresa: 'Todos',
    patrocinadora: 'Todos',
    faculdade: 'Todos',
    empresa_ativa: 'Todos',
    uf_brasil: 'Todos',
  })
  const { register, watch, setValue } = useForm<SchemaFilter>()

  const ufBrasil = useArrayUfBrasil.map((item) => {
    return {
      ocorrencia_tabela: item,
    }
  })

  function BuscarFiltro() {
    // Inicialize a lista com os dados originais
    let filteredList = data
    const PatrocinadoraFilter = watch('patrocinarora_filter')
    const TipoEmpresaFilter = watch('tipo_empresa_filter')
    const FaculdadeAnestesiologiaFilter = watch(
      'faculdade_anestesiologia_filter',
    )
    const EmpresaAtivaFilter = watch('empresa_ativa_filter')
    const UfBrasilFilter = watch('uf_filter')
    const filterSelected = {
      patrocinadora: PatrocinadoraFilter,
      tipo_empresa: TipoEmpresaFilter,
      faculdade: FaculdadeAnestesiologiaFilter,
      empresa_ativa: EmpresaAtivaFilter,
      uf_brasil: UfBrasilFilter,
    }

    // Realize a filtragem com base nos valores selecionados
    if (TipoEmpresaFilter !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        const situacaoMatch =
          TipoEmpresaFilter === 'Todos' ||
          item.tipo_empresa === TipoEmpresaFilter
        return situacaoMatch
      })
    }

    if (PatrocinadoraFilter && PatrocinadoraFilter !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        return item.patrocinadora === PatrocinadoraFilter
      })
    }

    if (
      FaculdadeAnestesiologiaFilter &&
      FaculdadeAnestesiologiaFilter !== 'Todos'
    ) {
      filteredList = filteredList.filter((item: any) => {
        return item.faculdade_anestesiologia === FaculdadeAnestesiologiaFilter
      })
    }

    if (EmpresaAtivaFilter && EmpresaAtivaFilter !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        return item.empresa_ativa === EmpresaAtivaFilter
      })
    }

    if (EmpresaAtivaFilter && EmpresaAtivaFilter !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        return item.empresa_ativa === EmpresaAtivaFilter
      })
    }
    if (UfBrasilFilter && UfBrasilFilter !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        return item.uf === UfBrasilFilter
      })
    }
    // TRANSFORMANDO OBJETO EM STRING E SALVANDO NO LOCALSTORAGE
    localStorage.setItem('@valuesSelected', JSON.stringify(filterSelected))
    localStorage.setItem('@filtro', JSON.stringify(filteredList))
    setList(filteredList)
    // useEffect(() => {}, [filterSelect])
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'id',
      width: 110,
    },
    {
      field: 'cod_empresa',
      headerName: 'Cod',
      width: 130,
      disableColumnMenu: true,
      // sortable: false,
    },
    {
      field: 'tipo_empresa',
      headerName: 'Tipo Empresa',
      width: 190,
      disableColumnMenu: true,
    },
    {
      field: 'patrocinadora',
      headerName: 'Patr.',
      width: 80,
      disableColumnMenu: true,
    },
    {
      field: 'faculdade_anestesiologia',
      headerName: 'Fac. Anest.',
      width: 120,
      disableColumnMenu: true,
    },
    {
      field: 'empresa_ativa',
      headerName: 'Ativa',
      width: 85,
      disableColumnMenu: true,
    },
    {
      field: 'razao_social',
      headerName: 'Razão Social',
      width: 400,
      disableColumnMenu: true,
    },
    // {
    //   field: 'nome_fantasia',
    //   headerName: 'Nome Fantasia',
    //   width: 200,
    //   disableColumnMenu: true,
    // },
    {
      field: 'cnpj',
      headerName: 'CNPJ',
      width: 150,
      disableColumnMenu: true,
    },
    {
      field: 'cidade',
      headerName: 'Cidade',
      width: 150,
      disableColumnMenu: true,
    },
    {
      field: 'uf',
      headerName: 'Uf',
      width: 70,
      disableColumnMenu: true,
    },

    {
      field: 'nome_contato_primario',
      headerName: 'Contato Primário',
      width: 230,
      disableColumnMenu: true,
    },
    {
      field: 'email_contato_primario',
      headerName: 'Email Contato Primário',
      width: 250,
      disableColumnMenu: true,
    },
  ]

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

  function defaultFilters() {
    setValue('tipo_empresa_filter', 'Todos')
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
      setValue('tipo_empresa_filter', getItemsFilter.tipo_empresa)
      setValue('uf_filter', getItemsFilter.uf_brasil)
      setValue('empresa_ativa_filter', getItemsFilter.empresa_ativa)
      setValue('patrocinarora_filter', getItemsFilter.patrocinadora)
      setValue('faculdade_anestesiologia_filter', getItemsFilter.faculdade)
      BuscarFiltro()
    } else {
      defaultFilters()
    }
  }, [data])

  const isdataTipoEmpresa = dataTipoEmpresa?.map((item: any) => {
    return {
      ...item,
    }
  })

  const objTodos = {
    id: 0,
    codigo_tabela: 'Tipo_Empresa',
    ocorrencia_tabela: 'Todos',
    complemento_ocorrencia_selecao: 'Novo Complemento',
    ocorrencia_ativa: true,
  }
  isdataTipoEmpresa.unshift(objTodos)
  const objUfTodos = {
    id: 0,
    ocorrencia_tabela: 'Todos',
  }

  const isUfBrasil = ufBrasil?.map((item) => {
    return {
      ...item,
    }
  })
  isUfBrasil.unshift(objUfTodos)

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

  return (
    <Container>
      <div style={{ paddingBottom: '3rem' }}>
        <p>Empresas</p>
        <Box
          style={{
            marginTop: '0.5rem',
            justifyContent: 'space-between',
            alignItems: 'end',
          }}
        >
          <div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {filterSelect.tipo_empresa &&
              filterSelect.tipo_empresa !== 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`${filterSelect.tipo_empresa}`}
                  title="Tipo Empresa"
                  data={isdataTipoEmpresa}
                  {...register('tipo_empresa_filter')}
                />
              ) : null}

              {filterSelect.tipo_empresa &&
              filterSelect.tipo_empresa === 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`Todos`}
                  title="Tipo Empresa"
                  data={dataTipoEmpresa}
                  {...register('tipo_empresa_filter')}
                />
              ) : null}

              {filterSelect.patrocinadora &&
              filterSelect.patrocinadora !== 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`${filterSelect.patrocinadora}`}
                  title="Patrocinadora"
                  {...register('patrocinarora_filter')}
                  data={isDataSimNao}
                />
              ) : null}

              {filterSelect.patrocinadora &&
              filterSelect.patrocinadora === 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`Todos`}
                  title="Patrocinadora"
                  {...register('patrocinarora_filter')}
                  data={dataSimNao}
                />
              ) : null}

              {filterSelect.faculdade && filterSelect.faculdade !== 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`${filterSelect.faculdade}`}
                  title="Faculdade Anestesiologia"
                  {...register('faculdade_anestesiologia_filter')}
                  data={isDataSimNao}
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
                  data={dataSimNao}
                />
              ) : null}

              {filterSelect.uf_brasil && filterSelect.uf_brasil !== 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`${filterSelect.uf_brasil}`}
                  title="UF"
                  {...register('uf_filter')}
                  data={isUfBrasil}
                />
              ) : null}

              {filterSelect.uf_brasil && filterSelect.uf_brasil === 'Todos' ? (
                <SelectNoComplete
                  p="0px 0px 0px 0.5rem"
                  value={`Todos`}
                  title="UF"
                  {...register('uf_filter')}
                  data={ufBrasil}
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

              {selectedRowIds.length > 0 && (
                <ModalTickets
                  title="Gerar Etiqueta"
                  bgColor="#0da9a4"
                  data={selectedRowIds}
                />
              )}
            </div>
          </div>
          <BackPage backRoute="/" discartPageBack />
        </Box>
      </div>

      {list && <DataGridDemo columns={columns} rows={list} w="100%" />}
      <Box>
        <Button
          style={{ backgroundColor: '#4471C6' }}
          title="Visualizar"
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('você não selecionou a empresa para visualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 empresa para visualizar')
            } else {
              router.push(`/empresas/visualizar/${selectedRowIds}`)
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
              toast.warn('selecione 1 empresa para atualizar')
            } else {
              router.push(`/empresas/atualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Incluir"
          style={{ backgroundColor: '#ED7D31' }}
          onClick={() => {
            router.push('/empresas/cadastro')
          }}
        />

        <Modal
          title="Excluir"
          bgColor="#BE0000"
          routeDelete="/empresa/delete/"
          data={selectedRowIds}
          redirectRouter="empresas"
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
    const response = await prisma.empresa.findMany({
      orderBy: {
        id: 'desc',
      },
    })
    const data = response.map((item) => {
      return {
        id: item.id,
        cod_empresa: item.cod_empresa,
        patrocinadora: item.patrocinadora ? 'sim' : 'não',
        faculdade_anestesiologia: item.faculdade_anestesiologia ? 'sim' : 'não',
        empresa_ativa: item.empresa_ativa ? 'sim' : 'não',
        tipo_empresa: item.tipo_empresa,
        razao_social: item.razao_social,
        nome_fantasia: item.nome_fantasia,
        cnpj: item.cnpj ? formatCNPJ(item.cnpj) : '',
        cidade: item.cidade,
        cep: item.cep,
        logradouro: item.logradouro,
        numero: item.numero,
        complemento: item.complemento,
        bairro: item.bairro,
        uf: item.uf,
        tratamento_contato_primario: item.tratamento_contato_primario,
        nome_contato_primario: item.nome_contato_primario,
        telefone_contato_primario: item.telefone_contato_primario,
        email_contato_primario: item.email_contato_primario,
        tratamento_contato_secundario: item.tratamento_contato_secundario,
        nome_contato_secundario: item.nome_contato_secundario,
        telefone_contato_secundario: item.telefone_contato_secundario,
        email_contato_secundario: item.email_contato_secundario,
      }
    })

    const dataTipoEmpresa = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Tipo_Empresa',
      },
    })

    return {
      props: {
        data,
        dataTipoEmpresa,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados da empresa:', error)
    return {
      props: {
        data: [],
        dataTipoEmpresa: [],
      },
    }
  } finally {
    prisma.$disconnect()
  }
}
