import React from 'react';
import DataTable from './DataTable';

const ComparisonTable = ({ financialData, measurementData, selectedMeasurement }) => {
  // Função para formatar os números
  const formatNumber = (value) => {
    if (value === null || value === undefined) return '';
    const number = parseFloat(value);
    if (isNaN(number)) return value; // Retorna o valor original se não for um número
    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Agrupa as medições por nome
  const measurementGroups = measurementData.reduce((acc, measurementRow) => {
    Object.keys(measurementRow).forEach(key => {
      if (key.includes('Medição')) {
        if (!acc[key]) acc[key] = [];
        acc[key].push({
          Descrição: measurementRow.Descrição,
          Value: measurementRow[key]
        });
      }
    });
    return acc;
  }, {});

  // Prepara dados para uma medição específica
  const prepareDataForMeasurement = (measurementName) => {
    return financialData.map(financialRow => {
      const matchingMeasurements = measurementGroups[measurementName]?.find(measurementRow =>
        measurementRow.Descrição === financialRow.Descrição
      );

      const row = {
        Descrição: financialRow.Descrição,
        'Total por Etapa (R$)': formatNumber(financialRow['Total por Etapa (R$)']),
        'Previsto (R$)': formatNumber(financialRow['Previsto (R$)']),
        '% Previsto': formatNumber(financialRow['% Previsto']),
        'Realizado (R$)': matchingMeasurements ? formatNumber(matchingMeasurements.Value) : '',
        '% Realizado': matchingMeasurements ? formatNumber((matchingMeasurements.Value / financialRow['Total por Etapa (R$)']) * 100) : '',
        'Desvio': matchingMeasurements ? formatNumber((matchingMeasurements.Value / financialRow['Total por Etapa (R$)']) * 100 - financialRow['% Previsto']) : ''
      };

      return row;
    });
  };

  // Define as tabelas para todas as medições
  const tables = Object.keys(measurementGroups).map((measurementName, index) => (
    <div key={index} style={{ display: selectedMeasurement === measurementName ? 'block' : 'none' }}>
      <h2 style={{ textAlign: 'center' }}>Tabela de Comparação - {measurementName}</h2>
      <DataTable 
        columns={[
          { Header: 'Descrição', accessor: 'Descrição' },
          { Header: 'Total por Etapa (R$)', accessor: 'Total por Etapa (R$)' },
          { Header: 'Previsto (R$)', accessor: 'Previsto (R$)' },
          { Header: '% Previsto', accessor: '% Previsto' },
          { Header: 'Realizado (R$)', accessor: 'Realizado (R$)' },
          { Header: '% Realizado', accessor: '% Realizado' },
          { Header: 'Desvio', accessor: 'Desvio' },
        ]}
        data={prepareDataForMeasurement(measurementName)}
        className="blue-table"
      />
    </div>
  ));

  return <div>{tables}</div>;
};

export default ComparisonTable;
