import { ArrowBendDownLeft } from 'phosphor-react'
import { Box, Container } from './styled'
import Link from 'next/link'
import { useContextCustom } from '@/context'

interface schemaBackPageComponent {
  backRoute: string
  discartPageBack?: any
}

export function BackPage({
  backRoute,
  discartPageBack,
}: schemaBackPageComponent) {
  const { setVoltarPagina } = useContextCustom()
  return (
    <Container>
      <Box>
        <Link
          href={`/${backRoute}`}
          onClick={discartPageBack ? setVoltarPagina(0) : null}
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
          <ArrowBendDownLeft size={24} />
          Retornar
        </Link>
      </Box>
    </Container>
  )
}
