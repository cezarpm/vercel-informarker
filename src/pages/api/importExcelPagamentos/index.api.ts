import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File, IncomingForm } from 'formidable';
import fs from 'fs';
import Papa from 'papaparse';
import { prisma } from '@/lib/prisma'; // Ajuste o caminho conforme necessário

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Somente método POST permitido' });
    return;
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ message: 'Erro ao processar o arquivo' });
      return;
    }

    if (!files.file || !Array.isArray(files.file) || files.file.length === 0) {
      res.status(400).json({ message: 'Nenhum arquivo foi enviado.' });
      return;
  }

  const file = files.file[0] as formidable.File;
    const csvFilePath = file.filepath;
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    const records = Papa.parse(csvData, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
    }).data;

    for (const record of records as any[]) {
      await prisma.pagamentos.create({
        data: {
          matricula_saerj: record.customer_id,
          tipo_pagamento: record.payment_method,
          ano_anuidade: new Date(record.order_date).getFullYear().toString(),
          data_pagto_unica: record.paid_date ? new Date(record.paid_date).toISOString().split('T')[0] : '',
          valor_pagto_unica: record.order_total.toString(),
          data_pagto_parcela_1: '',
          valor_pagto_parcela_1: '',
          data_pagto_parcela_2: '',
          valor_pagto_parcela_2: '',
          data_pagto_parcela_3: '',
          valor_pagto_parcela_3: '',
        },
      });
    }

    res.status(200).json({ message: 'Dados do CSV importados com sucesso!' });
  });
}