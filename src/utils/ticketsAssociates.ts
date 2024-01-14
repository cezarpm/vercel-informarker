'use client';

import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';

interface EtiquetaProps {
    id?: number;
    data_nascimento?: string;
    data_inicio_especializacao?: string;
    data_previsao_conclusao?: string;
    comprovante_cpf?: string;
    numero_proposta_SBA?: number;
    matricula_SAERJ?: number;
    matricula_SBA?: number;
    situacao?: string;
    uf_crm?: string;
    crm?: number;
    nome_completo: string;
    cpf?: string;
    sexo?: string;
    nome_profissional: string;
    categoria?: string;
    cep: string;
    logradouro: string;
    numero: number;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
    pais?: string;
    telefone_celular?: string;
    telefone_residencial?: string;
    email?: string;
    nome_instituicao_ensino_graduacao?: string;
    ano_conclusao_graduacao?: string;
    residencia_mec_cnrm?: string;
    nivel_residencia?: string;
    nome_hospital_mec?: string;
    uf_prm?: string;
    comprovante_endereco?: string;
    carta_indicacao_2_membros?: string;
    declaracao_hospital?: string;
    diploma_medicina?: string;
    certidao_quitacao_crm?: string;
    certificado_conclusao_especializacao?: string;
    declaro_verdadeiras?: string;
    declaro_quite_SAERJ?: string;
    pendencias_SAERJ?: string;
    nome_presidente_regional?: string;
    sigla_regional?: string;
    tratamento?: string;
}


export const EtiquetaPDF = async (linhas: number[]) => {
  var doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
  });

  for (let index = 0; index < linhas.length; index++) {

    try {
      const response = await fetch(`/api/associados/get/${linhas[index]}`);
      const data = await response.json();

      try{
          const response_saerj = await fetch(`/api/adicionais_saerj/get/${data.matricula_SAERJ}`);
          const data_saerj = await response_saerj.json();

          if(data_saerj != null){
              data['tratamento'] = data_saerj.tratamento;
          }

          const {
            nome_completo,
            bairro,
            cep,
            cidade,
            complemento,
            logradouro,
            numero,
            tratamento,
            uf,
          } = data;
      
          const startX = index % 2 === 0 ? 10 : 110;
          const startY = Math.floor(index / 2) * 40;  // Aumentei o espaçamento vertical para 40 unidades
      
          const borderWidth = 90;
          const borderHeight = 30;
          doc.rect(startX, 5 + startY, borderWidth, borderHeight);
      
          doc.setFontSize(12);
          const splitNome = doc.splitTextToSize(`${tratamento} ${nome_completo}`, 80);
          doc.text(splitNome, startX + 4, 12 + startY);
      
          doc.setFontSize(10);
          const splitEndereco = doc.splitTextToSize(`${logradouro} , ${numero} ${complemento}`, 80);
          doc.text(splitEndereco, startX + 4, 17 + startY);
      
          const splitBairro = doc.splitTextToSize(bairro, 80);
          doc.text(splitBairro, startX + 4, 22 + startY);
      
          const splitCidade = doc.splitTextToSize(`${cep} - ${cidade} / ${uf}`, 80);
          doc.text(splitCidade, startX + 4, 27 + startY);

      }catch{
        toast.error('Erro ao gerar etiquetas');
      }
      
    } catch (error) {
      toast.error('Erro ao gerar etiquetas');
      console.error('Erro ao buscar associados:', error);
    }

    
  };

  doc.save('etiquetas.pdf');
};
