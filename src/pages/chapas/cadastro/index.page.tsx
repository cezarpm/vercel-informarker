import Link from 'next/link'
import { Box, Container, Text } from './styled'
import { CaretRight } from 'phosphor-react'
import { MenuItem, Select } from '@mui/material'

import { SelectOptions } from '@/components/SelectOptions'

import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'

const schemaChapaForm = z.object({
  titulo_chapa: z.string().min(2, 'Informe o nome da chapa'),
  nome_presidente: z.string().min(2, 'Informe o nome da chapa'),
  pessoas_compoe: z.array(z.string()).nullable(),
  day: z.string(),
  month: z.string(),
  year: z.string(),
})

type SchemaChapaForm = z.infer<typeof schemaChapaForm>

export default function Cadastro() {
  const router = useRouter()
  const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
  ]

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<SchemaChapaForm>({
    resolver: zodResolver(schemaChapaForm),
    defaultValues: {
      titulo_chapa: '',
      nome_presidente: '',
      pessoas_compoe: [],
    },
  })

  async function handleOnSubmit(dataForm: SchemaChapaForm) {
    const concatDate = `${dataForm.day}-${dataForm.month}-${dataForm.year}`
    const newDate = new Date(concatDate)
    const pessoasString = dataForm.pessoas_compoe?.join(',')
    const data = {
      titulo_chapa: dataForm.titulo_chapa,
      nome_presidente: dataForm.nome_presidente,
      pessoas_compoe: pessoasString,
      data_formacao: newDate,
    }

    try {
      await api.post('/chapas/cadastro', { data })
      router.push('/chapas')
      return toast.success('Chapa cadastrada!')
    } catch (error) {
      return toast.error('Ops algo deu errado...')
    }
  }

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

  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <fieldset>
          <legend>
            <Link href={'/chapas'}>Chapas</Link>
            <CaretRight size={14} />
            <span>Cadastro</span>
          </legend>

          <Box>
            <TextInput
              title="Nome da Chapa"
              messageError={errors.titulo_chapa?.message}
              {...register('titulo_chapa')}
              minW={'20rem'}
            />
            <TextInput
              title="Nome do presidente"
              {...register('nome_presidente')}
              minW={'20rem'}
              messageError={errors.nome_presidente?.message}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                width: '32rem',
              }}
            >
              <Text>Data de formação da chapa:</Text>
              <SelectOptions
                description="Dia"
                data={dataDays}
                w={90}
                {...register('day')}
              />
              <SelectOptions
                description="Mes"
                data={dataMonths}
                w={90}
                {...register('month')}
              />
              <SelectOptions
                description="Ano"
                data={dataYears}
                w={120}
                {...register('year')}
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                flex: 1,
                minWidth: '20rem',
              }}
            >
              <Text>Pessoas que compõe a chapa:</Text>
              <Controller
                control={control}
                name="pessoas_compoe"
                render={({ field: { onChange, value } }) => (
                  <Select
                    sx={{
                      borderBottom: '1px solid',
                      borderRadius: '0',
                      borderBottomColor: '#A9A9B2',
                      color: '#A9A9B2',
                    }}
                    value={value instanceof Array ? [...value] : []}
                    multiple
                    onChange={onChange}
                  >
                    {names.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </div>
          </Box>
          <Button
            title={isSubmitting ? 'Enviando...' : 'Enviar'}
            type="submit"
            disabled={isSubmitting}
          />
        </fieldset>
      </form>
    </Container>
  )
}
