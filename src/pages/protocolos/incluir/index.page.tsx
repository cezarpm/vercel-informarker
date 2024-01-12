import { Container, Box } from './styled';
import React, { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { GetStaticProps } from 'next';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/Button';
import { api } from '@/lib/axios';
import axios from 'axios';
import { TextInput } from '@/components/TextInput';
import { SelectOptions } from '@/components/SelectOptions';
import { SwitchInput } from '@/components/SwitchInput';
import { CaretRight } from 'phosphor-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
// import 'react-date-picker/dist/DatePicker.css';
// import 'react-calendar/dist/Calendar.css';

const schemaProtocoloForm = z.object({
  num_protocolo: z.string(),
  assunto_protocolo: z.string(),
  tipo_protocolo: z.string(),
  data_recebimento_dia: z.number(),
  data_recebimento_mes: z.number(),
  data_recebimento_ano: z.number(),
  data_envio_dia: z.number(),
  data_envio_mes: z.number(),
  data_envio_ano: z.number(),
  meio_recebimento: z.string(),
  meio_envio: z.string(),
  quem_redigiu_documento_a_ser_enviado: z.string(),
  entregue_em_maos: z.boolean(),
  doc_entrada_requer_resposta: z.boolean(),
  anexos: z.string(), // ALTERAR PARA ANEXO DE ARQUIVO
  data_encerramento_protocolo_dia: z.number(),
  data_encerramento_protocolo_mes: z.number(),
  data_encerramento_protocolo_ano: z.number(),
  usuario_encerramento_protocolo: z.string(), // ALTERAR PARA USUÁRIO
});

const dayOptionsData = Array.from({ length: 31 }, (_, index) => ({
  id: index + 1,
  label: `${index + 1}`,
}));

const monthOptionsData = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  label: `${index + 1}`,
}));

const currentYear = new Date().getFullYear();

const yearOptionsData = Array.from(
  { length: currentYear - (currentYear - 30) + 1 },
  (_, index) => ({
    id: currentYear - 30 + index,
    label: `${currentYear - 30 + index}`,
  }),
);

// ATUALIZAR QUANDO HOUVER API CORRESPONDENTE - TIPO PROTOCOLO

/* 
      const response = await api.get('/tabelas')
      const filteredResponse = response.data.filter(tabela => {
        tabela.Cod_Tabela === "Tipo_Protocol"
      })
      const finalResponse = []
      filteredResponse.forEach(response => finalResponse.push(response.Ocorrencia_Tab))

      const tipoProtocoloOptions = []
      for(let i = 1; i <= finalResponse.length; i++){
        tipoProtocoloOptions.push({
          id: i,
          label: finalResponse[i]
        })
      }
  */
const tipoProtocoloOptionsData = [
  { id: 1, label: 'Entrada' },
  { id: 2, label: 'Saída' },
];

// ATUALIZAR QUANDO HOUVER API CORRESPONDENTE - MEIO PROTOCOLO

/* 
      const response = await api.get('/tabelas')
      const filteredResponse = response.data.filter(tabela => {
        tabela.Cod_Tabela === "Meio_Protocol"
      })
      const finalResponse = []
      filteredResponse.forEach(response => finalResponse.push(response.Ocorrencia_Tab))

      const meioProtocoloOptions = []
      for(let i = 1; i <= finalResponse.length; i++){
        meioProtocoloOptions.push({
          id: i,
          label: finalResponse[i]
        })
      }
  */
const meioProtocoloOptionsData = [
  { id: 1, label: 'Corrêio' },
  { id: 2, label: 'Email' },
  { id: 3, label: 'Whatsapp' },
  { id: 4, label: 'Web Site' },
];

// ATUALIZAR QUANDO HOUVER API CORRESPONDENTE - ASSUNTO PROTOCOLO

