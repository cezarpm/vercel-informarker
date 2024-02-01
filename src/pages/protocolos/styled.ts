import { styled } from '@ignite-ui/react'

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
})

export const ContentFilterDates = styled('div', {
  width: '30%',
  display: 'flex',
  flexDirection: 'column',
  p: {
    fontSize: '12px',
    width: '100px',
  },
  '>div': {
    marginTop: '0.5rem',
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',

    justifyContent: 'space-between',
  },
  article: {
    display: 'flex',
  },
  button: {
    margin: '0px',
    fontSize: '12px',
    border: 'solid 1px',
    padding: '0.3rem 0.5rem',
  },
})
