/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Container,
  Text,
  Fieldset,
  ContainerInputFile,
  ContentInputFile,
  FormError,
} from "./styled";
import React, { Suspense, useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { prisma } from "@/lib/prisma";
import { GetServerSideProps } from "next";
import { SelectOptions } from "@/components/SelectOptions";
import { ArrowBendDownLeft, CaretRight } from "phosphor-react";
import { api } from "@/lib/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Link from "next/link";
import { useArrayDate } from "@/utils/useArrayDate";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import SelectNoComplete from "@/components/SelectNoComplete";
import { useArrayUfBrasil } from "@/utils/useArrayUfBrasil";
import { BackPage } from "@/components/BackPage";
import { schemaCadastro } from "./schemaCadastro";
import { zodResolver } from "@hookform/resolvers/zod";
import { SwitchInput } from "@/components/SwitchInput";

type SchemaCadastro = z.infer<typeof schemaCadastro>;

interface schemaParametrosProps {
  dataCategoria: any;
  dataSituacao: any;
  dataPais: any;
  dataNivelResidencia: any;
}

export default function AssociadosCadastro({
  dataCategoria,
  dataSituacao,
  dataPais,
  dataNivelResidencia,
}: schemaParametrosProps) {
  const [cepInvalido, setCepInvalido] = useState();
  const [disableCamposCepInvalido, setDisableCamposCepInvalido] =
    useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SchemaCadastro>({
    resolver: zodResolver(schemaCadastro),
  });

  const dataDays = useArrayDate.Dia();
  const dataMonths = useArrayDate.Mes();
  const dataYears = useArrayDate.AnoAtualMenor();

  const cepValue = watch("cep");

  const checkEmailValidade = watch("confirmarEmail");
  const checkEmail = watch("email");

  const checkCategoria = watch("categoria");

  const nomeArquivoComprovanteCpf = watch("comprovante_cpf");
  const nomeArquivoComprovanteEndereco = watch("comprovante_endereco");
  const nomeArquivoCartaIndicacao2Membros = watch("carta_indicacao_2_membros");
  const nomeArquivoCertidaoQuitacaoCrm = watch("certidao_quitacao_crm");
  const nomeArquivoCertificadoConclusaoEspecializacao = watch(
    "certificado_conclusao_especializacao"
  );
  const nomeArquivoDeclaracaoHospital = watch("declaracao_hospital");
  const nomeArquivoDiplomaMedicina = watch("diploma_medicina");

  async function handleCheckCep(cep: string) {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      checkedViaCep(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleGetAllParams(): Promise<void> {
    try {
      const response = await api.get("/parametros");
      setCepInvalido(response.data[0].cep_invalido);
    } catch (error) {
      console.log(error);
    }
  }

  function checkedViaCep(dataViaCep: any) {
    if (dataViaCep.erro === true) {
      if (cepInvalido === true) {
        toast.warn("você optou: aceitar cep inválido");
      } else {
        setDisableCamposCepInvalido(true);
        toast.warn("você optou: não aceitar cep inválido");
      }
    }

    if (!dataViaCep.erro) {
      setDisableCamposCepInvalido(false);
      setValue("bairro", dataViaCep.bairro);
      setValue("cidade", dataViaCep.localidade);
      setValue("uf", dataViaCep.uf);
      setValue("logradouro", dataViaCep.logradouro);
    }
  }

  async function handleOnSubmit(data: SchemaCadastro) {
    console.log(data);
    try {
      let dataNascimento;
      let dataInicioEspecializacao;
      let dataPrevisaoConclusao;

      if (data.yearNasc && data.monthNasc && data.dayNasc) {
        dataNascimento = useArrayDate.MontarDate(
          data.yearNasc,
          data.monthNasc,
          data.dayNasc
        );
      }

      if (
        data.yearInicioEspec &&
        data.monthInicioEspec &&
        data.dayInicioEspec
      ) {
        dataInicioEspecializacao = useArrayDate.MontarDate(
          data.yearInicioEspec,
          data.monthInicioEspec,
          data.dayInicioEspec
        );
      }

      if (data.yearPrevConcl && data.monthPrevConcl && data.dayPrevConcl) {
        dataPrevisaoConclusao = useArrayDate.MontarDate(
          data.yearPrevConcl,
          data.monthPrevConcl,
          data.dayPrevConcl
        );
      }

      data.cpf = data.cpf.replace(/[^\d]/g, "");
      data.cep = data.cep.replace(/[^\d]/g, "");

      data.telefone_residencial = data.telefone_residencial.replace(
        /[^\d]/g,
        ""
      );
      data.telefone_celular = data.telefone_celular.replace(/[^\d]/g, "");

      const {
        dayNasc,
        monthNasc,
        yearNasc,
        dayInicioEspec,
        monthInicioEspec,
        yearInicioEspec,
        dayPrevConcl,
        monthPrevConcl,
        yearPrevConcl,
        confirmarEmail,
        ...newData
      } = data;

      const formData = new FormData();
      formData.append("comprovante_cpf", data.comprovante_cpf[0]);
      formData.append("comprovante_endereco", data.comprovante_endereco[0]);
      formData.append(
        "carta_indicacao_2_membros",
        data.carta_indicacao_2_membros[0]
      );
      formData.append("certidao_quitacao_crm", data.certidao_quitacao_crm[0]);
      formData.append(
        "certificado_conclusao_especializacao",
        data.certificado_conclusao_especializacao[0]
      );

      formData.append("declaracao_hospital", data.declaracao_hospital[0]);
      formData.append("diploma_medicina", data.diploma_medicina[0]);

      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(
        newData,
        dataNascimento,
        dataInicioEspecializacao,
        dataPrevisaoConclusao,
        response.data.names_arquivos
      );

      await api.post("/associados/cadastro", {
        ...newData,
        residencia_mec_cnrm: String(data.residencia_mec_cnrm),
        declaro_quite_SAERJ: String(data.declaro_quite_SAERJ),
        declaro_verdadeiras: String(data.declaro_verdadeiras),
        comprovante_cpf: await response.data.names_arquivos[0],
        comprovante_endereco: await response.data.names_arquivos[1],
        carta_indicacao_2_membros: await response.data.names_arquivos[2],
        certidao_quitacao_crm: await response.data.names_arquivos[3],
        certificado_conclusao_especializacao:
          await response.data.names_arquivos[4],
        declaracao_hospital: await response.data.names_arquivos[5],
        diploma_medicina: await response.data.names_arquivos[6],
        data_nascimento: dataNascimento,
        data_inicio_especializacao: dataInicioEspecializacao,
        data_previsao_conclusao: dataPrevisaoConclusao,
      });
      toast.success("Associado cadastrado");
      router.push("/associados");
    } catch (error) {
      console.log(error);
      toast.error("Oops algo deu errado...");
    }
  }

  function valuesInitial() {
    setValue("numero", 0);
    setValue("numero_proposta_SBA", 0);
    setValue("matricula_SAERJ", 0);
    setValue("matricula_SBA", 0);
    setValue("cpf", "");
  }

  const arraySexo = [
    {
      label: "Masculino",
    },
    {
      label: "Feminino",
    },
  ];

  useEffect(() => {
    setDisableCamposCepInvalido(false);
    handleGetAllParams();
    valuesInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <BackPage backRoute="/" />
        <fieldset>
          <Fieldset>
            <legend>
              <h2>Gerais</h2>
            </legend>

            <Box>
              <div>
                <SelectOptions
                  w={120}
                  description="UF CRM *"
                  data={useArrayUfBrasil}
                  {...register("uf_crm")}
                />
                <FormError>{errors.uf_crm?.message}</FormError>
              </div>
              <div>
                <TextInput
                  w={180}
                  title="CRM"
                  {...register("crm")}
                  helperText={errors?.crm?.message}
                  error={!!errors?.crm?.message}
                />
              </div>

              <TextInput
                title="Nome Completo"
                {...register("nome_completo")}
                helperText={errors.nome_completo?.message}
                error={!!errors.nome_completo?.message}
              />
              <div>
                <TextInput
                  w={140}
                  title="CPF"
                  mask={"999.999.999-99"}
                  {...register("cpf")}
                  helperText={errors.cpf?.message}
                  error={!!errors.cpf?.message}
                />
              </div>
            </Box>

            <Box>
              <div>
                <SelectOptions
                  w={170}
                  data={arraySexo}
                  description="Sexo"
                  {...register("sexo")}
                />
                <FormError>{errors?.sexo?.message}</FormError>
              </div>
              <div>
                <TextInput
                  title="Nome Profissional"
                  {...register("nome_profissional")}
                />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "end",
                    flexWrap: "wrap",
                  }}
                >
                  <Text>Data Nascimento</Text>
                  <SelectOptions
                    description="Dia"
                    data={dataDays}
                    w={90}
                    {...register("dayNasc")}
                    // defaultValue={{ label: newDateAnuidade.dia }}
                  />
                  <SelectOptions
                    data={dataMonths}
                    description="Mês"
                    w={90}
                    {...register("monthNasc")}
                    // defaultValue={{ label: newDateAnuidade.mes }}
                  />
                  <SelectOptions
                    w={120}
                    description="Ano"
                    data={dataYears}
                    {...register("yearNasc")}
                    // defaultValue={{ label: newDateAnuidade.ano }}
                  />
                </div>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <FormError>
                    {errors.dayNasc?.message ||
                    errors.dayNasc?.message ||
                    errors.yearNasc?.message
                      ? "Data de nascimento:"
                      : null}
                  </FormError>
                  <FormError>{errors.yearNasc?.message}</FormError>
                  <FormError>{errors.monthNasc?.message}</FormError>
                  <FormError>{errors.dayNasc?.message}</FormError>
                </span>
              </div>
              <div style={{ width: "20%" }}>
                <div
                  style={{
                    fontSize: "14px",
                    border: "solid 1px",
                    borderColor:
                      "transparent transparent rgb(169, 169, 178) transparent",
                  }}
                >
                  <SelectNoComplete
                    data={dataCategoria}
                    title="Categoria"
                    {...register("categoria")}
                  />
                </div>
                <FormError>{errors?.categoria?.message}</FormError>
              </div>
            </Box>
          </Fieldset>

          <Fieldset>
            <legend>
              <h2>Dados de endereço</h2>
            </legend>
            <Box>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <TextInput
                    w={150}
                    title="Cep *"
                    {...register("cep")}
                    mask="99999-999"
                    helperText={errors?.cep?.message}
                    error={!!errors?.cep?.message}
                  />

                  <Button
                    type="button"
                    onClick={() => {
                      handleCheckCep(cepValue);
                    }}
                    title="Buscar"
                    style={{ margin: "0px", width: "100%", fontSize: "12px" }}
                  />
                </div>
              </div>

              <div>
                <SelectOptions
                  data={dataPais}
                  w={260}
                  description="País onde reside *"
                  {...register("pais")}
                />
                <FormError>{errors?.pais?.message}</FormError>
              </div>
              <div>
                <TextInput
                  disabled={disableCamposCepInvalido}
                  w={100}
                  title="UF *"
                  {...register("uf")}
                  error={!!errors?.uf?.message}
                  helperText={errors?.uf?.message}
                />
              </div>
              <div>
                <TextInput
                  disabled={disableCamposCepInvalido}
                  title="Cidade *"
                  {...register("cidade")}
                  error={!!errors?.cidade?.message}
                  helperText={errors?.cidade?.message}
                />
              </div>

              <div>
                <TextInput
                  disabled={disableCamposCepInvalido}
                  title="Bairro *"
                  {...register("bairro")}
                  error={!!errors?.bairro?.message}
                  helperText={errors?.bairro?.message}
                />
              </div>
            </Box>
            <Box>
              <div>
                <TextInput
                  disabled={disableCamposCepInvalido}
                  title="Logradouro *"
                  {...register("logradouro")}
                  error={!!errors?.logradouro?.message}
                  helperText={errors?.logradouro?.message}
                />
              </div>

              <div>
                <TextInput
                  disabled={disableCamposCepInvalido}
                  w={90}
                  title="Número *"
                  {...register("numero", {
                    valueAsNumber: true,
                  })}
                  error={!!errors?.numero?.message}
                  helperText={errors?.numero?.message}
                />
              </div>

              <div>
                <TextInput
                  disabled={disableCamposCepInvalido}
                  title="Complemento *"
                  {...register("complemento")}
                />
              </div>
            </Box>
          </Fieldset>

          <Fieldset>
            <legend>
              <h2>Dados de contato</h2>
            </legend>

            <Box>
              <div>
                <TextInput
                  title="Telefone Celular"
                  mask={"(99) 9.9999-9999"}
                  {...register("telefone_celular")}
                  error={!!errors?.telefone_celular?.message}
                  helperText={errors?.telefone_celular?.message}
                />
              </div>
              <div>
                <TextInput
                  title="Telefone Residencial"
                  mask={"(99) 9999-9999"}
                  {...register("telefone_residencial")}
                />
              </div>
              <TextInput
                type="email"
                title="Email"
                {...register("email")}
                error={!!errors?.email?.message}
                helperText={errors?.email?.message}
              />
              {checkEmail === checkEmailValidade ? (
                <>
                  <TextInput
                    title="Confirmação email"
                    {...register("confirmarEmail")}
                  />
                </>
              ) : (
                <TextInput
                  title="Confirmação email"
                  {...register("confirmarEmail")}
                  error
                  helperText={"Email não confere"}
                />
              )}
            </Box>
          </Fieldset>

          <Fieldset>
            <legend>
              <h2>Dados referente a formação acadêmica</h2>
            </legend>
            <Box>
              <div>
                <TextInput
                  title="Nome Instituição de Ensino Graduação"
                  {...register("nome_instituicao_ensino_graduacao")}
                  error={!!errors?.nome_instituicao_ensino_graduacao?.message}
                  helperText={
                    errors?.nome_instituicao_ensino_graduacao?.message
                  }
                />
              </div>
              <div>
                <TextInput
                  title="Ano de Conclusão Graduação"
                  {...register("ano_conclusao_graduacao")}
                  error={!!errors?.ano_conclusao_graduacao?.message}
                  helperText={errors?.ano_conclusao_graduacao?.message}
                />
              </div>
              {checkCategoria === "Adjuntos" ? (
                <div>
                  <SelectOptions
                    w={120}
                    description="UF PRM"
                    data={useArrayUfBrasil}
                    {...register("uf_prm")}
                  />
                  <FormError>{errors?.uf_prm?.message}</FormError>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "end",
                      flexWrap: "wrap",
                    }}
                  >
                    <Text>Data Início Especialização</Text>

                    <SelectOptions
                      description="Dia"
                      data={dataDays}
                      w={90}
                      {...register("dayInicioEspec")}
                      // defaultValue={{ label: newDateAnuidade.dia }}
                    />

                    <SelectOptions
                      data={dataMonths}
                      description="Mês"
                      w={90}
                      {...register("monthInicioEspec")}
                      // defaultValue={{ label: newDateAnuidade.mes }}
                    />

                    <SelectOptions
                      w={120}
                      description="Ano"
                      data={dataYears}
                      {...register("yearInicioEspec")}
                      // defaultValue={{ label: newDateAnuidade.ano }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "end",
                      flexWrap: "wrap",
                    }}
                  >
                    <Text>Data Previsão Conclusão</Text>

                    <SelectOptions
                      description="Dia"
                      data={dataDays}
                      w={90}
                      {...register("dayPrevConcl")}
                      // defaultValue={{ label: newDateAnuidade.dia }}
                    />

                    <SelectOptions
                      data={dataMonths}
                      description="Mês"
                      w={90}
                      {...register("monthPrevConcl")}
                      // defaultValue={{ label: newDateAnuidade.mes }}
                    />

                    <SelectOptions
                      w={120}
                      description="Ano"
                      data={useArrayDate.AnoAtualMaior()}
                      {...register("yearPrevConcl")}
                      // defaultValue={{ label: newDateAnuidade.ano }}
                    />
                  </div>
                  <div>
                    <SwitchInput
                      title="Residencia MEC-CNRM"
                      {...register("residencia_mec_cnrm")}
                    />
                  </div>
                </>
              )}
            </Box>
          </Fieldset>

          {checkCategoria === "Adjuntos" ? null : (
            <Fieldset>
              <legend>
                <h2>Histórico do Proponente</h2>
              </legend>

              <Box>
                <div>
                  <SelectOptions
                    w={210}
                    description="Nível Residencia"
                    {...register("nivel_residencia")}
                    data={dataNivelResidencia}
                  />
                  <FormError>{errors?.nivel_residencia?.message}</FormError>
                </div>

                <TextInput
                  title="UF PRM"
                  {...register("uf_prm")}
                  error={!!errors?.uf_prm?.message}
                  helperText={errors?.uf_prm?.message}
                />
                <TextInput
                  title="Nome Hospital MEC"
                  {...register("nome_hospital_mec")}
                />
              </Box>
            </Fieldset>
          )}

          <Fieldset>
            <legend>
              <h2>Documentos Comprobatórios</h2>
            </legend>
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1 }}>Documentos</div>
              <div style={{ flex: 1 }}>Arquivo(.pdf)</div>
            </h3>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                flexWrap: "wrap",
                flexDirection: "column",
              }}
            >
              <ContainerInputFile>
                <ContentInputFile>
                  <input
                    type="file"
                    accept=".pdf"
                    {...register("comprovante_cpf")}
                  />
                  <p>
                    {nomeArquivoComprovanteCpf &&
                    nomeArquivoComprovanteCpf[0] &&
                    nomeArquivoComprovanteCpf[0].name !== undefined
                      ? `Arquivo Selecionado: ${nomeArquivoComprovanteCpf[0].name}`
                      : "Selecione o Arquivo:"}
                  </p>
                </ContentInputFile>
                <p>Comprovante CPF</p>
              </ContainerInputFile>

              <ContainerInputFile>
                <ContentInputFile>
                  <input
                    type="file"
                    accept=".pdf"
                    {...register("comprovante_endereco")}
                  />
                  <p>
                    {nomeArquivoComprovanteEndereco &&
                    nomeArquivoComprovanteEndereco[0] &&
                    nomeArquivoComprovanteEndereco[0].name !== undefined
                      ? `Arquivo Selecionado: ${nomeArquivoComprovanteEndereco[0].name}`
                      : "Selecione o Arquivo:"}
                  </p>
                </ContentInputFile>
                <p>Comprovante Endereço</p>
              </ContainerInputFile>

              <ContainerInputFile>
                <ContentInputFile>
                  <input
                    type="file"
                    accept=".pdf"
                    {...register("certidao_quitacao_crm")}
                  />
                  <p>
                    {nomeArquivoCertidaoQuitacaoCrm &&
                    nomeArquivoCertidaoQuitacaoCrm[0] &&
                    nomeArquivoCertidaoQuitacaoCrm[0].name !== undefined
                      ? `Arquivo Selecionado: ${nomeArquivoCertidaoQuitacaoCrm[0].name}`
                      : "Selecione o Arquivo:"}
                  </p>
                </ContentInputFile>
                <p>Certidão Quitação do CRM</p>
              </ContainerInputFile>

              <ContainerInputFile>
                <ContentInputFile>
                  <input
                    type="file"
                    accept=".pdf"
                    {...register("certificado_conclusao_especializacao")}
                  />
                  <p>
                    {nomeArquivoCertificadoConclusaoEspecializacao &&
                    nomeArquivoCertificadoConclusaoEspecializacao[0] &&
                    nomeArquivoCertificadoConclusaoEspecializacao[0].name !==
                      undefined
                      ? `Arquivo Selecionado: ${nomeArquivoCertificadoConclusaoEspecializacao[0].name}`
                      : "Selecione o Arquivo:"}
                  </p>
                </ContentInputFile>
                <p>Certificado Conclusão Especialização</p>
              </ContainerInputFile>

              <ContainerInputFile>
                <ContentInputFile>
                  <input
                    type="file"
                    accept=".pdf"
                    {...register("carta_indicacao_2_membros")}
                  />
                  <p>
                    {nomeArquivoCartaIndicacao2Membros &&
                    nomeArquivoCartaIndicacao2Membros[0] &&
                    nomeArquivoCartaIndicacao2Membros[0].name !== undefined
                      ? `Arquivo Selecionado: ${nomeArquivoCartaIndicacao2Membros[0].name}`
                      : "Selecione o Arquivo:"}
                  </p>
                </ContentInputFile>
                <p>Carta Indicação 2 membros</p>
              </ContainerInputFile>

              <ContainerInputFile>
                <ContentInputFile>
                  <input
                    type="file"
                    accept=".pdf"
                    {...register("diploma_medicina")}
                  />
                  <p>
                    {nomeArquivoDiplomaMedicina &&
                    nomeArquivoDiplomaMedicina[0] &&
                    nomeArquivoDiplomaMedicina[0].name !== undefined
                      ? `Arquivo Selecionado: ${nomeArquivoDiplomaMedicina[0].name}`
                      : "Selecione o Arquivo:"}
                  </p>
                </ContentInputFile>
                <p>Diploma Medicina</p>
              </ContainerInputFile>

              {checkCategoria === "Adjuntos" ? null : (
                <ContainerInputFile>
                  <ContentInputFile>
                    <input
                      type="file"
                      accept=".pdf"
                      {...register("declaracao_hospital")}
                    />
                    <p>
                      {nomeArquivoDeclaracaoHospital &&
                      nomeArquivoDeclaracaoHospital[0] &&
                      nomeArquivoDeclaracaoHospital[0].name !== undefined
                        ? `Arquivo Selecionado: ${nomeArquivoDeclaracaoHospital[0].name}`
                        : "Selecione o Arquivo:"}
                    </p>
                  </ContentInputFile>
                  <p>Declaração Hospital</p>
                </ContainerInputFile>
              )}
            </div>
          </Fieldset>

          <Fieldset>
            <legend>
              <h2>Declaração veracidade das informações</h2>
            </legend>
            <Box>
              <div>
                <TextInput
                  w={180}
                  title="Número proposta SBA"
                  {...register("numero_proposta_SBA", {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div>
                <TextInput
                  w={180}
                  title="Matrícula SAERJ"
                  {...register("matricula_SAERJ", {
                    valueAsNumber: true,
                  })}
                  helperText={errors.matricula_SAERJ?.message}
                  error={!!errors.matricula_SAERJ?.message}
                />
              </div>
              <div>
                <TextInput
                  w={180}
                  title="Matrícula SBA"
                  {...register("matricula_SBA", {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div>
                <SelectOptions
                  w={200}
                  description="Situação"
                  data={dataSituacao}
                  {...register("situacao")}
                />
                <FormError>{errors.situacao?.message}</FormError>
              </div>
              <div>
                <TextInput
                  w={180}
                  title="Pendências SAERJ"
                  {...register("pendencias_SAERJ")}
                />
              </div>
              <div>
                <TextInput
                  w={180}
                  title="Nome Presidente Regional"
                  {...register("nome_presidente_regional")}
                />
              </div>
              <div>
                <TextInput
                  w={100}
                  title="Sigla Regional"
                  {...register("sigla_regional")}
                />
              </div>
            </Box>

            <Box>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  title="Declaro para os devidos fins que as informações contidas neste formulário de cadastro são verdadeiras e autênticas"
                  {...register("declaro_verdadeiras")}
                  required
                />
                <p style={{ color: " rgba(0, 0, 0, 0.6)" }}>
                  Declaro para os devidos fins que as informações contidas neste
                  formulário de cadastro são verdadeiras e autênticas
                </p>
                {checkCategoria === "Aspirantes" ? (
                  <>
                    <Checkbox
                      title="Declaro para os devidos fins que proponente à médico em especialização está quite com o pagamento da anuidade regional"
                      {...register("declaro_quite_SAERJ")}
                      required
                    />
                    <p style={{ color: " rgba(0, 0, 0, 0.6)" }}>
                      Declaro para os devidos fins que proponente à médico em
                      especialização está quite com o pagamento da anuidade
                      regional
                    </p>
                  </>
                ) : null}
              </div>
            </Box>
          </Fieldset>

          <Button
            type="submit"
            title={isSubmitting ? "Cadastrando..." : "Cadastrar Proposta"}
            disabled={isSubmitting}
          />
        </fieldset>
      </form>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const dataCategoria = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: "Categoria_Associado",
      },
    });

    const situacao = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: "Situação_Associado",
      },
    });
    const dataSituacao = situacao.map((item) => {
      return {
        label: item.ocorrencia_tabela,
      };
    });

    const pais = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: "Pais",
      },
    });

    const dataPais = pais.map((item) => {
      return {
        label: item.ocorrencia_tabela,
      };
    });

    const nivelResidencia = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: "Nivel_Residencia",
      },
    });
    const dataNivelResidencia = nivelResidencia.map((item) => {
      return {
        label: item.ocorrencia_tabela,
      };
    });

    return {
      props: {
        dataCategoria,
        dataSituacao,
        dataPais,
        dataNivelResidencia,
      },
    };
  } catch (error) {
    console.error("Erro ao obter dados de tipo de empresa:", error);
    return {
      props: {
        dataCategoria: [],
        dataSituacao: [],
        dataPais: [],
        dataNivelResidencia: [],
      },
    };
  } finally {
    prisma.$disconnect();
  }
};
