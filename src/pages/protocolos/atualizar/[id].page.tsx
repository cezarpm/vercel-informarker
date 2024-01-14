import { Container, Box } from './styled';
import React, { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { GetServerSideProps, GetStaticProps } from 'next';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/Button';
import { api } from '@/lib/axios';
import { TextInput } from '@/components/TextInput';
import { SelectOptions } from '@/components/SelectOptions';
import { SwitchInput } from '@/components/SwitchInput';
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
// import 'react-date-picker/dist/DatePicker.css';
// import 'react-calendar/dist/Calendar.css';

const schemaProtocoloForm = z.object({
  id: z.number(),
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
  label: Number(index + 1),
}));

const monthOptionsData = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  label: Number(index + 1),
}));

const currentYear = new Date().getFullYear();

const yearOptionsData = Array.from(
  { length: currentYear - (currentYear - 30) + 1 },
  (_, index) => ({
    id: currentYear - 30 + index,
    label: Number(currentYear - 30 + index),
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
interface schemaProtocoloProps {
  data: SchemaProtocoloForm
}

export default function ProtocolosAtualizar({data}: schemaProtocoloProps) {
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
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<SchemaProtocoloForm>();

  async function OnSubmit(data: SchemaProtocoloForm) {
    var data_envio = new Date(data.data_envio_ano+'-'+data.data_envio_mes+'-'+data.data_envio_dia);
    var data_recebimento = new Date(data.data_recebimento_ano+'-'+data.data_recebimento_mes+'-'+data.data_recebimento_dia);
    
    if(data_recebimento < data_envio){
      toast.error('A data de recebimento deve ser maior que a data de envio.');
    }else{
      try {
        await api.put('/protocolos/update', { ...data })
        toast.success('Protocolo Atualizado')
        router.push('/protocolos')
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    setValue('id', data.id)
    setValue('num_protocolo', data.num_protocolo)
    setValue('assunto_protocolo', data.assunto_protocolo)
    setValue('tipo_protocolo', data.tipo_protocolo)
    setValue('data_recebimento_dia', data.data_recebimento_dia)
    setValue('data_recebimento_mes', data.data_recebimento_mes)
    setValue('data_recebimento_ano', data.data_recebimento_ano)
    setValue('data_envio_dia', data.data_envio_dia)
    setValue('data_envio_mes', data.data_envio_mes)
    setValue('data_envio_ano', data.data_envio_ano)
    setValue('meio_recebimento', data.meio_recebimento)
    setValue('meio_envio', data.meio_envio)
    setValue('quem_redigiu_documento_a_ser_enviado', data.quem_redigiu_documento_a_ser_enviado)
    setValue('entregue_em_maos', data.entregue_em_maos)
    setValue('doc_entrada_requer_resposta', data.doc_entrada_requer_resposta)
    setValue('data_encerramento_protocolo_dia', data.data_encerramento_protocolo_dia)
    setValue('data_encerramento_protocolo_mes', data.data_encerramento_protocolo_mes)
    setValue('data_encerramento_protocolo_ano', data.data_encerramento_protocolo_ano)
    setValue('usuario_encerramento_protocolo', data.usuario_encerramento_protocolo)
    
  }, [])

  return (
    <Container>
      <form onSubmit={handleSubmit(OnSubmit)}>
        <Box style={{ justifyContent: 'end' }}>
          <Link
            href="/protocolos"
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
              <Link href={'/protocolos'}>Protocolos</Link>
            </span>
            <CaretRight size={14} />
            <span>Atualizar</span>
          </legend>
          <Box>
            <div style={{ width: '10%' }}>
              <TextInput
                title="Número do Protocolo"
                {...register('num_protocolo')}
                defaultValue={data.num_protocolo}
              />
            </div>

            <div>
              <SelectOptions
                data={tipoProtocoloOptionsData}
                description="Tipo Protocolo"
                w={200}
                {...register('tipo_protocolo')}
                defaultValue={tipoProtocoloOptionsData.find(option => option.label === data.tipo_protocolo) || null}
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
                defaultValue={assuntoProtocoloOptionsData.find(option => option.label === data.assunto_protocolo) || null}
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
                maxWidth: '120px',
                width: '100%'
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
                defaultValue={dayOptionsData.find(option => option.label == data.data_recebimento_dia) || null}
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
                defaultValue={monthOptionsData.find(option => option.label == data.data_recebimento_mes) || null}
              />
            </div>

            <div>
              <SelectOptions
                data={yearOptionsData}
                description="Ano"
                w={150}
                {...register('data_recebimento_ano', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: value => parseInt(value), // Função para converter o valor para número
                })}
                defaultValue={yearOptionsData.find(option => option.label == data.data_recebimento_ano) || null}
              />
            </div>

            <div>
              <SelectOptions
                data={meioProtocoloOptionsData}
                description="Meio de Recebimento"
                w={225}
                {...register('meio_recebimento')}
                defaultValue={meioProtocoloOptionsData.find(option => option.label === data.meio_recebimento) || null}
              />
            </div>

            <div style={{ width: '15%' }}>
              <SwitchInput
                title="Documento de entrada requer resposta?"
                {...register('doc_entrada_requer_resposta')}
                defaultChecked={data.doc_entrada_requer_resposta}
              />
            </div>

            <div style={{ width: '15%' }}>
              <SwitchInput
                title="Entregue em mãos?"
                {...register('entregue_em_maos')}
                defaultChecked={data.entregue_em_maos}
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
                maxWidth: '120px',
                width: '100%'
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
                defaultValue={dayOptionsData.find(option => option.label == data.data_envio_dia) || null}
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
                defaultValue={monthOptionsData.find(option => option.label == data.data_envio_mes) || null}
              />
            </div>

            <div>
              <SelectOptions
                data={yearOptionsData}
                description="Ano"
                w={150}
                {...register('data_envio_ano', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: value => parseInt(value), // Função para converter o valor para número
                })}
                defaultValue={yearOptionsData.find(option => option.label == data.data_envio_ano) || null}
              />
            </div>

            <div>
              <SelectOptions
                data={meioProtocoloOptionsData}
                description="Meio de Envio"
                w={225}
                {...register('meio_envio')}
                defaultValue={meioProtocoloOptionsData.find(option => option.label == data.meio_envio) || null}
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
                defaultValue={quemRedigiuDocumentoOptionsData.find(option => option.label == data.quem_redigiu_documento_a_ser_enviado) || null}
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
                defaultValue={dayOptionsData.find(option => option.label == data.data_encerramento_protocolo_dia) || null}
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
                defaultValue={monthOptionsData.find(option => option.label == data.data_encerramento_protocolo_mes) || null}
              />
            </div>

            <div>
              <SelectOptions
                data={yearOptionsData}
                description="Ano"
                w={150}
                {...register('data_encerramento_protocolo_ano', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: value => parseInt(value), // Função para converter o valor para número
                })}
                defaultValue={yearOptionsData.find(option => option.label == data.data_encerramento_protocolo_ano) || null}
              />
            </div>
            <div style={{ width: '15%' }}>
              <TextInput
                title="Usuário Encerramento Protocolo"
                {...register('usuario_encerramento_protocolo')}
                defaultValue={data.usuario_encerramento_protocolo }
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
              <input type="file" multiple onChange={handleFileChange} />
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
            title={isSubmitting ? 'Enviando...' : 'Atualizar'}
            type="submit"
            disabled={isSubmitting}
          />
        </fieldset>
      </form>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: any = context.params

  try {
    const data = await prisma.protocolos.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (data) {
      var data_recebimento;
      var data_envio;
      var data_encerramento_protocolo;

      if (data.data_recebimento_ano && data.data_recebimento_mes && data.data_recebimento_dia ) {
        data_recebimento = new Date(
          data.data_recebimento_ano,
          data.data_recebimento_mes - 1,
          data.data_recebimento_dia
        );
      }
      
      if (data.data_envio_ano && data.data_envio_mes && data.data_envio_dia) {
        data_envio = new Date(
          data.data_envio_ano,
          data.data_envio_mes - 1,
          data.data_envio_dia
        );
      }

      if (data.data_encerramento_protocolo_ano && data.data_encerramento_protocolo_mes && data.data_encerramento_protocolo_dia) {
        data_encerramento_protocolo = new Date(
          data.data_encerramento_protocolo_ano,
          data.data_encerramento_protocolo_mes - 1,
          data.data_encerramento_protocolo_dia
        );
      }

      // Converter as propriedades de data para strings no formato ISO 8601
      const serializedData = {
        ...data,
        data_recebimento: data_recebimento ? data_recebimento.toISOString() : null,
        data_envio: data_envio ? data_envio.toISOString() : null,
        data_encerramento_protocolo: data_encerramento_protocolo ? data_encerramento_protocolo.toISOString() : null,
      };

      return {
        props: {
          data: serializedData,
        },
      };
    } else {
      console.error('Registro não encontrado');
      return {
        props: {
          data: {},
        },
      };
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
