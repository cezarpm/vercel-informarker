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
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next/types'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { SelectOptions } from '@/components/SelectOptions'
import { Typography } from '@mui/material'

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
  chapas: z.array(integranteSchema).nonempty(),
  start_day: z.string().min(1, { message: 'O campo dia é obrigatório' }),
  start_month: z.string().min(1, { message: 'O campo mês é obrigatório' }),
  start_year: z.string().min(1, { message: 'O campo ano é obrigatório' }),
  end_day: z.string().min(1, { message: 'O campo dia é obrigatório' }),
  end_month: z.string().min(1, { message: 'O campo mês é obrigatório' }),
  end_year: z.string().min(1, { message: 'O campo ano é obrigatório' }),
  status: z.string().min(1, { message: 'O campo status é obrigatório' }),
})


type SchemaChapaForm = z.infer<typeof schemaChapaForm>


type VotacaoAtualizarProps = {
  data: any
  chapas: any
}

export default function VotacaoAtualizar({ data, chapas }: VotacaoAtualizarProps) {
  const newDate = new Date(data.data_votacao_inicio)
  const diaMes = String(newDate.getDate())
  const mesAno = String(newDate.getMonth() + 1)
  const anoTotal = String(newDate.getFullYear())

  const endData = new Date(data.data_votacao_fim)
  const diaMesEnd = String(endData.getDate())
  const mesAnoEnd = String(endData.getMonth() + 1)
  const anoTotalEnd = String(endData.getFullYear())

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
    const concatDate = `${data.start_month}-${data.start_day}-${data.start_year}`

    const newDate = new Date(concatDate).toISOString()
    const concatDateEnd = `${data.end_month}-${data.end_day}-${data.end_year}`
    const newDateEnd = new Date(concatDateEnd).toISOString()
    const today = new Date().toISOString().slice(0, 10);
    const inputDate = newDate.slice(0, 10);
    

    const selectedChapas = data.chapas.map((chapa) => {
      const chapaSelected = chapas.find((item: any) => item.nome_chapa === chapa.nome_chapa)
      return chapaSelected
    })

    if (newDate > newDateEnd) {
      return toast.error('A data de início não pode ser maior que a data de término!')
    }

    if (newDate === newDateEnd) {
      return toast.error('A data de início não pode ser igual a data de término!')
    }

    
    if (inputDate < today) {
      return toast.error('A data de início não pode ser menor que a data atual!');
    }


    const body = {
      id: Number(id),
      matricula_saerj: data.matricula_saerj,
      data_votacao_inicio: newDate,
      data_votacao_fim: newDateEnd,
      chapas: selectedChapas,
      status: data.status,
    }

    await api.put('/eleicao/update', body)

    router.push('/eleicao/lista')
    return toast.success('Eleição atualizada!')
  }

  const { fields, append } = useFieldArray({
    name: 'chapas',
    control,
  })

  useEffect(() => {
    if (data) {
      setValue('matricula_saerj', data.matricula_saerj)
      setValue('chapas', data.chapas.chapas)
      setValue('status', data.status)
      setValue('start_day', diaMes)
      setValue('start_month', mesAno)
      setValue('start_year', anoTotal)
      setValue('end_day', diaMesEnd)
      setValue('end_month', mesAnoEnd)
      setValue('end_year', anoTotalEnd)
    }
  }, [data, setValue])


  useEffect(() => {
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
            <span>Atualizar</span>
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
                defaultValue={diaMes}
                w={90}
                {...register('start_day')}
                error={errors.start_day?.message}

              />

              <SelectOptions
                data={dataMonths}
                description="Mês"
                defaultValue={mesAno}
                w={90}
                {...register('start_month')}
                error={errors.start_month?.message}

              />

              <SelectOptions
                w={120}
                description="Ano"
                defaultValue={anoTotal}
                data={dataYears}
                {...register('start_year')}
                error={errors.start_year?.message}

              />
            </div>

            <div style={{ display: 'flex', alignItems: 'end', width: '32rem' }}>
              <Text>
                Data de término da votação
              </Text>

              <SelectOptions
                description="Dia"
                data={dataDays}
                defaultValue={diaMesEnd}
                w={90}
                {...register('end_day')}
                error={errors.end_day?.message}


              />

              <SelectOptions
                data={dataMonths}
                description="Mês"
                defaultValue={mesAnoEnd}
                w={90}
                {...register('end_month')}
                error={errors.end_month?.message}

              />

              <SelectOptions
                w={120}
                description="Ano"
                data={dataYears}
                defaultValue={anoTotalEnd}
                {...register('end_year')}
                error={errors.end_year?.message}

              />
            </div>

            <SelectOptions

              description="Está ativa?"
              data={['ATIVA', 'INATIVA']}
              w={280}
              defaultValue={data.status}
              {...register('status')}
              error={errors.status?.message}

            />

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
                defaultValue={membro.nome_chapa}
                {...register(`chapas.${index}.nome_chapa` as const)}
                error={errors.chapas?.[index]?.nome_chapa?.message}
              />
            </Box>
          )}

          <Button
            title={isSubmitting ? 'Enviando...' : 'Enviar'}
            disabled={isSubmitting}
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

    const chapas = await prisma.chapas.findMany()

    return {
      props: {
        data,
        chapas,
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
