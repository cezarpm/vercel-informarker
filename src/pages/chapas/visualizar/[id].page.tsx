import { Container, Box } from './styled'
import React, { useEffect } from 'react'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { TextInput } from '@/components/TextInput'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next/types'
import { Typography } from '@mui/material'

const integranteSchema = z.object({
  nome: z.string().min(1, { message: 'O campo nome é obrigatório' }),
  cargo: z.string().min(1, { message: 'O campo cargo é obrigatório' }),
  image: z.string().min(1, { message: 'O campo imagem é obrigatório' }),
})

const schemaChapaForm = z.object({
  nome_da_chapa: z
    .string()
    .min(1, { message: 'O campo nome da chapa é obrigatório' }),
  integrantes: z.array(integranteSchema).nonempty(),
})

type SchemaChapaForm = z.infer<typeof schemaChapaForm>



export default function VotacaoAtualizar({ data }: any) {
  const {
    register,
    setValue,
    formState: { errors },
    control,
  } = useForm<SchemaChapaForm>({
    resolver: zodResolver(schemaChapaForm),
  })

  const { fields } = useFieldArray({
    name: 'integrantes',
    control,
  })

  useEffect(() => {
    setValue('nome_da_chapa', data.nome_chapa)
    setValue('integrantes', data.membros_chapa)
  }, [data, setValue])

  console.log(data);


  return (
    <Container>
      <form>
        <Box>
          <Link
            href="/chapas"
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
              <Link href={'/chapas'}>Chapas</Link>
            </span>
            <CaretRight size={14} />
            <span>Visualizar</span>
          </legend>
          <Box>
            <TextInput
              title="Nome da chapa *"
              {...register('nome_da_chapa')}
              helperText={errors.nome_da_chapa?.message}
              error={!!errors.nome_da_chapa?.message}
            />
          </Box>

          <Box>
            <h1>Composição da chapa</h1>
          </Box>

          <div style={{ display: 'flex', gap: 15 }}>
            {fields.map((membro, index) => {


              return (
                <Box key={index}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                    <img style={{
                      width: 150,
                      height: 150,
                      objectFit: 'cover',
                    }}

                      src={membro.image} />


                    <Typography style={{
                      fontSize: 10,
                    }}>
                      {membro.cargo}
                    </Typography>

                    <Typography style={{ fontWeight: 'bold' }}>
                      {membro.nome}
                    </Typography>
                  </div>

                </Box>
              )
            })}
          </div>
        </fieldset>
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: any = context.params

  try {
    const data = await prisma.chapas.findFirst({
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
  } finally {
    prisma.$disconnect()
  }
}
