'use client'

import { jsPDF } from 'jspdf';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface EtiquetaProps {
  id: number
  cod_empresa?: string
  tipo_empresa?: string
  patrocinadora?: boolean
  faculdade_anestesiologia?: boolean
  empresa_ativa?: boolean
  cnpj?: string
  razao_social?: string
  nome_fantasia?: string
  cep?: string
  logradouro?: string
  numero?: number
  complemento?: string
  cidade?: string
  uf?: string
  pais?: string
  bairro?: string
  telefone_comercial?: string
  tratamento_contato_primario?: string
  nome_contato_primario?: string
  cargo_contato_primario?: string
  email_contato_primario?: string
  telefone_contato_primario?: string
  tratamento_contato_secundario?: string
  nome_contato_secundario?: string
  cargo_contato_secundario?: string
  email_contato_secundario?: string
  telefone_contato_secundario?: string
  home_page?: string
  inscricao_estadual?: string
  inscricao_municipal?: string
  observacoes?: string
}

export const EtiquetaPDFCompany = async (linhas: number[], exibirContatoPrimario: boolean) => {
  var doc = new jsPDF({

    unit: 'mm',
    format: 'a4',
  })

  for (let index = 0; index < linhas.length; index++) {
    try {
      const response = await fetch(`/api/empresa/get/${linhas[index]}`);
      const data: EtiquetaProps = await response.json();

      const {
        cod_empresa,
        bairro,
        cep,
        cidade,
        complemento,
        logradouro,
        numero,
        uf,
        nome_contato_primario,
        tratamento_contato_primario,
        nome_contato_secundario,
        tratamento_contato_secundario
      } = data;
  
      const contato = exibirContatoPrimario ? nome_contato_primario : nome_contato_secundario;
      const tratamento = exibirContatoPrimario ? tratamento_contato_primario : tratamento_contato_secundario;
  
      const startX = 10;
      const startY = index * 40;  // Aumentei o espaçamento vertical para 40 unidades
  
  
      doc.setFontSize(12);
      const splitNome = doc.splitTextToSize(`${cod_empresa}`, 80);
      doc.text(splitNome, startX + 4, 12 + startY);
  
      doc.setFontSize(10);
      const splitEndereco = doc.splitTextToSize(`${logradouro} , ${numero} ${complemento}`, 80);
      doc.text(splitEndereco, startX + 4, 17 + startY);
  
      const splitBairro = doc.splitTextToSize(`${bairro}`, 80);
      doc.text(splitBairro, startX + 4, 22 + startY);
  
      const splitCidade = doc.splitTextToSize(`${cep} - ${cidade} / ${uf}`, 80);
      doc.text(splitCidade, startX + 4, 27 + startY);
  
      const splitContato = doc.splitTextToSize(`${tratamento} ${contato}`, 80);
      doc.text(splitContato, startX + 4, 32 + startY);

    } catch (error) {
      toast.error('Erro ao gerar etiquetas')
      console.error('Erro ao buscar empresas:', error);
    }
  }

  doc.save('etiquetas.pdf');
};

