import { Box, Container, Text } from './styled'
import React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { SwitchInput } from '@/components/SwitchInput'
import { prisma } from '@/lib/prisma'
import { GetStaticProps } from 'next'
import { SelectOptions } from '@/components/SelectOptions'
import { CaretRight } from 'phosphor-react'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'

interface schemaCategorias {
  label: string
}

const schemaParams = z.object({
  // random: z.string(),
  cep_invalido: z.boolean(),
  data_limite_pgto_antecipado_anuidade: z.date(),
  percent_desc_pgto_antecipado_anuidade: z.number(),
  taxa_pgto_atrasado_anuidade: z.number(),
  categorias: z.string(),
  parcelamento_permitido_anuidade: z.string(),
  parcelamento_permitido_JAER: z.string(),
  data_limite_pgto_antecipado_JAER: z.date(),
  percent_desc_pgto_antecipado_JAER: z.number(),
  taxa_pgto_atrasado_JAER: z.number(),
  presidente_pode_se_reeleger: z.boolean(),
  demais_podem_se_reeleger: z.boolean(),
  duracao_mandato: z.number(),
  exite_listas_imediato: z.boolean(),
  quantidade_linhas_listas: z.number(),
  acesso_externo_sis: z.boolean(),
  endereco_IP_primario: z.string(),
  endereco_IP_secundario: z.string(),
  day: z.number(),
  month: z.number(),
  year: z.number(),
  dayJaer: z.number(),
  monthJaer: z.number(),
  yearJaer: z.number(),
})

