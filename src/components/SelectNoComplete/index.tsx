import * as React from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

interface schemaSelect {
  value?: any
  title: string
  data: any
}

export default function SelectNoComplete({
  value,
  title,
  data,
  ...rest
}: schemaSelect) {
  //   const [age, setAge] = React.useState('')

  //   const handleChange = (event: SelectChangeEvent) => {
  //     setAge(event.target.value as string)
  //   }

  return (
    <Box sx={{ width: '100%' }}>
      <InputLabel sx={{ fontSize: '12px' }}>{title}</InputLabel>
      <Select
        size="small"
        sx={{ width: '100%', fontSize: '12px' }}
        defaultValue={value}
        label={title}
        // onChange={onChange}
        {...rest}
      >
        <MenuItem sx={{ fontSize: '12px' }} value={value}>
          {value}
        </MenuItem>
        {data &&
          data?.map((item: any) => {
            return (
              <MenuItem
                sx={{ fontSize: '12px' }}
                key={item.id}
                value={item.ocorrencia_tabela}
              >
                {item.ocorrencia_tabela}
              </MenuItem>
            )
          })}
        {/* <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem> */}
      </Select>
    </Box>
  )
}
