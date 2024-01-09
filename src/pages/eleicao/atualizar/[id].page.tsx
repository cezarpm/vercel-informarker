import { Container, Box,Text } from './styled'
import React, { useEffect } from 'react'
import { z } from 'zod'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
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
import { DateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'

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
  start_day: z.string(),
  start_month: z.string(),
  start_year: z.string(),
  end_day: z.string(),
  end_month: z.string(),
  end_year: z.string(),
  status: z.string().min(1, { message: 'O campo status é obrigatório' }),
})


type SchemaChapaForm = z.infer<typeof schemaChapaForm>

export default function VotacaoAtualizar({ data, chapas }) {
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

    console.log(concatDate, 'concatDate');

    const newDate = new Date(concatDate).toISOString()

    

    const concatDateEnd = `${data.end_month}-${data.end_day}-${data.end_year}`
    const newDateEnd = new Date(concatDateEnd).toISOString()

    const selectedChapas = data.chapas.map((chapa) => {
      const chapaSelected = chapas.find((item) => item.nome_chapa === chapa.nome_chapa)
      return chapaSelected
    })

    const body = {
      id: Number(id),
      matricula_saerj: data.matricula_saerj,
      data_votacao_inicio: newDate,
      data_votacao_fim: newDateEnd,
      chapas: selectedChapas,
      status: data.status,
    }
    
    await api.put('/eleicao/update', body)

    router.push('/chapas')
    return toast.success('Chapa cadastrada!')
  }

  const { fields, append, remove } = useFieldArray({
    name: 'chapas',
    control,
  })

  useEffect(() => {
    console.log(data, 'data');

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
              />

              <SelectOptions
                data={dataMonths}
                description="Mês"
                defaultValue={mesAno}
                w={90}
                {...register('start_month')}
              />

              <SelectOptions
                w={120}
                description="Ano"
                defaultValue={anoTotal}
                data={dataYears}
                {...register('start_year')}
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
              />

              <SelectOptions
                data={dataMonths}
                description="Mês"
                defaultValue={mesAnoEnd}
                w={90}
                {...register('end_month')}
              />

              <SelectOptions
                w={120}
                description="Ano"
                data={dataYears}
                defaultValue={anoTotalEnd}
                {...register('end_year')}
              />
            </div>

            <SelectOptions
                description="Selecione a chapa"
                data={['ATIVO', 'INATIVO']}
                w={280}
                defaultValue={data.status}
                {...register('status')}
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
                data={chapas.map((chapa) => chapa.nome_chapa)}
                w={280}
                defaultValue={membro.nome_chapa}
                {...register(`chapas.${index}.nome_chapa` as const)}
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
