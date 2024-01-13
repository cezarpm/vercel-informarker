import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import { useId } from '@/context'

export default function DataGridDemo({ rows, columns, w }: any) {
  const { setSelection, selectedRowIds } = useId()

  const handleSelectionModelChange = (newSelectionModel: any) => {
    setSelection(newSelectionModel)
    // console.log(newSelectionModel)
  }

  return (

    <Box sx={{ height: '60vh', width: w, marginTop: '1rem' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        rowSelectionModel={selectedRowIds}
        onRowSelectionModelChange={handleSelectionModelChange}
      />
    </Box>
  )
}
