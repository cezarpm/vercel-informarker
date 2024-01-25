/* eslint-disable eqeqeq */
/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
import { Container, Box } from "./styled";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { GetStaticProps } from "next";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";
import { api } from "@/lib/axios";
import axios from "axios";
import { TextInput } from "@/components/TextInput";
import { SelectOptions } from "@/components/SelectOptions";
import { SwitchInput } from "@/components/SwitchInput";
import { ArrowBendDownLeft, CaretRight } from "phosphor-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useArrayDate } from "../../../utils/useArrayDate";

// import 'react-date-picker/dist/DatePicker.css';
// import 'react-calendar/dist/Calendar.css';

const schemaProtocoloForm = z.object({
  num_protocolo: z.string().min(1, { message: "Campo obrigatório" }),
  assunto_protocolo: z.string().min(1, { message: "Campo obrigatório" }),
  tipo_protocolo: z.string().min(1, { message: "Campo obrigatório" }),
  data_recebimento_dia: z.number(),
  data_recebimento_mes: z.number(),
  data_recebimento_ano: z.number(),
  data_envio_dia: z.number().min(1, { message: "Campo obrigatório" }),
  data_envio_mes: z.number().min(1, { message: "Campo obrigatório" }),
  data_envio_ano: z.number().min(1, { message: "Campo obrigatório" }),
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
const quemRedigiuDocumentoOptionsData = [{ id: 1, label: "Dr. Calazan" }];

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

  const dataDays = useArrayDate.Dia();
  const dataMonths = useArrayDate.Mes();
  const dataYears = useArrayDate.AnoAtualMenor();

  async function handleOnSubmit(data: SchemaProtocoloForm) {

    const datasRecebimento = verificaData(data, "recebimento");
    const datasEncerramento = verificaData(data, "encerramento");

    let dataEnvio;
    let dataRecebimento;
    let dataEncerramento;

    if (data.data_envio_dia && data.data_envio_mes && data.data_envio_ano) {
      dataEnvio = useArrayDate.MontarDate(
        data.data_envio_ano,
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
    

    if (
      data.num_protocolo == "" ||
      data.tipo_protocolo == "" ||
      data.assunto_protocolo == "" ||
      Number.isNaN(data.data_envio_dia) ||
      Number.isNaN(data.data_envio_mes) ||
      Number.isNaN(data.data_envio_ano)
    ) {
      toast.error("Preencha os campos obrigatórios (*).");
    } else if ((dataEnvio != null && dataRecebimento != null) && (new Date(dataRecebimento) < new Date(dataEnvio))) {
      toast.error(
        "A data de recebimento deve ser maior que a data de envio."
      );
    } else if (datasRecebimento == false) {
      toast.error(
        "A data de recebimento deve ser toda preenchida (dia, mês e ano)."
      );
    } else if (datasEncerramento == false) {
      toast.error(
        "A data de encerramento deve ser toda preenchida (dia, mês e ano)."
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
        ...newData
      } = data

      try {
        await api.post("/protocolos/incluir", { 
          ...newData,
          data_envio: dataEnvio,
          data_recebimento: dataRecebimento,
          data_encerramento_protocolo: dataEncerramento,
        });
        router.push("/protocolos");
        return toast.success("Protocolo cadastrado!");
      } catch (error) {
        console.log(error);
        return toast.error("Ops, algo deu errado ao cadastrar o protocolo...");
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
        <Box style={{ justifyContent: "end" }}>
          <Link
            href="/protocolos"
            style={{
              textDecoration: "none",
              fontFamily: "Roboto",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
              color: "#000",
            }}
          >
            <ArrowBendDownLeft size={32} />
            Retornar
          </Link>
        </Box>
        <fieldset>
          <legend>
            <span>
              <Link href={"/protocolos"}>Protocolos</Link>
            </span>
            <CaretRight size={14} />
            <span>Cadastro</span>
          </legend>
          <Box>
            <div style={{ width: "15%" }}>
              <TextInput
                title="Número do Protocolo *"
                {...register("num_protocolo")}
                // helperText={errors.num_protocolo?.message}
                error={!!errors.num_protocolo?.message}
                messageError={errors.num_protocolo?.message}
              />
            </div>

            <div>
              <SelectOptions
                data={tipoProtocoloOptionsData}
                description="Tipo Protocolo *"
                w={200}
                {...register("tipo_protocolo")}
                // helperText={errors.tipo_protocolo?.message}
                error={!!errors.tipo_protocolo?.message}
              />
            </div>
          </Box>

          <Box>
            <div>
              <SelectOptions
                data={assuntoProtocoloOptionsData}
                description="Assunto Protocolo *"
                w={500}
                {...register("assunto_protocolo")}
                // helperText={errors.assunto_protocolo?.message}
                error={!!errors.assunto_protocolo?.message}
              />
            </div>
          </Box>

          <Box>
            <p
              style={{
                borderBottomColor: "#A9A9B2",
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                fontWeight: "400",
                lineHeight: "1.4375em",
                letterSpacing: "0.00938em",
                maxWidth: "120px",
                width: "100%",
              }}
            >
              Data de Recebimento
            </p>

            <div>
              <SelectOptions
                data={dataDays}
                description="Dia"
                w={100}
                {...register("data_recebimento_dia", {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: (value) => parseInt(value), // Função para converter o valor para número
                })}
              />
            </div>

            <div>
              <SelectOptions
                data={dataMonths}
                description="Mês"
                w={100}
                {...register("data_recebimento_mes", {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: (value) => parseInt(value), // Função para converter o valor para número
                })}
              />
            </div>

            <div>
              <SelectOptions
                data={dataYears}
                description="Ano"
                w={150}
                {...register("data_recebimento_ano", {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: (value) => parseInt(value), // Função para converter o valor para número
                })}
              />
            </div>

            <div>
              <SelectOptions
                data={meioProtocoloOptionsData}
                description="Meio de Recebimento"
                w={225}
                {...register("meio_recebimento")}
              />
            </div>

            <div style={{ width: "15%" }}>
              <SwitchInput
                title="Documento de entrada requer resposta?"
                {...register("doc_entrada_requer_resposta")}
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
            <p
              style={{
                borderBottomColor: "#A9A9B2",
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                fontWeight: "400",
                lineHeight: "1.4375em",
                letterSpacing: "0.00938em",
                maxWidth: "120px",
                width: "100%",
              }}
            >
              Data de Envio
            </p>

            <div>
              <SelectOptions
                data={dataDays}
                description="Dia *"
                w={100}
                {...register("data_envio_dia", {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: (value) => parseInt(value), // Função para converter o valor para número
                })}
                // helperText={errors.data_envio_dia?.message}
                error={!!errors.data_envio_dia?.message}
              />
            </div>

            <div>
              <SelectOptions
                data={dataMonths}
                description="Mês *"
                w={100}
                {...register("data_envio_mes", {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: (value) => parseInt(value), // Função para converter o valor para número
                })}
                // helperText={errors.data_envio_mes?.message}
                error={!!errors.data_envio_mes?.message}
              />
            </div>

            <div>
              <SelectOptions
                data={dataYears}
                description="Ano *"
                w={150}
                {...register("data_envio_ano", {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: (value) => parseInt(value), // Função para converter o valor para número
                })}
                // helperText={errors.data_envio_ano?.message}
                error={!!errors.data_envio_ano?.message}
              />
            </div>

            <div>
              <SelectOptions
                data={meioProtocoloOptionsData}
                description="Meio de Envio"
                w={225}
                {...register("meio_envio")}
              />
            </div>
          </Box>

          <Box>
            <div>
              <SelectOptions
                data={quemRedigiuDocumentoOptionsData}
                description="Quem redigiu documento a ser enviado?"
                w={500}
                {...register("quem_redigiu_documento_a_ser_enviado")}
              />
            </div>
          </Box>

          <Box>
            <p
              style={{
                borderBottomColor: "#A9A9B2",
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                fontWeight: "400",
                lineHeight: "1.4375em",
                letterSpacing: "0.00938em",
              }}
            >
              Data de Encerramento do Protocolo
            </p>

            <div>
              <SelectOptions
                data={dataDays}
                description="Dia"
                w={100}
                {...register("data_encerramento_protocolo_dia", {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: (value) => parseInt(value), // Função para converter o valor para número
                })}
              />
            </div>

            <div>
              <SelectOptions
                data={dataMonths}
                description="Mês"
                w={100}
                {...register("data_encerramento_protocolo_mes", {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: (value) => parseInt(value), // Função para converter o valor para número
                })}
              />
            </div>

            <div>
              <SelectOptions
                data={dataYears}
                description="Ano"
                w={150}
                {...register("data_encerramento_protocolo_ano", {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: (value) => parseInt(value), // Função para converter o valor para número
                })}
              />
            </div>
            <div style={{ width: "15%" }}>
              <TextInput
                title="Usuário Encerramento Protocolo"
                {...register("usuario_encerramento_protocolo")}
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
              <input type="file" multiple onInput={handleFileChange} />
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
