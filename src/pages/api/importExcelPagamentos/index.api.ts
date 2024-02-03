import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File, IncomingForm } from "formidable";
import fs from "fs";
import Papa from "papaparse";
import { prisma } from "@/lib/prisma";
import { Logs } from "@/utils/Logs";



export const config = {
  api: {
    bodyParser: false,
  },
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Somente método POST permitido" });
    return;
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ message: "Erro ao processar o arquivo" });
      return;
    }

    if (!files.file || !Array.isArray(files.file) || files.file.length === 0) {
      res.status(400).json({ message: "Nenhum arquivo foi enviado." });
      return;
    }

    const file = files.file[0] as formidable.File;

    if (!file.originalFilename || !file.originalFilename.endsWith(".csv")) {
      res.status(400).json({ message: "Por favor, envie um arquivo .csv." });
      return;
    }

  try {
    const csvFilePath = file.filepath;
    const csvData = fs.readFileSync(csvFilePath, "utf8");
    const records = Papa.parse(csvData, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
    }).data;

    let linhasModificadas = 0;
    let linhasDuplicadas = 0;
    let linhasNaoEncontradas = 0;
    let linhasNaoPagas = 0;

    for (const record of records as any[]) {
      if (record.status && record.status.toLowerCase() === "completed") {
        if (
          record.customer_note &&
          record.customer_note.startsWith("CPF TITULAR: ")
        ) {
          let cpf = record.customer_note
            .substring("CPF TITULAR: ".length)
            .trim();

          cpf = cpf.replace(/\D/g, "");

          const associado = await prisma.associados.findFirst({
            where: {
              cpf: cpf,
            },
          });

          if (associado?.matricula_SAERJ) {
            const anoAnuidade = new Date(record.order_date)
              .getFullYear()
              .toString();

            const pagamentoExistente = await prisma.pagamentos.findFirst({
              where: {
                matricula_saerj: associado.matricula_SAERJ.toString() ?? "",
                tipo_pagamento: record.payment_method ?? "",
                ano_anuidade: anoAnuidade ?? "2024",
                data_pagto_unica: record.order_date ? new Date(record.order_date).toISOString().split("T")[0] : "2024-01-01 00:00:00",
              },
            });

            if (!pagamentoExistente) {
              await prisma.pagamentos.create({
                data: {
                  matricula_saerj:
                    associado.matricula_SAERJ.toString() ?? "",
                  tipo_pagamento: record.payment_method ?? "",
                  ano_anuidade: new Date(record.order_date)
                    .getFullYear()
                    .toString(),
                  data_pagto_unico: record.order_date
                    ? new Date(record.order_date).toISOString().split("T")[0]
                    : "2024-01-01 00:00:00", // DateTime ISO sem Timezone
                  valor_pagto_unico: record.order_total
                    ? record.order_total.toString()
                    : "",
                  data_pagto_parcela_1: "",
                  valor_pagto_parcela_1: "",
                  data_pagto_parcela_2: "",
                  valor_pagto_parcela_2: "",
                  data_pagto_parcela_3: "",
                  valor_pagto_parcela_3: "",
                },
              });
              linhasModificadas++;
            } else {
              linhasDuplicadas++;
              Logs({
                modulo: "Pagamentos",
                descriptionLog: `Pagamento já existente para o CPF ${cpf}.`,
              });
            }
          } else {
            linhasNaoEncontradas++;
            Logs({
              modulo: "Pagamentos",
              descriptionLog: `CPF ${cpf} não encontrado na base de associados.`,
            });
          }
        }
      } else {
        linhasNaoPagas++;
      }
    }

    res.status(200).json({
      message: "Dados do CSV importados com sucesso!",
      linhasModificadas: linhasModificadas,
      linhasDuplicadas: linhasDuplicadas,
      linhasNaoEncontradas: linhasNaoEncontradas,
      linhasNaoPagas: linhasNaoPagas
    });
  } catch (processError) {
    res.status(500).json({ message: "Erro ao processar os dados", error: processError });
  }
  });
}

