import React, { useState } from 'react';
import { CSVReader } from 'react-papaparse';
import { FaPlus, FaTrash, FaDownload } from 'react-icons/fa';
import { saveAs } from 'file-saver';

function App() {
  const [data, setData] = useState([]);
  
  const handleOnDrop = (data) => {
    setData(data.map(row => row.data));
  };

  const handleOnError = (err) => {
    console.error(err);
  };

  const handleOnRemoveFile = () => {
    setData([]);
  };

  const addRow = () => {
    setData([...data, {}]);
  };

  const removeRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleChange = (index, key, value) => {
    const newData = [...data];
    newData[index][key] = value;
    setData(newData);
  };

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + data.map(e => Object.values(e).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, "edited_data.csv");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold underline mb-4">CSV Upload and Edit Tool</h1>
      <CSVReader
        onDrop={handleOnDrop}
        onError={handleOnError}
        addRemoveButton
        onRemoveFile={handleOnRemoveFile}
      >
        <span>Drop CSV file here or click to upload.</span>
      </CSVReader>
      {data.length > 0 && (
        <div>
          <table className="table-auto w-full mt-4">
            <thead>
              <tr>
                {Object.keys(data[0]).map((key, index) => (
                  <th key={index} className="px-4 py-2">{key}</th>
                ))}
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.keys(row).map((key, index) => (
                    <td key={index} className="border px-4 py-2">
                      <input
                        type="text"
                        value={row[key] || ''}
                        onChange={(e) => handleChange(rowIndex, key, e.target.value)}
                        className="w-full"
                      />
                    </td>
                  ))}
                  <td className="border px-4 py-2">
                    <button onClick={() => removeRow(rowIndex)} className="text-red-500">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addRow} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            <FaPlus /> Add Row
          </button>
          <button onClick={downloadCSV} className="mt-4 ml-4 bg-green-500 text-white px-4 py-2 rounded">
            <FaDownload /> Download CSV
          </button>
        </div>
      )}
    </div>
  );
}

export default App;