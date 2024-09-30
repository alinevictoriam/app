import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import BudgetStructureTable from './BudgetStructureTable';
import ComparisonTable from './ComparisonTable';
import { Link } from 'react-router-dom';
import './SecondPage.css';

const SecondPage = ({ financialData, measurementData = [] }) => {
  const [measurementOptions, setMeasurementOptions] = useState([]);
  const [selectedMeasurement, setSelectedMeasurement] = useState('');

  // Popula as opções de medição com base nas colunas de "Medição"
  useEffect(() => {
    if (measurementData && measurementData.length > 0) {
      // Log para depuração
      console.log('Dados de measurementData:', measurementData);
      
      const options = Object.keys(measurementData[0])
        .filter(key => key.startsWith('MEDIÇÃO')); // Filtra colunas que começam com "MEDIÇÃO"
  
      console.log('Colunas de Medição:', options); // Verifica as colunas de medição encontradas
      setMeasurementOptions(options); // Atualiza as opções de medição
    }
  }, [measurementData]);
  

  const handleDownloadPDF = () => {
    const input = document.getElementById('pdf-content');

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 150;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const positionX = (210 - imgWidth) / 2;
      let positionY = 0;

      pdf.addImage(imgData, 'PNG', positionX, positionY, imgWidth, imgHeight);

      while (imgHeight > pageHeight) {
        positionY = imgHeight - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', positionX, -positionY, imgWidth, imgHeight);
      }

      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'page-content.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);
    });
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Segunda Página</h1>

      {/* Cabeçalho de seleção de medição */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <label htmlFor="measurement-select">Selecione uma medição:</label>
        <select
          id="measurement-select"
          value={selectedMeasurement}
          onChange={(e) => setSelectedMeasurement(e.target.value)}
        >
          <option value="">Selecione</option>
          {measurementOptions.length > 0 ? (
            measurementOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))
          ) : (
            <option disabled>Nenhuma medição disponível</option>
          )}
        </select>
      </div>

      {/* Box que mostra todas as medições disponíveis */}
      <div style={{
        border: '1px solid #ccc',
        padding: '10px',
        margin: '20px auto',
        width: '50%',
        textAlign: 'center',
        backgroundColor: 'aliceblue'
      }}>
        <h3>Medições Disponíveis:</h3>
        {measurementOptions.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {measurementOptions.map((option, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                {option}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma medição disponível</p>
        )}
      </div>

      {/* Conteúdo para PDF */}
      <div id="pdf-content" style={{ margin: '0 auto', width: 'fit-content' }}>
        <BudgetStructureTable financialData={financialData} />
        
        {/* Renderiza ComparisonTable apenas se uma medição for selecionada */}
        {selectedMeasurement && (
          <ComparisonTable 
            selectedMeasurement={selectedMeasurement} 
            measurementData={measurementData} 
          />
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={handleDownloadPDF}>Baixar PDF</button>
        <Link to="/">
          <button>Voltar para a Primeira Página</button>
        </Link>
      </div>
    </div>
  );
};

export default SecondPage;
