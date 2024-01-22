import { Container, Box } from './styled'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { GetStaticProps } from 'next'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/Button'
import { api } from '@/lib/axios'
import axios from 'axios'
import { TextInput } from '@/components/TextInput'
import { SelectOptions } from '@/components/SelectOptions'
import { SwitchInput } from '@/components/SwitchInput'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { TextAreaInput } from '../atualizar/styled'
import { schemaPagamentos } from './schemaPagamentos'
import { BackPage } from '@/components/BackPage'
import SelectNoComplete from '@/components/SelectNoComplete'

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

  async function handleOnSubmit(data: SchemaPagamentos) {
    try {
      console.log(data)
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
              title="Matricula Associado na SAERJ *"
              {...register('matricula_saerj')}
              error={!!errors?.matricula_saerj?.message}
              helperText={errors?.matricula_saerj?.message}
            />
            <div>
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                title="Tipo de Pagamento *"
                value="Selecione"
                data={dataTipoPagamento}
                {...register('tipo_pagamento')}
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
