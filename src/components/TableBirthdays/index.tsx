/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import { useContextCustom } from '@/context'
import {
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { ContainerFilters, HeaderBirthdays } from './styled'
import { Button } from '@ignite-ui/react'
import { EtiquetaPDF } from '@/utils/ticketsAssociates'
import { Button as ButtonEtiqueta } from '../Button'

const TableBirthdays = ({ rows, columns, w }: any) => {
  const { setSelection, selectedRowIds } = useContextCustom()

  const [filter, setFilter] = useState('0')
  const [quantidadeLinhas, setQuantidadeLinhas] = useState(10)

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [mes, setMes] = React.useState<string>('')
  const [semana, setSemana] = React.useState<number[]>([])
  const [dia, setDia] = React.useState<number>(0)

  const [filteredData, setFilteredData] = React.useState([])

  useEffect(() => {
    getQuantityRows()
    setSelection([])
  }, [])

  useEffect(() => {
    if (rows.length == 1) {
      setSelection([rows[0].id])
    }

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
  }, [filter, rows])

  useEffect(() => {
    setFilteredData(
      rows.filter((item: any) => {
        if (item.data_nascimento != null) {
          const data_nasc = item.data_nascimento.split('/')

          if (filter === 'month') {
            const filterMonth = data_nasc[1] === mes

            return filterMonth
          }

          if (filter === 'week') {
            const filterWeek =
              semana.indexOf(parseInt(data_nasc[0], 10)) > -1 &&
              data_nasc[1] === mes

            return filterWeek
          }

          if (filter === 'day') {
            const filterDay =
              parseInt(data_nasc[0], 10) === dia && data_nasc[1] === mes

            return filterDay
          }

          return true // Caso não seja nenhum dos filtros, incluir na lista
        } else {
          return false
        }
      }),
    )
  }, [mes, semana, dia])

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

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilter(event.target.value)
  }

  const gerarEtiqueta = () => {
    EtiquetaPDF(selectedRowIds)
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
          <InputLabel sx={{ fontSize: '12px' }}>
            Por favor selecione um filtro
          </InputLabel>
          <Select
            size="small"
            sx={{ width: '30%', fontSize: '12px' }}
            defaultValue={filter}
            label={'Filtros'}
            onChange={handleFilterChange}
          >
            <MenuItem sx={{ fontSize: '12px' }} value={'0'}>
              Selecione
            </MenuItem>
            <MenuItem sx={{ fontSize: '12px' }} value={'month'}>
              Mês
            </MenuItem>
            <MenuItem sx={{ fontSize: '12px' }} value={'week'}>
              Semana
            </MenuItem>
            <MenuItem sx={{ fontSize: '12px' }} value={'day'}>
              Dia
            </MenuItem>
          </Select>
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

      {filter !== '0' && (
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
    </>
  )
}

export default TableBirthdays
