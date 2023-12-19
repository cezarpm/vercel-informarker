import { Container, Box } from './styled'
import React from 'react'
import { z } from 'zod'
import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'
import { TextInput } from '@/components/TextInput'
import { CaretRight } from 'phosphor-react'
import Link from 'next/link'

const schemaCargos = z.object({
  name: z.string().min(5, { message: 'campo precisa conter min 5 caracteres' }),
})

type SchemaCargos = z.infer<typeof schemaCargos>

interface schemaCargos {
  data: SchemaCargos
}
export default function Vizualizar({ data }: schemaCargos) {
  return (
    <Container>
      <form>
        <fieldset>
          <legend>
            <span>
              <Link href={'/tabelas'}>Tabelas</Link>
            </span>
            <CaretRight size={14} />
            <Link href={'/tabelas/cargos'}>Cargos</Link>
            <CaretRight size={14} />
            <span>Visualizar</span>
          </legend>
          <Box>
            <TextInput title="Nome" value={data.name} />
          </Box>
        </fieldset>
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: any = context.params

  try {
    const data = await prisma.cargos.findFirst({
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
