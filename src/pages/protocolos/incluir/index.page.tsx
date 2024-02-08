/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
import { Container, Box, Text, FormError } from "./styled";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { GetServerSideProps, GetStaticProps } from "next";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";
import { api } from "@/lib/axios";
import axios, { AxiosError } from "axios";
import { TextInput } from "@/components/TextInput";
import { SelectOptions } from "@/components/SelectOptions";
import { SwitchInput } from "@/components/SwitchInput";
import { ArrowBendDownLeft, CaretRight } from "phosphor-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useArrayDate } from "../../../utils/useArrayDate";
import { BackPage } from "../../../components/BackPage";

// import 'react-date-picker/dist/DatePicker.css';
// import 'react-calendar/dist/Calendar.css';

const schemaProtocoloForm = z.object({
  num_protocolo: z.string().min(1, { message: "Campo obrigatório" }),
  assunto_protocolo: z.string().min(1, { message: "Campo obrigatório" }),
  tipo_protocolo: z.string().min(1, { message: "Campo obrigatório" }),
  data_recebimento_dia: z.string(),
  data_recebimento_mes: z.string(),
  data_recebimento_ano: z.string(),
  data_envio_dia: z.string(),
  data_envio_mes: z.string(),
  data_envio_ano: z.string(),
  meio_recebimento: z.string(),
  meio_envio: z.string(),
  entregue_em_maos: z.boolean(),
  obrigatoria_resp_receb: z.boolean(),
  anexos: z.any(), // ALTERAR PARA ANEXO DE ARQUIVO
  data_encerramento_protocolo_dia: z.string(),
  data_encerramento_protocolo_mes: z.string(),
  data_encerramento_protocolo_ano: z.string(),
  usuario_encerramento: z.any(), // ALTERAR PARA USUÁRIO
});

type SchemaProtocoloForm = z.infer<typeof schemaProtocoloForm>

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
  { id: 1, label: "Entrada" },
  { id: 2, label: "Saída" },
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
  { id: 1, label: "Corrêio" },
  { id: 2, label: "Email" },
  { id: 3, label: "Whatsapp" },
  { id: 4, label: "Web Site" },
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
  { id: 1, label: "Protocolo de Entrada" },
  { id: 2, label: "Protocolo de Saída" },
  { id: 3, label: "Confidencial" },
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
const quemRedigiuDocumentoOptionsData = [{ id: 1, label: "" }];

interface schemaTabelas {
  id: number
  label: string
}

interface schemaProtocolos {
  dataCategory: schemaTabelas
  dataMeioProtocol: schemaTabelas
}

// PUXAR DE TABELAS, QUANDO NECESSÁRIO!
const usuarioEncerramento = [
  {
    id: 1,
    label: 'ALM - Andrea Laino Marinho',
  },
  {
    id: 2,
    label: 'MAA - Marcelo Artur Almeida Santos'
  },
  {
    id: 2,
    label: 'TSA - Tania Santos de Andrade Barbosa'
  }
]

