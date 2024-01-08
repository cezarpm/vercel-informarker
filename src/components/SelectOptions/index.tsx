import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { Container } from './styled'
import { forwardRef } from 'react'

interface schemaSelectOptions {
  data: any
  description: string
  w?: number
  defaultValue?: any
}

// eslint-disable-next-line react/display-name
export const SelectOptions = forwardRef<any, any>((props, ref) => {
  const { data, description, w, defaultValue, ...rest }: schemaSelectOptions =
    props
  return (
    <Container>
      <Autocomplete
        getOptionLabel={(option) =>
          typeof option === 'object' ? String(option.label) : String(option)
        }
        disablePortal
        options={data}
        sx={{ width: w }}
        size="small"
        ref={ref}
        // getOptionLabel={(option: any) => option.label}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        defaultValue={defaultValue}
        renderInput={(params) => {
          return <TextField {...params} label={description} {...rest} />
        }}
      />
    </Container>
  )
})
