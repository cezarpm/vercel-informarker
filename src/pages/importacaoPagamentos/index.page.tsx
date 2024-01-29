import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/Button';
import { Container, Box } from './styled';
import { toast } from 'react-toastify';
import { BackPage } from '@/components/BackPage';

export default function CsvUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

    const handleUpload = async () => {
      if (file) {
          const formData = new FormData();
          formData.append('file', file);
  
          try {
              await axios.post('/api/importExcelPagamentos', formData, {
                  headers: {
                      'Content-Type': 'multipart/form-data'
                  }
              });
              alert('Dados enviados com sucesso!');
          } catch (error) {
              console.error('Erro ao enviar dados:', error);
              alert('Erro ao enviar dados.');
          }
        });
        
        const { linhasModificadas, linhasDuplicadas, linhasNaoEncontradas, linhasNaoPagas } = response.data;

        if (linhasModificadas === 0) {
          toast.warn('Nenhuma linha foi modificada.');
        } else if (linhasNaoEncontradas > 0) {
          toast.warn('Linhas não encontradas na base de associados.');
        } else {
          toast.success('Todos os dados foram alterados com sucesso.');
        }
        toast.info(`${linhasModificadas} linhas foram modificadas.`);
        toast.info(`${linhasDuplicadas} linhas duplicadas encontradas.`);
        toast.info(`${linhasNaoEncontradas} CPFs não encontrados na base de associados.`);
        toast.info(`${linhasNaoPagas} linhas não foram pagas.`);
      } catch (error) {
        console.error('Erro ao enviar dados:', error);
        toast.error('Erro ao enviar dados! Envie um arquivo CSV válido.');
      }
    }
  };

  return (
    <Container>
      <p>Importação Pagamentos Anuidade</p>
      <BackPage backRoute="/" discartPageBack />
      <Box>
        <div style={{ flexDirection: "row" }}>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <Button
            style={{ backgroundColor: '#4471C6' }}
            title="Importar dados"
            disabled={!file}
            onClick={() => {
              handleUpload();
            }
            }
          />
        </div>
      </Box>
    </Container>
  );
}
