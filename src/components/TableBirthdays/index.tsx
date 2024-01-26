/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import { useContextCustom } from '@/context'
import { CircularProgress, Modal } from '@mui/material'
import { ContainerFilters, HeaderBirthdays } from './styled'
import { Button } from '@ignite-ui/react'
import { EtiquetaPDF } from '@/utils/ticketsAssociates'
import { Button as ButtonEtiqueta } from '../Button'
import SelectNoComplete from '../SelectNoComplete'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'react-toastify'

const shemaFilter = z.object({
  data_filter: z.string(),
  situacao_filter: z.string(),
  categoria_filter: z.string(),
})

type SchemaFilter = z.infer<typeof shemaFilter>

const TableBirthdays = ({
  rows,
  columns,
  w,
  situacaoAssociado,
  categoriaAssociado,
}: any) => {
  const { setSelection, selectedRowIds } = useContextCustom()
  const [filterSelect, setFilterSelect] = useState({
    data_filter: 'Selecione',
    situacao_filter: 'Todos',
    categoria_filter: 'Todos',
  })

  const [quantidadeLinhas, setQuantidadeLinhas] = useState(10)

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [loader, setLoader] = useState(false)

  const [mes, setMes] = useState<string>('')
  const [semana, setSemana] = useState<number[]>([])
  const [dia, setDia] = useState<number>(0)

  const [filteredData, setFilteredData] = useState([])

  const { register, watch, setValue } = useForm<SchemaFilter>()

  const filtroData = [
    {
      id: 'month',
      ocorrencia_tabela: 'Mês',
    },
    {
      id: 'week',
      ocorrencia_tabela: 'Semana',
    },
    {
      id: 'day',
      ocorrencia_tabela: 'Dia',
    },
  ]

  useEffect(() => {
    getQuantityRows()
    setSelection([])
  }, [])

  function BuscarFiltro() {
    setLoader(true)
    const situacaoFilter = watch('situacao_filter')
    const categoriaFilter = watch('categoria_filter')
    const dataFilter = watch('data_filter')

    const filterSelected = {
      data_filter: dataFilter,
      situacao_filter: situacaoFilter,
      categoria_filter: categoriaFilter,
    }

    // Inicialize a lista com os dados originais
    let filteredList = rows

    if (dataFilter) {
      filteredList = filteredList.filter((item: any) => {
        if(item.situacao != "Falecido"){
          if (item.data_nascimento != null) {
            const data_nasc = item.data_nascimento.split('/')

            if (dataFilter === 'Mês') {
              const filterMonth = data_nasc[1] === mes

              return filterMonth
            }

            if (dataFilter === 'Semana') {
              const filterWeek =
                semana.indexOf(parseInt(data_nasc[0], 10)) > -1 &&
                data_nasc[1] === mes

              return filterWeek
            }

            if (dataFilter === 'Dia') {
              const filterDay =
                parseInt(data_nasc[0], 10) === dia && data_nasc[1] === mes

              return filterDay
            }

            return true // Caso não seja nenhum dos filtros, incluir na lista
          } else {
            return false
          }
        } else {
          return false
        }
      })

      if (situacaoFilter) {
        filteredList = filteredList.filter((item: any) => {
          const situacaoMatch =
            item.situacao === situacaoFilter && item.situacao !== 'Falecido'
          return situacaoMatch
        })
      }

      if (categoriaFilter) {
        filteredList = filteredList.filter((item: any) => {
          return item.categoria === categoriaFilter
        })
      }

      if (filteredList.length > 0) {
        // Atualize o estado com os dados filtrados
        setLoader(false)
        setFilteredData(filteredList)
      } else {
        setLoader(false)
        toast.warn('A consulta não possui dados para serem exibidos.')
        setFilteredData([])
      }
    } else {
      setLoader(false)
      toast.error('Preencha os campos obrigatórios (*).')
    }
  }

  const getQuantityRows = async () => {
    const response = await fetch(`/api/parametros`)
    const data = await response.json()

    if (data) {
      setQuantidadeLinhas(data[0].quantidade_linhas_listas)
    }
  }

  const handleSelectionModelChange = (newSelectionModel: any) => {
    setSelection(newSelectionModel)
  }

  const gerarEtiqueta = () => {
    EtiquetaPDF(selectedRowIds)
    handleClose()
  }

  function valuesDefaultFilter() {
    setValue('data_filter', 'month')
    setValue('situacao_filter', '')
    setValue('categoria_filter', '')
  }

  useEffect(() => {
    if (rows.length == 1) {
      setSelection([rows[0].id])
    }
    valuesDefaultFilter()

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

    for (let i = 0; i < 7; i++) {
      diasDaSemana.push(new Date(date).getDate())
      date.setDate(date.getDate() + 1)
    }

    setSemana(diasDaSemana)
  }, [rows])

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            p: 4,
          }}
        >
          <p style={{ fontFamily: 'Roboto' }}>
            Confirma a impressão de etiquetas para os Associados selecionados.
          </p>
          <Box
            style={{
              marginTop: '1.5rem',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: '2rem',
              width: '100%',
            }}
          >
            <Button
              style={{ padding: '0.5rem', height: 'auto' }}
              onClick={gerarEtiqueta}
            >
              Ok
            </Button>
            <Button
              style={{ padding: '0.5rem', height: 'auto' }}
              onClick={handleClose}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>

      <HeaderBirthdays>
        <ContainerFilters>
          <div
            style={{
              display: 'flex',
              alignItems: 'end',
              gap: '0.5rem',
              width: '100%',
            }}
          >
            <SelectNoComplete
              p="0px 0px 0px 0.5rem"
              value={`${filterSelect.data_filter}`}
              title="Período *"
              data={filtroData}
              {...register('data_filter')}
            />
            <SelectNoComplete
              p="0px 0px 0px 0.5rem"
              value={`${filterSelect.situacao_filter}`}
              title="Situação"
              {...register('situacao_filter')}
              data={situacaoAssociado}
            />
            <SelectNoComplete
              p="0px 0px 0px 0.5rem"
              value={`${filterSelect.categoria_filter}`}
              title="Categoria"
              {...register('categoria_filter')}
              data={categoriaAssociado}
            />
            <ButtonEtiqueta
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
        </ContainerFilters>
        {selectedRowIds.length > 0 && (
          <ButtonEtiqueta
            style={{
              backgroundColor: `${'#0da9a4'}`,
              margin: '0px',
              fontSize: '12px',
              border: 'solid 1px',
              padding: '0.5rem',
            }}
            onClick={handleOpen}
            title={'Gerar etiqueta'}
          />
        )}
      </HeaderBirthdays>

      {filteredData.length > 0 && (
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
      )}

      {loader != false && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            marginTop: '1rem',
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}
    </>
  )
}

export default TableBirthdays
