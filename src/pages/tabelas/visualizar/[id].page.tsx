import { Container, Box } from './styled'
import React from 'react'
import { z } from 'zod'
import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'
import { TextInput } from '@/components/TextInput'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { SwitchInput } from '@/components/SwitchInput'

const schemaCargos = z.object({
  codigo_tabela: z.string(),
  ocorrencia_tabela: z.string(),
  complemento_ocorrencia_selecao: z.string(),
  ocorrencia_ativa: z.string(),
})

type SchemaCargos = z.infer<typeof schemaCargos>

interface schemaCargos {
  data: SchemaCargos
}
export default function Vizualizar({ data }: schemaCargos) {
  return (
    <Container>
      <form>
        <Box>
          <Link
            href="/tabelas"
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
        <fieldset>
          <legend>
            <span>
              <Link href={'/tabelas'}>Tabelas</Link>
            </span>
            <CaretRight size={14} />
            {/* <Link href={'/tabelas/tratamentos'}>Tratamento</Link>
            <CaretRight size={14} /> */}
            <span>Visualizar</span>
          </legend>
          <Box>
            <TextInput title="Código tabela" value={data.codigo_tabela} />
            <TextInput
              title="Ocorrência tabela"
              value={data.ocorrencia_tabela}
            />
            <TextInput
              title="Complemento ocorrência para seleção"
              value={data.complemento_ocorrencia_selecao}
            />
            <SwitchInput
              title="Ocorrência Ativa?"
              defaultChecked={data.ocorrencia_ativa}
            />
          </Box>
        </fieldset>
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: any = context.params

  try {
    const data = await prisma.tabelas.findFirst({
      where: {
        id: Number(id),
      },
    })
    return {
      props: {
        data,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados de tipo de empresa:', error)
    return {
      props: {
        data: [],
      },
    }
  }
}