export default function Protocolos({ dataCategory, dataMeioProtocol }: schemaProtocolos) {
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
  } = useForm<SchemaProtocoloForm>({
    resolver: zodResolver(schemaProtocoloForm)
  });

  const dataDays = useArrayDate.Dia();
  const dataMonths = useArrayDate.Mes();
  const dataYears = useArrayDate.AnoAtualMenor();

  async function handleOnSubmit(data: SchemaProtocoloForm) {
    const datasRecebimento = verificaData(data, "recebimento");
    const datasEncerramento = verificaData(data, "encerramento");
    console.log(data)
    let dataEnvio;
    let dataRecebimento;
    let dataEncerramento;

    if (data.data_envio_dia && data.data_envio_mes && data.data_envio_ano) {
      dataEnvio = useArrayDate.MontarDate(
        (data.data_envio_ano),
        data.data_envio_mes,
        data.data_envio_dia
      );
    }

    if (
      data.data_recebimento_dia &&
      data.data_recebimento_mes &&
      data.data_recebimento_ano
    ) {
      dataRecebimento = useArrayDate.MontarDate(
        data.data_recebimento_ano,
        data.data_recebimento_mes,
        data.data_recebimento_dia
      );
    }

    if (
      data.data_encerramento_protocolo_dia &&
      data.data_encerramento_protocolo_mes &&
      data.data_encerramento_protocolo_ano
    ) {
      dataEncerramento = useArrayDate.MontarDate(
        data.data_encerramento_protocolo_ano,
        data.data_encerramento_protocolo_mes,
        data.data_encerramento_protocolo_dia
      );
    }

    if (String(data.tipo_protocolo.toLowerCase()) === String('saída')) {
      if (data.meio_envio === '') {
        return toast.warn('Meio Envio Obrigatório')
      } else if (dataEnvio === undefined) {
        return toast.warn('Data Envio Obrigatório')
      }
    }

    if (String(data.tipo_protocolo.toLowerCase()) === String('entrada')) {
      if (data.meio_recebimento === '') {
        return toast.warn('Meio Recebimento Obrigatório')
      } else if (dataRecebimento === undefined) {
        return toast.warn('Data Recebimento Obrigatória')
      }
    }

    if (
      data.num_protocolo == "" ||
      data.tipo_protocolo == "" ||
      data.assunto_protocolo == ""
    ) {
      toast.error("Preencha os campos obrigatórios (*).");
    } else if ((dataEnvio != null && dataRecebimento != null) && (new Date(dataRecebimento) < new Date(dataEnvio))) {
      toast.error(
        "A data de recebimento deve ser maior ou igual a data de envio."
      );
    } else if (datasRecebimento == false) {
      toast.error(
        "Data de Recebimento Incompleta"
      );
    } else if (datasEncerramento == false) {
      toast.error(
        "Data encerramento Incompleta"
      );
    } else {
      const {
        data_envio_dia,
        data_envio_mes,
        data_envio_ano,
        data_recebimento_dia,
        data_recebimento_mes,
        data_recebimento_ano,
        data_encerramento_protocolo_dia,
        data_encerramento_protocolo_mes,
        data_encerramento_protocolo_ano,
        anexos,
        ...newData
      } = data

      try {
        const formData = new FormData()
        formData.append('anexos', data.anexos[0])

        const handlePostUpload = async () => {
          try {
            const response = await axios.post('/api/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            const nameFile = response.data.names_arquivos?.map((item: any) => {
              return item.anexoProtocolo
            })
            return nameFile
          } catch (error: any) {
            toast.error(error?.response?.data.error)
            console.log(error?.response?.data.error)
          }
        }

        const NameUpload = await handlePostUpload()

        await api.post("/protocolos/incluir", {
          ...newData,
          data_envio: dataEnvio,
          data_recebimento: dataRecebimento,
          data_encerramento: dataEncerramento,
          anexos: NameUpload[0]
        });

        router.push("/protocolos");
        return toast.success('Operação concluída com sucesso')
      } catch (error) {
        console.log(error);
        return toast.error("Erro ao cadastrar o protocolo...");
      }
    }
  }

  const verificaData = (data: SchemaProtocoloForm, tipoData: string) => {
    if (tipoData == "encerramento") {
      if (
        !Number.isNaN(data.data_encerramento_protocolo_dia) ||
        !Number.isNaN(data.data_encerramento_protocolo_mes) ||
        !Number.isNaN(data.data_encerramento_protocolo_ano)
      ) {
        if (
          Number.isNaN(data.data_encerramento_protocolo_dia) ||
          Number.isNaN(data.data_encerramento_protocolo_mes) ||
          Number.isNaN(data.data_encerramento_protocolo_ano)
        ) {
          return false;
        } else {
          return true;
        }
      }
    }

    if (tipoData == "recebimento") {
      if (
        !Number.isNaN(data.data_recebimento_dia) ||
        !Number.isNaN(data.data_recebimento_mes) ||
        !Number.isNaN(data.data_recebimento_ano)
      ) {
        if (
          Number.isNaN(data.data_recebimento_dia) ||
          Number.isNaN(data.data_recebimento_mes) ||
          Number.isNaN(data.data_recebimento_ano)
        ) {
          return false;
        } else {
          return true;
        }
      }
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>

        <fieldset>
          <legend style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>
                <Link href={"/protocolos"}>Protocolos</Link>
              </span>
              <CaretRight size={14} />
              <span>Cadastro</span>
            </div>
            <div>
              {/* <Box style={{ alignItems: "center", display: 'flex' }}> */}
              <BackPage backRoute="/protocolos" />
              {/* </Box> */}
            </div>
          </legend>
          <Box>
            <div style={{ width: "15%" }}>
              <TextInput
                title="Número do Protocolo *"
                {...register("num_protocolo")}
                helperText={errors.num_protocolo?.message}
                error={!!errors.num_protocolo?.message}
              // helperText={errors.num_protocolo?.message}
              />
            </div>

            <div>
              <SelectOptions
                data={dataCategory}
                description="Tipo Protocolo *"
                w={200}
                {...register("tipo_protocolo")}
                helperText={errors.tipo_protocolo?.message}
                error={!!errors.tipo_protocolo?.message}
              />
            </div>
          </Box>

          <Box>
            <div>
              <TextInput
                title="Assunto Protocolo *"
                w={500}
                {...register("assunto_protocolo")}
                helperText={errors.assunto_protocolo?.message}
                error={!!errors.assunto_protocolo?.message}
              />
            </div>
          </Box>

          <Box>

            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'end',
                  width: '25rem',
                }}
              >
                <Text>Data de Recebimento:</Text>
                <SelectOptions
                  description="Dia"
                  data={dataDays}
                  w={90}
                  {...register('data_recebimento_dia')}
                //  defaultValue={{ label: newDateAnuidade.dia }}
                />
                <SelectOptions
                  data={dataMonths}
                  description="Mês"
                  w={90}
                  {...register('data_recebimento_mes')}
                //  defaultValue={{ label: newDateAnuidade.mes }}
                />
                <SelectOptions
                  w={120}
                  description="Ano"
                  data={dataYears}
                  {...register('data_recebimento_ano')}
                // defaultValue={{ label: newDateAnuidade.ano }}
                />
              </div>
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >

              </span>
            </div>

            <div>
              <SelectOptions
                data={dataMeioProtocol}
                description="Meio de Recebimento"
                w={225}
                {...register("meio_recebimento")}
              />
            </div>

            <div>
              <SwitchInput
                title="Documento de entrada requer resposta?"
                {...register("obrigatoria_resp_receb")}
              />
            </div>

            <div style={{ width: "15%" }}>
              <SwitchInput
                title="Entregue em mãos?"
                {...register("entregue_em_maos")}
              />
            </div>
          </Box>

          <Box>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'end',
                  width: '22rem',
                }}
              >
                <Text> Data de Envio:</Text>
                <SelectOptions
                  description="Dia"
                  data={dataDays}
                  w={90}
                  {...register('data_envio_dia')}
                // defaultValue={{ label: newDateAnuidade.dia }}
                />
                <SelectOptions
                  data={dataMonths}
                  description="Mês"
                  w={93}
                  {...register('data_envio_mes')}
                // defaultValue={{ label: newDateAnuidade.mes }}
                />
                <SelectOptions
                  w={120}
                  description="Ano"
                  data={dataYears}
                  {...register('data_envio_ano')}
                // defaultValue={{ label: newDateAnuidade.ano }}
                />
              </div>

            </div>

            <div>
              <SelectOptions
                data={dataMeioProtocol}
                description="Meio de Envio"
                w={225}
                {...register("meio_envio")}
              />
            </div>
          </Box>

          <Box>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'end',
                  width: '28rem',
                }}
              >
                <Text> Data de Encerramento do Protocolo:</Text>
                <SelectOptions
                  description="Dia"
                  data={dataDays}
                  w={90}
                  {...register('data_encerramento_protocolo_dia')}
                // defaultValue={{ label: newDateAnuidade.dia }}
                />
                <SelectOptions
                  data={dataMonths}
                  description="Mês"
                  w={90}
                  {...register('data_encerramento_protocolo_mes')}
                // defaultValue={{ label: newDateAnuidade.mes }}
                />
                <SelectOptions
                  w={120}
                  description="Ano"
                  data={dataYears}
                  {...register('data_encerramento_protocolo_ano')}
                // defaultValue={{ label: newDateAnuidade.ano }}
                />
              </div>

            </div>


            <div>
              <SelectOptions
                w={300}
                description="Usuário Encerramento Protocolo"
                data={usuarioEncerramento}
                {...register("usuario_encerramento")}
              // defaultValue={{ label: newDateAnuidade.ano }}
              />
            </div>
          </Box>

          <Box>
            <div>
              <h4
                style={{
                  borderBottomColor: "#A9A9B2",
                  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  lineHeight: "1.4375em",
                  letterSpacing: "0.00938em",
                }}
                className="files_names"
              >
                Anexos
              </h4>
              <input type="file" accept="application/pdf" {...register('anexos')} multiple onInput={handleFileChange} />
              {selectedFiles.length > 0 && (
                <div>
                  <b>
                    <h4
                      style={{
                        borderBottomColor: "#A9A9B2",
                        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                        fontWeight: "bold",
                        lineHeight: "1.4375em",
                        letterSpacing: "0.00938em",
                      }}
                    >
                      Arquivos selecionados:
                    </h4>
                  </b>

                  <ul
                    style={{
                      borderBottomColor: "#A9A9B2",
                      fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                      fontWeight: "400",
                      lineHeight: "1.4375em",
                      letterSpacing: "0.00938em",
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
            title={isSubmitting ? "Enviando..." : "Enviar"}
            type="submit"
            disabled={isSubmitting}
          />
        </fieldset>
      </form>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const category = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Tipo_Protocol',
      },
    })

    const dataCategory = category?.map(item => {
      return {
        id: item.id,
        label: item.ocorrencia_tabela
      }
    })
    const meioProtocol = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Meio_Protocol',
      },
    })

    const dataMeioProtocol = meioProtocol?.map(item => {
      return {
        id: item.id,
        label: item.ocorrencia_tabela
      }
    })

    return {
      props: {
        dataCategory,
        dataMeioProtocol,

      },
    }
  } catch (error) {
    return {
      props: {
        dataCategory: [],
        dataMeioProtocol: [],
      },
    }
  }
}
