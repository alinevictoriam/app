import React from 'react';
import DataTable from './DataTable'; // Certifique-se de que DataTable está corretamente importado

const ServiceTable = ({ services }) => {
  const columns = [
    { Header: 'Descrição', accessor: 'name' },
    { Header: 'Tipo', accessor: 'type' },
  ];

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Tabela de Serviços</h2>
      <DataTable columns={columns} data={services} className="green-table" />
    </div>
  );
};

export default ServiceTable;