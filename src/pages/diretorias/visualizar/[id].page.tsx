import Link from 'next/link'
import { Box, Container } from './styled'
import { CaretRight } from 'phosphor-react'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { TextInput } from '@/components/TextInput'

import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'

const schemaDiretoriaForm = z.object({
  numero_eleicao: z.number().min(1, 'Informe o número da eleição'),
  cod_chapa: z.string().min(1, 'Informe o código da chapa'),
  matricula_saerj: z.number().min(1, 'Informe a matrícula saerj'),
  candidato_cargo: z.string().min(1, 'Informe o candidato ao cargo'),
})

type SchemaDiretoriaForm = z.infer<typeof schemaDiretoriaForm>

export default function Visualizar({ data }: any) {
  const {
    register,
    formState: { errors },
  } = useForm<SchemaDiretoriaForm>({
    resolver: zodResolver(schemaDiretoriaForm),
    defaultValues: {
      candidato_cargo: data.candidato_cargo ? data.candidato_cargo : '',
      cod_chapa: data.cod_chapa ? data.cod_chapa : '',
      matricula_saerj: data.matricula_saerj ? data.matricula_saerj : '',
      numero_eleicao: data.numero_eleicao ? data.numero_eleicao : '',
    },
  })

  return (
    <Container>
      <form>
        <fieldset>
          <legend>
            <Link href={'/diretorias'}>Diretorias</Link>
            <CaretRight size={14} />
            <span>Visualizar</span>
          </legend>

          <Box>
            <TextInput
              title="Numero da Eleição"
              type="number"
              messageError={errors.numero_eleicao?.message}
              {...register('numero_eleicao', {
                valueAsNumber: true,
              })}
              disabled
            />
            <TextInput
              title="Codigo da chapa"
              {...register('cod_chapa')}
              messageError={errors.cod_chapa?.message}
              disabled
            />

            <TextInput
              title="Matrícula SAERJ"
              type="number"
              {...register('matricula_saerj', {
                valueAsNumber: true,
              })}
              messageError={errors.matricula_saerj?.message}
              disabled
            />

            <TextInput
              title="Candidato ao cargo"
              {...register('candidato_cargo')}
              messageError={errors.candidato_cargo?.message}
              disabled
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
    const response = await prisma.diretorias.findFirst({
      where: {
        id: Number(id),
      },
    })

    const data = response

    return {
      props: {
        data,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados das diretorias:', error)
    return {
      props: {
        data: [],
      },
    }
  }
}
