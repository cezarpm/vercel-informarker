import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import { useId } from '@/context'
import { FormControlLabel, FormLabel, InputLabel, MenuItem, Modal, Radio, RadioGroup, Select, SelectChangeEvent } from '@mui/material'
import { ContainerFilters, HeaderBirthdays, TextNoFilter } from './styled'

import { Button } from '@ignite-ui/react'
import { toast } from 'react-toastify'
import { EtiquetaPDF } from '@/utils/ticketsAssociates'
import { Button as ButtonEtiqueta } from '../Button'

interface EtiquetaProps {
  id?: number
  data_nascimento?: string
  data_inicio_especializacao?: string
  data_previsao_conclusao?: string
  comprovante_cpf?: string
  numero_proposta_SBA?: number
  matricula_SAERJ?: number
  matricula_SBA?: number
  situacao?: string
  uf_crm?: string
  crm?: number
  nome_completo: string
  cpf?: string
  sexo?: string
  nome_profissional: string
  categoria?: string
  cep: string
  logradouro: string
  numero: number
  complemento: string
  bairro: string
  cidade: string
  uf: string
  pais?: string
  telefone_celular?: string
  telefone_residencial?: string
  email?: string
  nome_instituicao_ensino_graduacao?: string
  ano_conclusao_graduacao?: string
  residencia_mec_cnrm?: string
  nivel_residencia?: string
  nome_hospital_mec?: string
  uf_prm?: string
  comprovante_endereco?: string
  carta_indicacao_2_membros?: string
  declaracao_hospital?: string
  diploma_medicina?: string
  certidao_quitacao_crm?: string
  certificado_conclusao_especializacao?: string
  declaro_verdadeiras?: string
  declaro_quite_SAERJ?: string
  pendencias_SAERJ?: string
  nome_presidente_regional?: string
  sigla_regional?: string
}

