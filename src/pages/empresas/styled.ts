import { Button, styled } from '@ignite-ui/react'

export const Container = styled('main', {
  padding: '2rem 4rem',
  h1: {
    fontFamily: 'Roboto',
  },
  p: {
    fontFamily: 'Roboto',
  },
})

export const Box = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2rem',
  width: '100%',
  button: {
    padding: '1rem 2rem',
  },
})

export const ButtonEtiqueta = styled(Button, {
  heigth: 'auto',
  padding: '.5rem',
})
