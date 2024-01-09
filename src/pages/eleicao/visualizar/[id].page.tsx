import { Container, Box } from './styled'
import React, { useEffect } from 'react'
import { z } from 'zod'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { ArrowBendDownLeft } from 'phosphor-react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/axios'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next/types'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { SelectOptions } from '@/components/SelectOptions'
import { Typography } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
const integranteSchema = z.object({
  nome: z.string().min(1, { message: 'O campo nome é obrigatório' }),
})

const schemaChapaForm = z.object({
  nome_da_chapa: z
    .string()
    .min(1, { message: 'O campo nome da chapa é obrigatório' }),
  data_inicio: z.coerce.date(),
  data_fim: z.coerce.date(),
  chapas: z.array(integranteSchema).nonempty(),
})


type SchemaChapaForm = z.infer<typeof schemaChapaForm>

export default function VotacaoAtualizar({ data }) {
  const router = useRouter()

  const { id }: any = router.query


  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
    setValue,
  } = useForm<SchemaChapaForm>({
    resolver: zodResolver(schemaChapaForm),
  })

  async function handleOnSubmit(data: SchemaChapaForm) {
    console.log(data);

    const selectedChapas = data.chapas.map((chapa) => {
      const chapaSelected = chapas.find((item) => item.nome_chapa === chapa.nome)
      return chapaSelected
    })

    const body = {
      nome_da_chapa: data.nome_da_chapa,
      data_inicio: data.data_inicio,
      data_fim: data.data_fim,
      chapas: selectedChapas
    }

    await api.post('/eleicao/cadastro', body)

    router.push('/eleicao/lista')
    return toast.success('Chapa cadastrada!')
  }

  const { fields, append, remove } = useFieldArray({
    name: 'chapas',
    control,
  })

  useEffect(() => {
    if (data) {
      setValue('matricula_saerj', data.matricula_saerj)
      setValue('data_votacao_inicio', dayjs(data.data_votacao_inicio))
      setValue('data_votacao_fim', dayjs(data.data_votacao_fim))

    }
  }, [data])


  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Box>
          <Link
            href="/eleicao/lista"
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
          <Box>
            <TextInput
              title="Nome da eleicao *"
              {...register('matricula_saerj')}
            />

            <Controller
              control={control}
              name="data_votacao_inicio"
              rules={{
                required: {
                  value: true,
                  message: "Start date is required",
                },
              }}

              render={({ field: { onChange, value, ref } }) => (
                <DateTimePicker
                  label="Start Date"
                  disablePast
                  onChange={onChange}
                  onAccept={onChange}
                  value={value}
                  inputRef={ref}
                />
              )}
            />

            <Controller
              control={control}
              name="data_votacao_fim"
              rules={{
                required: {
                  value: true,
                  message: "Start date is required",
                },
              }}

              render={({ field: { onChange, value, ref } }) => (
                <DateTimePicker
                  label="Start Date"
                  disablePast
                  onChange={onChange}
                  onAccept={onChange}
                  value={value}
                  inputRef={ref}
                />
              )}
            />

          </Box>

          <Box>

            <Typography variant="h6" component="div">
              Selecione a chapa
            </Typography>

            <Button
              onClick={() => append({ nome: '' })}
              type="button"
              title="+ Adicionar membro"
              style={{ margin: '0px', width: '100%', fontSize: '12px' }}
            />

            {fields.map((membro, index) =>
              <SelectOptions
                key={index}
                description="Tipo Empresa"
                data={chapas.map((chapa) => chapa.nome_chapa)}
                w={280}
                {...register(`chapas.${index}.nome` as const)}
              />
            )}



          </Box>

          <Button
            title={isSubmitting ? 'Enviando...' : 'Enviar'}
            type="submit"
          />
        </fieldset>
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: any = context.params

  try {
    const data = await prisma.votacao.findFirst({
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
