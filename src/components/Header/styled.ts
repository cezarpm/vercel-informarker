import { styled } from '@ignite-ui/react'

export const Container = styled('header', {
  padding: `1rem 4rem`,
  backgroundColor: '#0DA9A4',
  a: {
    textDecoration: 'none',
    fontFamily: 'Roboto',
    color: '#fff',
    fontWeight: '500',
    fontSize: '0.875rem',
  },
  nav: {
    display: `flex`,
    alignItems: `center`,
    justifyContent: `space-between`,
    flexWrap: 'wrap',
    gap: `2rem`,
  },
})
