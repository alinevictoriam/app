import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FileUploader from './components/FileUploader';
import DataTable from './components/DataTable';
import SecondPage from './components/SecondPage';
import * as XLSX from 'xlsx';
import './App.css';

const App = () => {
  const [financialData, setFinancialData] = useState([]);
  const [measurementData, setMeasurementData] = useState([]);
  const [services, setServices] = useState([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [savedServices, setSavedServices] = useState([]);
  const [measurementColumns, setMeasurementColumns] = useState([]);

  const formatNumber = (value) => {
    if (value === null || value === undefined) return '';
    const number = parseFloat(value);
    if (isNaN(number)) return value; // Retorna o valor original se não for um número
    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleFileDrop = (files) => {
    let financialLoaded = false;
    let measurementsLoaded = false;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (file.name.toLowerCase().includes('cronograma')) {
          setFinancialData(jsonData);
          localStorage.setItem('financialData', JSON.stringify(jsonData));
          financialLoaded = true;
        } else if (file.name.toLowerCase().includes('medicoes')) {
          setMeasurementData(jsonData);
          localStorage.setItem('measurementData', JSON.stringify(jsonData));
          measurementsLoaded = true;

          // Conta as colunas de medições
          const columns = Object.keys(jsonData[0]).filter(col => col.toLowerCase().startsWith('medição'));
          setMeasurementColumns(columns);
        }

        if (financialLoaded && measurementsLoaded) {
          const allServices = [...new Set([
            ...jsonData.map(row => row.Descrição || ''),
            ...financialData.map(row => row.Descrição || '')
          ])];
          setServices(allServices.map(service => ({ name: service, type: '' })));
          setShowServiceForm(true);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleServiceChange = (index, type) => {
    setServices(services.map((service, i) => 
      i === index ? { ...service, type } : service
    ));
  };

  const handleSaveServices = () => {
    setSavedServices([...services]); // Salva os serviços no estado
    localStorage.setItem('savedServices', JSON.stringify(services)); // Salva no localStorage
    console.log('Serviços definidos:', services);
  };

  const getColumnConfig = (data) => {
    return data.length > 0
      ? Object.keys(data[0]).map(key => ({
          Header: key,
          accessor: key,
          Cell: ({ value }) => {
            // Aplica a formatação apenas se o valor for um número
            return isNaN(parseFloat(value)) ? value : formatNumber(value);
          }
        }))
      : [];
  };

  const financialColumns = useMemo(() => getColumnConfig(financialData), [financialData]);
  const measurementColumnsConfig = useMemo(() => getColumnConfig(measurementData), [measurementData]);

  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={
            <div>
              <FileUploader onDrop={handleFileDrop} />
              <h2 style={{ textAlign: 'center' }}>Cronograma Financeiro</h2>
              <DataTable columns={financialColumns} data={financialData} className="green-table" />
              <h2 style={{ textAlign: 'center' }}>Medições</h2>
              <DataTable columns={measurementColumnsConfig} data={measurementData} className="green-table" />

              {showServiceForm && (
                <div className="service-form-container">
                  <h2 style={{ textAlign: 'center' }}>Definir Serviços</h2>
                  {services.map((service, index) => (
                    <div key={index} className="service-line">
                      <label>
                        <span>{service.name}</span>
                        <div className="service-selection-container">
                          <label>
                            <input
                              type="radio"
                              name={`service-${index}`}
                              checked={service.type === 'direto'}
                              onChange={() => handleServiceChange(index, 'direto')}
                            />
                            Direto
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`service-${index}`}
                              checked={service.type === 'indireto'}
                              onChange={() => handleServiceChange(index, 'indireto')}
                            />
                            Indireto
                          </label>
                        </div>
                      </label>
                    </div>
                  ))}
                  <button onClick={handleSaveServices}>Salvar</button>
                </div>
              )}

              {savedServices.length > 0 && (
                <ServiceTable services={savedServices} />
              )}

              {/* Botão para a segunda página */}
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/second-page">
                  <button>Ir para a Segunda Página</button>
                </Link>
              </div>
            </div>
          } />

          <Route path="/second-page" element={
            <SecondPage 
              services={JSON.parse(localStorage.getItem('savedServices')) || []}
              financialData={JSON.parse(localStorage.getItem('financialData')) || []}
              measurementColumns={measurementColumns}
            />
          } />
        </Routes>
      </div>
    </Router>
  );
};

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

export default App;
