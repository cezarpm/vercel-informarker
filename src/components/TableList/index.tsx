/* eslint-disable eqeqeq */
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import { useId } from '@/context'

import { Container } from './styled'
import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'
import CircularProgress from '@mui/material/CircularProgress'

export default function DataGridDemo({ rows, columns, w }: any) {
  const { setSelection, selectedRowIds } = useId()

  useEffect(() => {
    if (rows.length == 1) {
      setSelection([rows[0].id])
    } else {
      setSelection([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows])

  const handleSelectionModelChange = (newSelectionModel: any) => {
    setSelection(newSelectionModel)
  }
  const [linhas, setLinhas] = useState([])

  useEffect(() => {
    async function GetParams() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const response = await api.get('/parametros')
        const quantidadeLinhasParametros = await response.data.map(
          (item: { quantidade_linhas_listas: number }): any =>
            item.quantidade_linhas_listas,
        )
        setLinhas(quantidadeLinhasParametros)
      } catch (error) {
        console.log(error)
      }
    }
    GetParams()
  }, [])

  return (
    <Container>
      <Box sx={{ height: '50vh', width: w, marginTop: '1rem' }}>
        {linhas.length > 0 ? (
          <DataGrid
            rows={rows}
            rowHeight={34}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: linhas[0] !== undefined ? linhas[0] : 10,
                },
              },
            }}
            pageSizeOptions={linhas !== undefined ? linhas : [10]}
            checkboxSelection
            disableRowSelectionOnClick
            rowSelectionModel={selectedRowIds}
            onRowSelectionModelChange={handleSelectionModelChange}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        )}
      </Box>
    </Container>
  )
}
