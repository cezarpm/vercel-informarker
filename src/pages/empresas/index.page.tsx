import { Button } from '@/components/Button'
import { Container, Box, ButtonEtiqueta } from './styled'
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
import { Modal as ModalMui } from '@mui/material'
import { Button as ButtonReact } from '@ignite-ui/react'
import { useEffect, useState } from 'react'
import { EtiquetaPDFCompany } from '@/utils/ticketsCompany'
import ModalTickets from '@/components/ModalTickets'

const shemaFilter = z.object({
  tipo_empresa_filter: z.string(),
  patrocinarora_filter: z.string(),
  faculdade_anestesiologia_filter: z.string(),
  empresa_ativa_filter: z.string(),
})

interface EtiquetaProps {
  id: number;
  cod_empresa?: string;
  tipo_empresa?: string;
  patrocinadora?: boolean;
  faculdade_anestesiologia?: boolean;
  empresa_ativa?: boolean;
  cnpj?: string;
  razao_social?: string;
  nome_fantasia?: string;
  cep?: string;
  logradouro?: string;
  numero?: number;
  complemento?: string;
  cidade?: string;
  uf?: string;
  pais?: string;
  bairro?: string;
  telefone_comercial?: string;
  tratamento_contato_primario?: string;
  nome_contato_primario?: string;
  cargo_contato_primario?: string;
  email_contato_primario?: string;
  telefone_contato_primario?: string;
  tratamento_contato_secundario?: string;
  nome_contato_secundario?: string;
  cargo_contato_secundario?: string;
  email_contato_secundario?: string;
  telefone_contato_secundario?: string;
  home_page?: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  observacoes?: string;
}

type SchemaFilter = z.infer<typeof shemaFilter>

export default function EmpresaList({ data, dataTipoEmpresa }: any) {
  const router = useRouter()
  const { selectedRowIds } = useId()

  

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'id',
      disableColumnMenu: true,
      width: 80,
    },
    {
      field: 'tipo_empresa',
      headerName: 'Tipo Empresa',
      width: 120,
    },
    {
      field: 'patrocinadora',
      headerName: 'Patrocinadora',
      width: 120,
    },
    {
      field: 'faculdade_anestesiologia',
      headerName: 'Faculdade Anestesiologia',
      width: 220,
      disableColumnMenu: true,
    },
    {
      field: 'empresa_ativa',
      headerName: 'Empresa Ativa',
      width: 120,
      disableColumnMenu: true,
    },
    {
      field: 'razao_social',
      headerName: 'Razão Social',
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: 'nome_fantasia',
      headerName: 'Nome Fantasia',
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: 'cnpj',
      headerName: 'Cnpj',
      width: 140,
      disableColumnMenu: true,
    },
    {
      field: 'cidade',
      headerName: 'Cidade',
      width: 120,
      disableColumnMenu: true,
    },
    {
      field: 'uf',
      headerName: 'Uf',
      width: 50,
      disableColumnMenu: true,
    },

    {
      field: 'nome_contato_primario',
      headerName: 'Nome Contato Primário',
      width: 180,
      disableColumnMenu: true,
    },
    {
      field: 'email_contato_primario',
      headerName: 'Email Contato Primário',
      width: 180,
      disableColumnMenu: true,
    },
  ]

  const { register, watch } = useForm<SchemaFilter>()

  const TipoEmpresaFilter = watch('tipo_empresa_filter')
  const PatrocinadoraFilter = watch('patrocinarora_filter')
  const FaculdadeAnestesiologiaFilter = watch('faculdade_anestesiologia_filter')
  const EmpresaAtivaFilter = watch('empresa_ativa_filter')

  const filteredData = data.filter((item: any) => {
    const tipoEmpresaMatch =
      TipoEmpresaFilter === undefined ||
      TipoEmpresaFilter === 'Todos' ||
      item.tipo_empresa === TipoEmpresaFilter

    const patrocinadoraMatch =
      PatrocinadoraFilter === undefined ||
      PatrocinadoraFilter === 'Todos' ||
      item.patrocinadora === PatrocinadoraFilter

    const faculdadeMatch =
      FaculdadeAnestesiologiaFilter === undefined ||
      FaculdadeAnestesiologiaFilter === 'Todos' ||
      item.faculdade_anestesiologia === FaculdadeAnestesiologiaFilter

    const empresaAtivaMatch =
      EmpresaAtivaFilter === undefined ||
      EmpresaAtivaFilter === 'Todos' ||
      item.empresa_ativa === EmpresaAtivaFilter

    return (
      tipoEmpresaMatch &&
      patrocinadoraMatch &&
      faculdadeMatch &&
      empresaAtivaMatch
    )
  })
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
      

      <p>Empresas</p>
      <form>
        <Box style={{ marginTop: '1rem' }}>
          <SelectNoComplete
            value="Todos"
            title="Tipo Empresa"
            data={dataTipoEmpresa}
            {...register('tipo_empresa_filter')}
          />
          <SelectNoComplete
            value="Todos"
            title="Patrocinadora"
            {...register('patrocinarora_filter')}
            data={dataSimNao}
          />
          <SelectNoComplete
            value="Todos"
            title="Faculdade Anestesiologia"
            {...register('faculdade_anestesiologia_filter')}
            data={dataSimNao}
          />
          <SelectNoComplete
            value="Todos"
            title="Empresa Ativa"
            {...register('empresa_ativa_filter')}
            data={dataSimNao}
          />
        </Box>
      </form>

      {selectedRowIds.length > 0 && 
      <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
        <ModalTickets
          title="Gerar Etiqueta"
          bgColor="#0da9a4"
          data={selectedRowIds}
          route="/api/empresa/get/"
        />
      </Box>}
      <DataGridDemo columns={columns} rows={filteredData} w="100%" />

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
          redirectRouter="/empresas"
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
    const response = await prisma.empresa.findMany()
    const data = response.map((item) => {
      return {
        id: item.id,
        patrocinadora: item.patrocinadora ? 'sim' : 'não',
        faculdade_anestesiologia: item.faculdade_anestesiologia ? 'sim' : 'não',
        empresa_ativa: item.empresa_ativa ? 'sim' : 'não',
        tipo_empresa: item.tipo_empresa,
        razao_social: item.razao_social,
        nome_fantasia: item.nome_fantasia,
        cnpj: item.cnpj,
        cidade: item.cidade,
        uf: item.uf,
        nome_contato_primario: item.nome_contato_primario,
        email_contato_primario: item.email_contato_primario,
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
  }
}