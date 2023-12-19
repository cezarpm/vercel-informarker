import { styled } from '@ignite-ui/react'
import TextField from '@mui/material/TextField'

export const Container = styled('div', {
  display: 'flex',
  alignItems: 'start',
  flex: 1,
  flexDirection: 'column',
})
export const ContainerTextField = styled(TextField, {})

export const FormErrorMessage = styled('p', {
  fontFamily: 'roboto',
  color: 'red',
  fontSize: '16px',
})
