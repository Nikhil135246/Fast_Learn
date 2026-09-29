import * as XLSX from 'xlsx';

/**
 * Parses a CSV or Excel file and extracts the first two columns as Key and Value.
 * @param {File} file 
 * @returns {Promise<Array<{key: string, value: string}>>}
 */
export const parseFileToKeyValuePairs = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Read first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert sheet to array of arrays (rows)
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        const keyValues = [];
        
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length < 2) continue;
          
          const rawKey = row[0];
          const rawVal = row[1];
          
          if (rawKey !== undefined && rawKey !== null && rawVal !== undefined && rawVal !== null) {
            const keyStr = String(rawKey).trim();
            const valStr = String(rawVal).trim();
            
            // Ignore headers like "Key", "Value" if present on row 0
            if (i === 0 && keyStr.toLowerCase() === 'key' && valStr.toLowerCase() === 'value') {
              continue;
            }
            
            if (keyStr.length > 0 && valStr.length > 0) {
              keyValues.push({ key: keyStr, value: valStr });
            }
          }
        }
        
        resolve(keyValues);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
