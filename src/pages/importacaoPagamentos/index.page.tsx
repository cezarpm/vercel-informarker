import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { Button } from '@/components/Button';
import { Container, Box } from './styled';

export default function CsvUpload() {
    const [file, setFile] = useState(null);

    const handleFileChange = (e: any) => {
        setFile(e.target.files[0]);
    };

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
      }
  };

    return (
      <Container>
      <p>Importação Pagamentos Anuidade</p>
      <Box>
        <div style={{flexDirection: "row"}}>
      <input type="file" accept=".csv" onChange={handleFileChange} />
        <Button
          style={{ backgroundColor: '#4471C6' }}
          title="Importar dados"
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
