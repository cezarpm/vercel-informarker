/* eslint-disable eqeqeq */
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import { useContextCustom } from '@/context'

import { Container } from './styled'
import { SetStateAction, useEffect, useState } from 'react'
import { api } from '@/lib/axios'
import CircularProgress from '@mui/material/CircularProgress'

export default function DataGridDemo({ rows, columns, w }: any) {
  const { setSelection, selectedRowIds, setVoltarPagina, voltarPagina } =
    useContextCustom()
  const [pageCache, setPageCache] = useState(0)
  const [linhas, setLinhas] = useState([])

  const handleSelectionModelChange = (newSelectionModel: any) => {
    setSelection(newSelectionModel)

    if (newSelectionModel) {
      setVoltarPagina(pageCache)
    }
  }

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

  useEffect(() => {
    if (rows.length == 1) {
      setSelection([rows[0].id])
    } else {
      setSelection([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows])

  console.log(voltarPagina, pageCache)

  return (
    <Container>
      <Box
        sx={{
          height: linhas[0] === 8 ? '100%' : '50vh',
          width: w,
          marginTop: '1rem',
        }}
      >
        {linhas.length > 0 ? (
          <DataGrid
            rows={rows}
            rowHeight={34}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  // setar valor da paginacao
                  page: voltarPagina,
                  pageSize: linhas[0] !== undefined ? linhas[0] : 10,
                },
              },
            }}
            pageSizeOptions={linhas !== undefined ? linhas : [10]}
            checkboxSelection
            disableRowSelectionOnClick
            rowSelectionModel={selectedRowIds}
            onRowSelectionModelChange={handleSelectionModelChange}
            // buscar pagina atual
            onPaginationModelChange={(params) => setPageCache(params.page)}
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