/* 
      const response = await api.get('/tabelas')
      const filteredResponse = response.data.filter(tabela => {
        tabela.Cod_Tabela === "Assunto_Protocol"
      })
      const finalResponse = []
      filteredResponse.forEach(response => finalResponse.push(response.Ocorrencia_Tab))

      const assuntoProtocoloOptions = []
      for(let i = 1; i <= finalResponse.length; i++){
        assuntoProtocoloOptions.push({
          id: i,
          label: finalResponse[i]
        })
      }
  */
const assuntoProtocoloOptionsData = [
  { id: 1, label: 'Protocolo de Entrada' },
  { id: 2, label: 'Protocolo de Saída' },
  { id: 3, label: 'Confidencial' },
];

// ATUALIZAR QUANDO HOUVER API CORRESPONDENTE - QUEM REDIGIU O DOCUMENTO A SER ENVIADO

/* 
      const response = await api.get('/tabelas')
      const filteredResponse = response.data.filter(tabela => {
        tabela.Cod_Tabela === "Quem_Redigiu_Documento_Protocol"
      })
      const finalResponse = []
      filteredResponse.forEach(response => finalResponse.push(response.Ocorrencia_Tab))

      const quemRedigiuDocumentoOptionsData = []
      for(let i = 1; i <= finalResponse.length; i++){
        quemRedigiuDocumentoOptionsData.push({
          id: i,
          label: finalResponse[i]
        })
      }
  */
const quemRedigiuDocumentoOptionsData = [{ id: 1, label: 'Dr. Calazan' }];

