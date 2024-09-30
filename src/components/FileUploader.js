import React from 'react';
import { useDropzone } from 'react-dropzone';

const FileUploader = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop, 
    accept: '.xlsx',
    multiple: true  // Permitir múltiplos arquivos
  });

  return (
    <div {...getRootProps({ className: 'dropzone' })} style={dropzoneStyle}>
      <input {...getInputProps()} />
      <p>Arraste e solte os arquivos aqui, ou clique para selecionar</p>
    </div>
  );
};

const dropzoneStyle = {
  border: '2px dashed #ccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer'
};

export default FileUploader;
