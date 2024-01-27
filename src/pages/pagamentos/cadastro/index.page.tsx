import { Container, Box, Text, ContentDate, FormError } from './styled'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { GetStaticProps } from 'next'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { SelectOptions } from '@/components/SelectOptions'
import { CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { schemaPagamentos } from './schemaPagamentos'
import { BackPage } from '@/components/BackPage'
import SelectNoComplete from '@/components/SelectNoComplete'
import { useArrayDate } from '@/utils/useArrayDate'
import { api } from '@/lib/axios'

type SchemaPagamentos = z.infer<typeof schemaPagamentos>

interface schemaTabelas {
  id: number
  codigo_tabela: string
  ocorrencia_tabela: string
  complemento_ocorrencia_selecao: string | null
  ocorrencia_ativa: boolean
}

interface TypeProps {
  dataTipoPagamento: schemaTabelas[]
}

export default function PagamentosCadastro({ dataTipoPagamento }: TypeProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<SchemaPagamentos>({
    resolver: zodResolver(schemaPagamentos),
  })

  function dateDefault() {
    setValue('data_pagto_unico', '')
    setValue('data_pagto_parcela_1', '')
    setValue('data_pagto_parcela_2', '')
    setValue('data_pagto_parcela_3', '')
  }

  useEffect(() => {
    dateDefault()
  }, [])
  async function handleOnSubmit(data: SchemaPagamentos) {
    const FormatDates = (day: string, month: string, yaer: string) => {
      let dateFormated
      if (day && month && yaer) {
        dateFormated = useArrayDate.MontarDate(
          data.yearPagtoUnic,
          data.monthPagtoUnic,
          data.dayPagtoUnic,
        )
      }
      return dateFormated
    }

    try {
      const datePagtoUnico = FormatDates(
        data.dayPagtoUnic,
        data.monthPagtoUnic,
        data.yearPagtoUnic,
      )

      const datePagtoParc1 = FormatDates(
        data.dayPagtoParc1,
        data.monthPagtoParc1,
        data.yearPagtoParc1,
      )
      const datePagtoParc2 = FormatDates(
        data.dayPagtoParc2,
        data.monthPagtoParc2,
        data.yearPagtoParc2,
      )
      const datePagtoParc3 = FormatDates(
        data.dayPagtoParc3,
        data.monthPagtoParc3,
        data.yearPagtoParc3,
      )
      const {
        dayPagtoParc1,
        dayPagtoParc2,
        dayPagtoParc3,
        dayPagtoUnic,
        monthPagtoParc1,
        monthPagtoParc2,
        monthPagtoParc3,
        monthPagtoUnic,
        yearPagtoParc1,
        yearPagtoParc2,
        yearPagtoParc3,
        yearPagtoUnic,
        ...newData
      } = data

      await api.post('/pagamentos/cadastro', {
        ...newData,
        data_pagto_unico: datePagtoUnico,
        data_pagto_parcela_1: datePagtoParc1 || null,
        data_pagto_parcela_2: datePagtoParc2 || null,
        data_pagto_parcela_3: datePagtoParc3 || null,
        valor_pagto_parcela_1: newData.valor_pagto_parcela_1 || null,
        valor_pagto_parcela_2: newData.valor_pagto_parcela_2 || null,
        valor_pagto_parcela_3: newData.valor_pagto_parcela_3 || null,
      })

      return toast.success('definir')
    } catch (error) {
      console.log(error)
      return toast.error('Ops algo deu errado...')
    }
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <BackPage backRoute="/pagamentos" />

        <fieldset>
          <legend>
            <span>
              <Link href={'/pagamentos'}>Pagamentos</Link>
            </span>
            <CaretRight size={14} />
            <span>Cadastro</span>
          </legend>

          <Box>
            <TextInput
              w={180}
              title="Matricula Associado na SAERJ *"
              {...register('matricula_saerj')}
              error={!!errors?.matricula_saerj?.message}
              helperText={errors?.matricula_saerj?.message}
            />
          </Box>

          <Box>
            <div>
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                title="Tipo de Pagamento *"
                value="Selecione"
                data={dataTipoPagamento}
                {...register('tipo_pagamento')}
              />
              <FormError>
                {errors.tipo_pagamento?.message === 'Required'
                  ? 'Campo Obrigatório'
                  : null}
              </FormError>
            </div>

            <TextInput
              w={180}
              title="Ano de Pagamento Anuidade"
              {...register('ano_anuidade')}
            />
          </Box>

          <Box>
            <ContentDate>
              <Text>Data Pagamento parcela única</Text>
              <SelectOptions
                description="dia"
                data={useArrayDate.Dia()}
                w={90}
                {...register('dayPagtoUnic')}
                // defaultValue={{ label: newDateAnuidade.dia }}
              />
              <SelectOptions
                data={useArrayDate.Mes()}
                description="mês"
                w={90}
                {...register('monthPagtoUnic')}
                // defaultValue={{ label: newDateAnuidade.mes }}
              />
              <SelectOptions
                w={120}
                description="ano"
                data={useArrayDate.AnoAtualMaior()}
                {...register('yearPagtoUnic')}
                // defaultValue={{ label: newDateAnuidade.ano }}
              />
            </ContentDate>

            <TextInput
              w={180}
              title="Valor Pagamento parcela única"
              {...register('valor_pagto_unico')}
            />
          </Box>

          <Box>
            <ContentDate>
              <Text>Data Pagamento 1ª parcela</Text>
              <SelectOptions
                description="dia"
                data={useArrayDate.Dia()}
                w={90}
                {...register('dayPagtoParc1')}
                // defaultValue={{ label: newDateAnuidade.dia }}
              />
              <SelectOptions
                data={useArrayDate.Mes()}
                description="mês"
                w={90}
                {...register('monthPagtoParc1')}
                // defaultValue={{ label: newDateAnuidade.mes }}
              />
              <SelectOptions
                w={120}
                description="ano"
                data={useArrayDate.AnoAtualMaior()}
                {...register('yearPagtoParc1')}
                // defaultValue={{ label: newDateAnuidade.ano }}
              />
            </ContentDate>

            <TextInput
              w={180}
              title="Valor Pagamento 1ª parcela"
              {...register('valor_pagto_parcela_1')}
            />
          </Box>

          <Box>
            <ContentDate>
              <Text>Data Pagamento 2ª parcela</Text>
              <SelectOptions
                description="dia"
                data={useArrayDate.Dia()}
                w={90}
                {...register('dayPagtoParc2')}
                // defaultValue={{ label: newDateAnuidade.dia }}
              />
              <SelectOptions
                data={useArrayDate.Mes()}
                description="mês"
                w={90}
                {...register('monthPagtoParc2')}
                // defaultValue={{ label: newDateAnuidade.mes }}
              />
              <SelectOptions
                w={120}
                description="ano"
                data={useArrayDate.AnoAtualMaior()}
                {...register('yearPagtoParc2')}
                // defaultValue={{ label: newDateAnuidade.ano }}
              />
            </ContentDate>

            <TextInput
              w={180}
              title="Valor Pagamento 2ª parcela"
              {...register('valor_pagto_parcela_2')}
            />
          </Box>

          <Box>
            <ContentDate>
              <Text>Data Pagamento 3ª parcela</Text>
              <SelectOptions
                description="dia"
                data={useArrayDate.Dia()}
                w={90}
                {...register('dayPagtoParc3')}
                // defaultValue={{ label: newDateAnuidade.dia }}
              />
              <SelectOptions
                data={useArrayDate.Mes()}
                description="mês"
                w={90}
                {...register('monthPagtoParc3')}
                // defaultValue={{ label: newDateAnuidade.mes }}
              />
              <SelectOptions
                w={120}
                description="ano"
                data={useArrayDate.AnoAtualMaior()}
                {...register('yearPagtoParc3')}
                // defaultValue={{ label: newDateAnuidade.ano }}
              />
            </ContentDate>

            <TextInput
              w={180}
              title="Valor Pagamento 3ª parcela"
              {...register('valor_pagto_parcela_3')}
            />
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

export const getStaticProps: GetStaticProps = async () => {
  try {
    const dataTipoPagamento = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Tipo_Pagamento',
      },
    })
    return {
      props: {
        dataTipoPagamento,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados de tipo de empresa:', error)
    return {
      props: {
        dataTipoPagamento: [],
      },
    }
  } finally {
    prisma.$disconnect()
  }
}