type SchemaProtocoloForm = z.infer<typeof schemaProtocoloForm>;

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Protocolos() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      const filesArray = Array.from(fileList);
      setSelectedFiles(filesArray);
    }
  };

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SchemaProtocoloForm>();

  async function handleOnSubmit(data: SchemaProtocoloForm) {
    console.log(data)

    try {
      console.log(data);
      await api.post('/protocolos/incluir', { ...data });
      router.push('/protocolos');
      return toast.success('Protocolo cadastrado!');
    } catch (error) {
      console.log(error);
      return toast.error('Ops, algo deu errado ao cadastrar o protocolo...');
    }
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <fieldset>
          <legend>
            <span>
              <Link href={'/protocolos'}>Protocolos</Link>
            </span>
            <CaretRight size={14} />
            <span>Cadastro</span>
          </legend>
          <Box>
            <div style={{ width: '10%' }}>
              <TextInput
                title="Número do Protocolo"
                {...register('num_protocolo')}
                messageError={errors.num_protocolo?.message}
              />
            </div>

            <div>
              <SelectOptions
                data={tipoProtocoloOptionsData}
                description="Tipo Protocolo"
                w={200}
                {...register('tipo_protocolo')}
              />
            </div>
          </Box>

          <Box>
            <div>
              <SelectOptions
                data={assuntoProtocoloOptionsData}
                description="Assunto Protocolo"
                w={500}
                {...register('assunto_protocolo')}
              />
            </div>
          </Box>

          <Box>
            <p
              style={{
                borderBottomColor: '#A9A9B2',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontWeight: '400',
                lineHeight: '1.4375em',
                letterSpacing: '0.00938em',
              }}
            >
              Data de Recebimento
            </p>

            <div>
              <SelectOptions
                data={dayOptionsData}
                description="Dia"
                w={100}
                {...register('data_recebimento_dia', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: value => parseInt(value), // Função para converter o valor para número
                })}
              />
            </div>

            <div>
              <SelectOptions
                data={monthOptionsData}
                description="Mês"
                w={100}
                {...register('data_recebimento_mes', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: value => parseInt(value), // Função para converter o valor para número
                })}
              />
            </div>

            <div>
              <SelectOptions
                data={yearOptionsData}
                description="Ano"
                w={100}
                {...register('data_recebimento_ano', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: value => parseInt(value), // Função para converter o valor para número
                })}
              />
            </div>

            <div>
              <SelectOptions
                data={meioProtocoloOptionsData}
                description="Meio de Recebimento"
                w={225}
                {...register('meio_recebimento')}
              />
            </div>

            <div style={{ width: '15%' }}>
              <SwitchInput
                title="Documento de entrada requer resposta?"
                {...register('doc_entrada_requer_resposta')}
              />
            </div>

            <div style={{ width: '15%' }}>
              <SwitchInput
                title="Entregue em mãos?"
                {...register('entregue_em_maos')}
              />
            </div>
          </Box>

          <Box>
            <p
              style={{
                borderBottomColor: '#A9A9B2',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontWeight: '400',
                lineHeight: '1.4375em',
                letterSpacing: '0.00938em',
              }}
            >
              Data de Envio
            </p>

            <div>
              <SelectOptions
                data={dayOptionsData}
                description="Dia"
                w={100}
                {...register('data_envio_dia', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: value => parseInt(value), // Função para converter o valor para número
                })}
              />
            </div>

            <div>
              <SelectOptions
                data={monthOptionsData}
                description="Mês"
                w={100}
                {...register('data_envio_mes', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: value => parseInt(value), // Função para converter o valor para número
                })}
              />
            </div>

            <div>
              <SelectOptions
                data={yearOptionsData}
                description="Ano"
                w={100}
                {...register('data_envio_ano', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: value => parseInt(value), // Função para converter o valor para número
                })}
              />
            </div>

            <div>
              <SelectOptions
                data={meioProtocoloOptionsData}
                description="Meio de Envio"
                w={225}
                {...register('meio_envio')}
              />
            </div>
          </Box>

          <Box>
            <div>
              <SelectOptions
                data={quemRedigiuDocumentoOptionsData}
                description="Quem redigiu documento a ser enviado?"
                w={500}
                {...register('quem_redigiu_documento_a_ser_enviado')}
              />
            </div>
          </Box>

          <Box>
            <p
              style={{
                borderBottomColor: '#A9A9B2',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontWeight: '400',
                lineHeight: '1.4375em',
                letterSpacing: '0.00938em',
              }}
            >
              Data de Encerramento do Protocolo
            </p>

            <div>
              <SelectOptions
                data={dayOptionsData}
                description="Dia"
                w={100}
                {...register('data_encerramento_protocolo_dia', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: value => parseInt(value), // Função para converter o valor para número
                })}
              />
            </div>

            <div>
              <SelectOptions
                data={monthOptionsData}
                description="Mês"
                w={100}
                {...register('data_encerramento_protocolo_mes', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: value => parseInt(value), // Função para converter o valor para número
                })}
              />
            </div>

            <div>
              <SelectOptions
                data={yearOptionsData}
                description="Ano"
                w={100}
                {...register('data_encerramento_protocolo_ano', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: value => parseInt(value), // Função para converter o valor para número
                })}
              />
            </div>
            <div style={{ width: '15%' }}>
              <TextInput
                title="Usuário Encerramento Protocolo"
                {...register('usuario_encerramento_protocolo')}
              />
            </div>
          </Box>

          <Box>
            <div>
              <h4
                style={{
                  borderBottomColor: '#A9A9B2',
                  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                  fontWeight: '400',
                  lineHeight: '1.4375em',
                  letterSpacing: '0.00938em',
                }}
                className="files_names"
              >
                Anexos
              </h4>
              <input type="file" multiple onInput={handleFileChange} />
              {selectedFiles.length > 0 && (
                <div>
                  <b>
                    <h4
                      style={{
                        borderBottomColor: '#A9A9B2',
                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                        fontWeight: 'bold',
                        lineHeight: '1.4375em',
                        letterSpacing: '0.00938em',
                      }}
                    >
                      Arquivos selecionados:
                    </h4>
                  </b>

                  <ul
                    style={{
                      borderBottomColor: '#A9A9B2',
                      fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                      fontWeight: '400',
                      lineHeight: '1.4375em',
                      letterSpacing: '0.00938em',
                    }}
                  >
                    {selectedFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
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
  );
}
