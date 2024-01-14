import { Container, Box, Text } from './styled'
import React, { useEffect } from 'react'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { Typography } from '@mui/material'
import { SelectOptions } from '@/components/SelectOptions'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'

// array dias
const days = Array.from({ length: 31 }, (_, index) => ({
  label: (index + 1).toString(),
}))
const dataDays = days.map((item) => item)

// array mes
const months = Array.from({ length: 12 }, (_, index) => ({
  label: (index + 1).toString(),
}))
const dataMonths = months.map((item) => item)

// array anos
const yearCurrent = new Date().getFullYear()
const years = Array.from({ length: 10 }, (_, index) =>
  (yearCurrent + index).toString(),
)
const dataYears = years.map((year) => {
  return {
    label: year,
  }
})


const integranteSchema = z.object({
  nome_chapa: z.string().min(1, { message: 'O campo nome é obrigatório' }),
})

const schemaChapaForm = z.object({
  matricula_saerj: z
    .string()
    .min(1, { message: 'O campo nome da chapa é obrigatório' }),
  chapas: z.array(integranteSchema).min(2, { message: 'A votação precisa ter no mínimo 2 chapas!' }),
  start_day: z.string().min(1, { message: 'O campo dia é obrigatório' }),
  start_month: z.string().min(1, { message: 'O campo mês é obrigatório' }),
  start_year: z.string().min(1, { message: 'O campo mês é obrigatório' }),
  end_day: z.string().min(1, { message: 'O campo mês é obrigatório' }),
  end_month: z.string().min(1, { message: 'O campo mês é obrigatório' }),
  end_year: z.string().min(1, { message: 'O campo mês é obrigatório' }),
})

type SchemaChapaForm = z.infer<typeof schemaChapaForm>

export default function VotacaoCreate({ chapas }: any) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
  } = useForm<SchemaChapaForm>({
    resolver: zodResolver(schemaChapaForm),
  })


  async function handleOnSubmit(data: SchemaChapaForm) {
    const concatDate = `${data.start_month}-${data.start_day}-${data.start_year}`
    const newDate = new Date(concatDate).toISOString()

    const concatDateEnd = `${data.end_month}-${data.end_day}-${data.end_year}`
    const newDateEnd = new Date(concatDateEnd).toISOString()


    const selectedChapas = data.chapas.map((chapa) => {
      const chapaSelected = chapas.find((item: any) => item.nome_chapa === chapa.nome_chapa)
      return chapaSelected
    })

    const body = {
      matricula_saerj: data.matricula_saerj,
      data_votacao_inicio: newDate,
      data_votacao_fim: newDateEnd,
      chapas: selectedChapas,
      status: 'ATIVO'
    }

    await api.post('/eleicao/cadastro', body)

    router.push('/eleicao/lista')
    return toast.success('Eleição cadastrada!')
  }

  const { fields, append } = useFieldArray({
    name: 'chapas',
    control,
  })

  useEffect(() => {
    console.log(errors);


    if (errors.chapas) {
      toast.error("A votação precisa ter no mínimo 2 chapas!")
    }

  }, [errors])


  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Box style={{ justifyContent: 'end' }}>
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
          <legend>
            <span>
              <Link href={'/eleicao/lista'}>Eleição</Link>
            </span>
            <CaretRight size={14} />
            <span>Incluir</span>
          </legend>
          <Box>
            <div style={{ width: '30%' }}>
              <TextInput
                title="Nome da eleição *"
                {...register('matricula_saerj')}
                error={errors.matricula_saerj?.message}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'end', width: '31rem' }}>
              <Text>
                Data de início da votação
              </Text>

              <SelectOptions
                description="Dia"
                data={dataDays}
                w={90}
                {...register('start_day')}
                error={errors.start_day?.message}
                messageError='O campo nome da eleição é obrigatório'
              />

              <SelectOptions
                data={dataMonths}
                description="Mês"
                w={90}
                {...register('start_month')}
                error={errors.start_month?.message}
                messageError='O campo nome da eleição é obrigatório'
              />

              <SelectOptions
                w={120}
                description="Ano"
                data={dataYears}
                {...register('start_year')}
                error={errors.start_year?.message}
                messageError='O campo nome da eleição é obrigatório'
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'end', width: '32rem' }}>
              <Text>
                Data de término da votação
              </Text>

              <SelectOptions
                description="Dia"
                data={dataDays}
                w={90}
                {...register('end_day')}
                error={errors.end_day?.message}
                messageError='O campo nome da eleição é obrigatório'
              />

              <SelectOptions
                data={dataMonths}
                description="Mês"
                w={90}
                {...register('end_month')}
                error={errors.end_month?.message}
                messageError='O campo nome da eleição é obrigatório'
              />

              <SelectOptions
                w={120}
                description="Ano"
                data={dataYears}
                {...register('end_year')}
                error={errors.end_year?.message}
                messageError='O campo nome da eleição é obrigatório'
              />
            </div>

          </Box>

          <Box>
            <Typography variant="h6" component="div">
              Adicionar chapas na eleição
            </Typography>

            <Button
              onClick={() => append({ nome_chapa: '' })}
              type="button"
              title="+ Adicionar"
              style={{ margin: '0px', width: '100%', fontSize: '12px' }}
            />


          </Box>


          {fields.map((membro, index) =>
            <Box key={index}>
              <SelectOptions
                description="Selecione a chapa"
                data={chapas.map((chapa: any) => chapa.nome_chapa)}
                w={280}
                {...register(`chapas.${index}.nome_chapa` as const)}
                messageError='O campo nome da eleição é obrigatório'
                error={errors.chapas?.[index]?.nome_chapa?.message}
              />
            </Box>
          )}

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

  try {
    const data = await prisma.chapas.findMany()


    return {
      props: {
        chapas: data,
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
