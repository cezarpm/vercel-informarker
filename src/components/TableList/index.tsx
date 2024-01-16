import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import { useId } from '@/context'
import { useEffect, useState } from 'react'

export default function DataGridDemo({ rows, columns, w }: any) {
  const { setSelection, selectedRowIds } = useId()
  const [quantidadeLinhas, setQuantidadeLinhas] = useState(10);

  useEffect(() => {
    getQuantityRows();
    setSelection([]);
  },[]);

  useEffect(() => {
    if(rows.length == 1){
      setSelection([rows[0].id])
    }
  },[rows]);

  const handleSelectionModelChange = (newSelectionModel: any) => {
    setSelection(newSelectionModel)
  }

  
  const getQuantityRows = async () => {
    const response = await fetch(`/api/parametros`);
    const data = await response.json();
    

    if(data){
        setQuantidadeLinhas(data[0].quantidade_linhas_listas);
        console.log(data[0].quantidade_linhas_listas)
    }

  }

  return (

    <Box sx={{ height: '60vh', width: w, marginTop: '1rem' }}>
      <DataGrid
        rows={rows}
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
  )
}