type SchemaParametros = z.infer<typeof schemaParams>
interface schemaParametrosProps {
  newDataCategory: schemaCategorias[]
}
export default function Parametros({ newDataCategory }: schemaParametrosProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<SchemaParametros>()

  async function handleOnSubmit(data: SchemaParametros) {
    try {
      const dataLimitePagamentoAntecipadoAnuidade = `${data.year}-${data.month}-${data.day} 00:00:00`
      const dataLimitePagamentoAntecipadoAnuidadeDate: Date = new Date(
        dataLimitePagamentoAntecipadoAnuidade,
      )
      setValue(
        'data_limite_pgto_antecipado_anuidade',
        dataLimitePagamentoAntecipadoAnuidadeDate,
      )

      const dataLimitePagamentoAntecipadoJaer = `${data.yearJaer}-${data.monthJaer}-${data.dayJaer} 00:00:00`
      const dataLimitePagamentoAntecipadoComoDateJaerDate: Date = new Date(
        dataLimitePagamentoAntecipadoJaer,
      )
      setValue(
        'data_limite_pgto_antecipado_JAER',
        dataLimitePagamentoAntecipadoComoDateJaerDate,
      )

      const response = await api.put('/parametros/update', {
        cep_invalido: data.cep_invalido,
        data_limite_pgto_antecipado_anuidade:
          data.data_limite_pgto_antecipado_anuidade,
        percent_desc_pgto_antecipado_anuidade:
          data.percent_desc_pgto_antecipado_anuidade,
        taxa_pgto_atrasado_anuidade: data.taxa_pgto_atrasado_anuidade,
        categorias: data.categorias,
        parcelamento_permitido_anuidade: data.parcelamento_permitido_anuidade,
        data_limite_pgto_antecipado_JAER: data.data_limite_pgto_antecipado_JAER,
        percent_desc_pgto_antecipado_JAER:
          data.percent_desc_pgto_antecipado_JAER,
        taxa_pgto_atrasado_JAER: data.taxa_pgto_atrasado_JAER,
        parcelamento_permitido_JAER: data.parcelamento_permitido_JAER,
        presidente_pode_se_reeleger: data.presidente_pode_se_reeleger,
        demais_podem_se_reeleger: data.demais_podem_se_reeleger,
        duracao_mandato: data.duracao_mandato,
        exite_listas_imediato: data.exite_listas_imediato,
        quantidade_linhas_listas: data.quantidade_linhas_listas,
        acesso_externo_sis: data.acesso_externo_sis,
        endereco_IP_primario: data.endereco_IP_primario,
        endereco_IP_secundario: data.endereco_IP_secundario,
      })
      if (response.status === 200) {
        toast.success('Alterado com sucesso!')
      } else {
        toast.error('Algo deu errado')
      }
    } catch (error) {
      console.log(error)
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
            <span>Parametros</span>
            <CaretRight size={14} />
            <span>Atualizar</span>
          </legend>
          <Box>
            <SwitchInput
              title="Acesso externo ao sistema autorizado?"
              {...register('acesso_externo_sis')}
            />
            <SwitchInput title="CEP inválido" {...register('cep_invalido')} />
          </Box>
          <Box>
            <div style={{ display: 'flex', alignItems: 'end', width: '38rem' }}>
              <Text>
                Data limite pagamento antecipado anuidade com desconto:
              </Text>

              <SelectOptions
                description="Dia"
                data={dataDays}
                w={90}
                {...register('day')}
              />

              <SelectOptions
                data={dataMonths}
                description="Mês"
                w={90}
                {...register('month')}
              />

              <SelectOptions
                w={120}
                description="Ano"
                data={dataYears}
                {...register('year')}
              />
            </div>
            <TextInput
              type="number"
              title="% Desconto Pgto Antecipado Anuidade"
              {...register('percent_desc_pgto_antecipado_anuidade')}
            />

            <TextInput
              type="number"
              title="Taxa (valor) pagamento da Anuidade após o prazo"
              {...register('taxa_pgto_atrasado_anuidade')}
            />

            {/* <TextInput
              type="date"
              title="Data limite para pagamento antecipado da Anuidade com desconto?"
              {...register('Data_Limite_Pgto_Antecipado_Anuidade')}
            /> */}
            <SelectOptions
              {...register('parcelamento_permitido_anuidade')}
              w={440}
              data={newDataCategory}
              description="Parcelamento Anuidade Permitido para Categorias"
            />
          </Box>

          <Box>
            <div style={{ display: 'flex', alignItems: 'end', width: '38rem' }}>
              <Text>
                Data limite para pagamento antecipado da JAER com desconto:
              </Text>

              <SelectOptions
                description="Dia"
                data={dataDays}
                w={90}
                {...register('dayJaer')}
              />

              <SelectOptions
                data={dataMonths}
                description="Mês"
                w={90}
                {...register('monthJaer')}
              />

              <SelectOptions
                w={120}
                description="Ano"
                data={dataYears}
                {...register('yearJaer')}
              />
            </div>

            <TextInput
              type="number"
              title="% Desconto Pgto antecipado JAER"
              {...register('percent_desc_pgto_antecipado_JAER', {
                valueAsNumber: true,
              })}
            />
            <TextInput
              type="number"
              title="Taxa (valor) para pagamento JAER após o prazo"
              {...register('taxa_pgto_atrasado_JAER', {
                valueAsNumber: true,
              })}
            />
            <SelectOptions
              data={newDataCategory}
              w={440}
              description="Parcelamento JAER Permitido para Categorias"
              {...register('parcelamento_permitido_JAER')}
            />

            {/* <label style={{ display: `flex`, gap: `0.5rem` }}>
                      Parcelamento Anuidade Permitido para Categorias
                      <select
                        {...register(
                          'Parcelamento_Permitido_Anuidade_categoriaId',
                          { valueAsNumber: true },
                        )}
                      >
                        {category &&
                          category?.map((item) => {
                            return (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            )
                          })}
                      </select>
                    </label> */}

            {/* <Input
              type="datetime-local"
              description="Data limite para pagamento antecipado da JAER com desconto?"
              {...register('Data_Limite_Pgto_Antecipado_JAER')}
            /> */}
          </Box>

          <Box>
            <TextInput
              type="number"
              w={300}
              title="Duracao mandato da diretoria em anos"
              {...register('duracao_mandato', { valueAsNumber: true })}
            />
            <SwitchInput
              title="Presidente pode se reeleger?"
              {...register('presidente_pode_se_reeleger')}
            />

            <SwitchInput
              title="Demais membros da diretoria podem se reeleger?"
              {...register('demais_podem_se_reeleger')}
            />
            <SwitchInput
              title="Exibe listas na imediato ou aguarda clicar botao pesquisar"
              {...register('exite_listas_imediato')}
            />
            <TextInput
              type="number"
              title="Quantidade de linhas por pagina nas listas"
              {...register('quantidade_linhas_listas', {
                valueAsNumber: true,
              })}
            />
          </Box>

          <Box>
            <div>
              <TextInput
                title="Endereco IP primario"
                w={280}
                {...register('endereco_IP_primario')}
              />
            </div>
            <div>
              <TextInput
                title="Endereco IP secundario SAERJ"
                w={280}
                {...register('endereco_IP_secundario')}
              />
            </div>
          </Box>
          <Button
            disabled={isSubmitting}
            title={isSubmitting ? 'Atualizando...' : 'Atualizar'}
          />
        </fieldset>
      </form>
    </Container>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const dataCategory = await prisma.categorias.findMany()
    const newDataCategory = dataCategory.map((item) => {
      return {
        label: item.name,
      }
    })

    return {
      props: {
        newDataCategory,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados de tipo de empresa:', error)
    return {
      props: {
        newDataCategory: [],
      },
    }
  }
}
