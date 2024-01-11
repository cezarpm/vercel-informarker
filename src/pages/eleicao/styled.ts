import { styled } from '@ignite-ui/react'

export const Container = styled('main', {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '2rem 4rem',
  h1: {
    fontFamily: 'Roboto',
  },
  p: {
    fontFamily: 'Roboto',
  },
})

export const ConfirmationModal = styled('div', {
  padding: '2rem',
  textAlign: 'center',
  borderRadius: '20px',
})

export const WelcomeModal = styled('div', {
  padding: '2rem',
  textAlign: 'center',
  borderRadius: '20px',
})

export const BoxOptions = styled('div', {
  display: 'flex',
  gap: '3rem',
  alignItems: 'flex-start',
  margin: '1rem 0',
})

export const BoxOptionName = styled('div', {
  flex: 1,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '.5rem',
  borderRadius: '0.5rem',
  backgroundColor: '#70B888',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
})

export const BoxCandidates = styled('div', {
  display: 'flex',
  gap: '1rem',
  backgroundColor: 'white',
  border: '1px solid black',
  alignItems: 'center',
  padding: '.3rem',
  margin: '1rem 0',
  borderRadius: '0.5rem',
})

export const CanditateName = styled('p', {})

export const CanditatePosition = styled('p', {})

export const Checkbox = styled('input', {
  width: '1.5rem',
  height: '47px',
  cursor: 'pointer',
  maxHeight: '47px',
})

export const WhiteButton = styled('div', {
  flex: 1,
  display: 'flex',
  height: '47px',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '.5rem',
  borderRadius: '0.5rem',
  backgroundColor: 'white',
  border: '1px solid black',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
})

export const NulableButton = styled('div', {
  flex: 1,
  display: 'flex',
  height: '47px',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '.5rem',
  borderRadius: '0.5rem',
  backgroundColor: 'red',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
})

export const OutlinedButton = styled('button', {
  width: '100%',
  backgroundColor: 'white',
  fontSize: '15px',
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '15px',
  borderRadius: '8px',
  textAlign: 'center',
  padding: '1rem 1rem',
  color: 'black',
  marginTop: '2rem',
  border: '1px solid black',
  cursor: 'pointer',
})
