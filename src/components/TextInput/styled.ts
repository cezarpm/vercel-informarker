import { styled } from '@ignite-ui/react'
import TextField from '@mui/material/TextField'
import InputMask from 'react-input-mask'
export const Container = styled('div', {
  display: 'flex',
  alignItems: 'start',
  flex: 1,
  flexDirection: 'column',
})
export const ContainerTextField = styled(TextField, {})

export const ContainerMaskInput = styled('label', {
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'Roboto',
  fontSize: '12px',
  height: '100%',
  color: 'rgba(0, 0, 0, 0.6)',
  width: '$w',
})
export const ContentMaskInput = styled(InputMask, {
  fontFamily: 'roboto',
  fontSize: '16px',
  padding: '0.3rem',
  border: 'solid 1px rgba(0, 0, 0, 0.42)',
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
  borderTopColor: 'transparent',
  '&:focus': {
    outline: 'none',
    BorderBottomColor: 'rgba(0, 0, 0, 0.42)',
  },
})
