import { styled } from '@ignite-ui/react'

export const Container = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  button: {
    width: '100%',
    backgroundColor: '#0DA9A4',
    fontSize: '15px',
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: '15px',
    borderRadius: '8px',
    textAlign: 'center',
    padding: '1rem 1rem',
    border: 'none',
    color: '#fff',
    marginTop: '2rem',
    '&:hover': {
      backgroundColor: '#0c9894',
      cursor: 'pointer',
    },
  },
})
