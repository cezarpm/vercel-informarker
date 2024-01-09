import React, {useEffect, useState} from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useId } from '@/context'
import SelectNoComplete from '../SelectNoComplete'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Modal, Typography } from '@mui/material'
import { ButtonEtiqueta, Container } from './styled'
import { EtiquetaPDFCompany } from '@/utils/ticketsCompany'
import { Button } from '@ignite-ui/react'

const shemaFilter = z.object({
  tipo_empresa_filter: z.string(),
  patrocinarora_filter: z.string(),
  faculdade_anestesiologia_filter: z.string(),
  empresa_ativa_filter: z.string(),
})

type SchemaFilter = z.infer<typeof shemaFilter>

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


export default function DataGridDemo({ data, w, dataTipoEmpresa }: any) {
  const { setSelection, selectedRowIds } = useId();
  const [companySelected, setCompanySelected] = useState<EtiquetaProps[]>([]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSelectionModelChange = (newSelectionModel: any) => {
    setSelection(newSelectionModel)
    // console.log(newSelectionModel)
  }

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
  ];

  useEffect(() => {
    setCompanySelected([]);
    selectedRowIds.map(async (item: any) => {
      try {
        const response = await fetch(`/api/empresa/get/${item}`);
        const data = await response.json();
        setCompanySelected((prev) => [...prev, data]);

      } catch (error) {
        console.error('Erro ao buscar associados:', error);
      }
    });

    console.log(companySelected)
}, [selectedRowIds])

  const gerarEtiqueta = (primario: boolean) => {
    console.log(primario, companySelected)
    EtiquetaPDFCompany(companySelected, primario)
  }

  return (
    <Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{position: 'absolute' as 'absolute',  top: '50%',  left: '50%',  transform: 'translate(-50%, -50%)',  width: 400,  bgcolor: 'background.paper', p: 4}}>
          <p style={{fontFamily: 'Roboto'}}>
            Deseja emitir etiquetas para contato primária ou secundário?
          </p>
          <Box style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: '2rem', width: '100%'}}>
            <Button style={{ padding: '0.5rem', height: 'auto' }} onClick={() => gerarEtiqueta(true)}>Primário</Button>
            <Button style={{ padding: '0.5rem', height: 'auto' }} onClick={() => gerarEtiqueta(false)}>Secundário</Button>
          </Box>
        </Box>
      </Modal>

        <Box style={{ marginTop: '1rem', display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: '2rem', width: '100%'}}>
        <form style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', width: '100%'}}>
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

          
          </form>
          {selectedRowIds.length > 0 && 
            <ButtonEtiqueta
                style={{ backgroundColor: '#0da9a4' }}
                onClick={handleOpen}
            >
                Gerar Etiqueta
            </ButtonEtiqueta>
          }
        </Box>
      

      <Box sx={{ height: '60vh', width: w, marginTop: '1rem' }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selectedRowIds}
          onRowSelectionModelChange={handleSelectionModelChange}
        />
      </Box>
    </Container>
  )
}