const TableBirthdays = ({ rows, columns, w }: any) => {

    const { setSelection, selectedRowIds } = useId()
    
    const [filter, setFilter] = useState('0');
    const [quantidadeLinhas, setQuantidadeLinhas] = useState(10);
    const [associatesSelected, setAssociatesSelected] = useState<EtiquetaProps[]>([]);

  const [filter, setFilter] = useState('0')
  const [associatesSelected, setAssociatesSelected] = useState<EtiquetaProps[]>(
    [],
  )

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [mes, setMes] = React.useState<string>('')
  const [semana, setSemana] = React.useState<number[]>([])
  const [dia, setDia] = React.useState<number>(0)


    useEffect(() => {
        getQuantityRows();
        setSelection([]);
    },[])


    useEffect(() => {
        if(rows.length == 1){
            setSelection([rows[0].id])
        }

        const date = new Date();

  useEffect(() => {
    const date = new Date()

    setMes(
      date.getMonth() + 1 < 10
        ? ('0' + (date.getMonth() + 1)).toString()
        : (date.getMonth() + 1).toString(),
    )
    setDia(date.getDate())

    const diaAtual = date.getDay()

    const diferencaDomingo = diaAtual - 0
    date.setDate(date.getDate() - diferencaDomingo)

    const diasDaSemana = []


        setSemana(diasDaSemana);
    },[filter, rows])

    useEffect(() => {
        setFilteredData(rows.filter((item: any) => {
            if(item.data_nascimento != null){
                let data_nasc = (item.data_nascimento).split('/');

                if (filter === "month") {
                  const filterMonth = data_nasc[1] === mes;

                  return filterMonth;
                } 

                if (filter === 'week') {
                  const filterWeek = semana.indexOf(parseInt(data_nasc[0], 10)) > -1 && data_nasc[1] === mes;

                  return filterWeek;
                }

                if (filter === 'day') {
                  const filterDay = parseInt(data_nasc[0], 10) === dia && data_nasc[1] === mes;

                  return filterDay;
                }

                return true; // Caso não seja nenhum dos filtros, incluir na lista
            }else{
                return false
            }

          }))
    },[mes, semana, dia])
    
    const getQuantityRows = async () => {
        const response = await fetch(`/api/parametros`);
        const data = await response.json();

        if(data){
            setQuantidadeLinhas(data[0].quantidade_linhas_listas);
        }
    }
          return filterMonth
        }

        if (filter === 'week') {
          const filterWeek =
            semana.indexOf(parseInt(data_nasc[0], 10)) > -1 &&
            data_nasc[1] === mes

    const handleFilterChange = (event: SelectChangeEvent<string>) => {
        setFilter(event.target.value);
    
        // if(event.target.value != "0"){
        //     toast.warn('Atenção os demais filtros serão desconsiderados.')
        // }
    };


        if (filter === 'day') {
          const filterDay =
            parseInt(data_nasc[0], 10) === dia && data_nasc[1] === mes

          return filterDay
        }

        return true // Caso não seja nenhum dos filtros, incluir na lista
      }),
    )
  }, [mes, semana, dia])

  useEffect(() => {
    setAssociatesSelected([])
    selectedRowIds.map(async (item: any) => {
      try {
        const response = await fetch(`/api/associados/get/${item}`)
        const data = await response.json()
        setAssociatesSelected((prev) => [...prev, data])
      } catch (error) {
        console.error('Erro ao buscar associados:', error)
      }
    })

    console.log(associatesSelected)
  }, [selectedRowIds])

  const handleSelectionModelChange = (newSelectionModel: any) => {
    setSelection(newSelectionModel)
  }

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilter(event.target.value)

    if (event.target.value != '0') {
      toast.warn('Atenção os demais filtros serão desconsiderados.')
    }
  }

  /* const seachAssociates = async () => {
        setAssociatesSelected([]);
        selectedRowIds.map(async (item: any) => {
          try {
            const response = await fetch(`/api/associados/get/${item}`);
            const data = await response.json();
            setAssociatesSelected((prev) => [...prev, data]);

          } catch (error) {
            console.error('Erro ao buscar associados:', error);
          }
        });

        console.log(associatesSelected)


      };*/
      
      const gerarEtiqueta = () => {
        EtiquetaPDF(selectedRowIds);
        handleClose()
      }


    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{position: 'absolute' as 'absolute',  top: '50%',  left: '50%',  transform: 'translate(-50%, -50%)',  width: 400,  bgcolor: 'background.paper', p: 4}}>
                <p style={{fontFamily: 'Roboto'}}>
                Confirma a impressão de etiquetas para os Associados selecionados.
                </p>
                <Box style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: '2rem', width: '100%'}}>
                    <Button style={{ padding: '0.5rem', height: 'auto' }} onClick={gerarEtiqueta}>Ok</Button>
                    <Button style={{ padding: '0.5rem', height: 'auto' }} onClick={handleClose}>Cancelar</Button>
                </Box>
                </Box>
            </Modal>

            <HeaderBirthdays>
                {/* <ContainerFilters>

                    <FormLabel id="demo-controlled-radio-buttons-group">Filtros</FormLabel>

                    <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="month"
                        name="radio-buttons-group"
                        onChange={handleFilterChange}
                    >
                        <FormControlLabel value="month" control={<Radio  size="small"/>} label="Mês" />
                        <FormControlLabel value="week" control={<Radio  size="small"/>} label="Semana" />
                        <FormControlLabel value="day" control={<Radio  size="small"/>} label="Dia" />
                    </RadioGroup>
                </ContainerFilters> */}

                <ContainerFilters>
                    <InputLabel sx={{ fontSize: '12px' }}>Por favor selecione um filtro</InputLabel>
                    <Select
                        size="small"
                        sx={{ width: '30%', fontSize: '12px' }}
                        defaultValue={filter}
                        label={"Filtros"}
                        onChange={handleFilterChange}
                    >
                        <MenuItem sx={{ fontSize: '12px' }} value={"0"} >Selecione</MenuItem>
                        <MenuItem sx={{ fontSize: '12px' }} value={"month"}>Mês</MenuItem>
                        <MenuItem sx={{ fontSize: '12px' }} value={"week"}>Semana</MenuItem>
                        <MenuItem sx={{ fontSize: '12px' }} value={"day"}>Dia</MenuItem>
                    </Select>
                </ContainerFilters>
                {selectedRowIds.length > 0 && 
                    <ButtonEtiqueta
                        style={{ backgroundColor: `${'#0da9a4'}`,  margin: '0px', fontSize: '12px', border: 'solid 1px', padding: '0.5rem', }}
                        onClick={handleOpen}
                        title={"Gerar etiqueta"}
                    />
                }
            </HeaderBirthdays>

            {filter != "0" &&
                <Box sx={{ height: '60vh', width: w, marginTop: '1rem' }}>
                    <DataGrid
                    rows={filteredData}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: quantidadeLinhas,
                            },
                        },
                    }}
                    pageSizeOptions={[10]}
                    rowHeight={34}
                    checkboxSelection
                    disableRowSelectionOnClick
                    rowSelectionModel={selectedRowIds}
                    onRowSelectionModelChange={handleSelectionModelChange}
                    />
                </Box> 
            
            }


      </>
    )

}

export default TableBirthdays
