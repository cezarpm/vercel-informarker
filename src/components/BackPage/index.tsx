import { ArrowBendDownLeft } from 'phosphor-react'
import { Box, Container } from './styled'
import Link from 'next/link'

interface schemaBackPageComponent {
  backRoute: string
}

export function BackPage({ backRoute }: schemaBackPageComponent) {
  return (
    <Container>
      <Box>
        <Link
          href={`/${backRoute}`}
          style={{
            textDecoration: 'none',
            fontFamily: 'Roboto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            color: '#000',
          }}
        >
          <ArrowBendDownLeft size={32} />
          Retornar
        </Link>
      </Box>
    </Container>
  )
}
