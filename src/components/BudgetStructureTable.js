import React from 'react';

const BudgetStructureTable = ({ financialData }) => {
  const calculateTotalByStage = (service) => {
    return financialData.reduce((total, item) => {
      if (item.Descrição === service) {
        const values = Object.values(item).slice(1); // Ignora a primeira coluna (Descrição)
        const sum = values.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
        return sum;
      }
      return total;
    }, 0);
  };

  const totalPerStage = financialData.map(service => ({
    description: service.Descrição,
    total: calculateTotalByStage(service.Descrição)
  }));

  const totalGeneral = totalPerStage.reduce((total, item) => total + item.total, 0);

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Estrutura Orçamentária</h2>
      <table className="blue-table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Total por Etapa (R$)</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {totalPerStage.map((item, index) => (
            <tr key={index}>
              <td>{item.description}</td>
              <td>{item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>{((item.total / totalGeneral) * 100).toFixed(2)}%</td>
            </tr>
          ))}
          <tr>
            <td><strong>Total Geral</strong></td>
            <td><strong>{totalGeneral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
            <td>100%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BudgetStructureTable;
