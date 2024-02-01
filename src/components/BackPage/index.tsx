import { ArrowBendDownLeft } from 'phosphor-react'
import { Box, Container } from './styled'
import Link from 'next/link'
import { useContextCustom } from '@/context'

interface schemaBackPageComponent {
  backRoute: string
  discartPageBack?: any
}
async function limparCache() {
  const cache = await caches.open('cache')
  const chaves = await cache.keys()
  await Promise.all(chaves.map((chave) => cache.delete(chave)))
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
          onClick={() => {
            // eslint-disable-next-line no-unused-expressions
            discartPageBack
              ? (setVoltarPagina(0),
                localStorage.removeItem('@paginationOld'),
                localStorage.removeItem('@filtro'),
                localStorage.removeItem('@valuesSelected'),
                localStorage.removeItem('@pageCache'),
                limparCache())
              : null
          }}
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
