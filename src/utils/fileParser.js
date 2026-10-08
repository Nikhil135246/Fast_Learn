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

/**
 * Parses a CSV or Excel file into MCQ format.
 * @param {File} file 
 * @returns {Promise<Array<{question: string, options: string[], correctIndex: number, explanation: string}>>}
 */
export const parseFileToMCQ = (file) => {
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
        
        const mcqs = [];
        
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length < 5) continue;
          
          const rawQ = row[0];
          const rawOptA = row[1];
          const rawOptB = row[2];
          const rawOptC = row[3];
          const rawOptD = row[4];
          const col5 = row[5] !== undefined && row[5] !== null ? String(row[5]).trim() : '';
          const col6 = row[6] !== undefined && row[6] !== null ? String(row[6]).trim() : '';
          
          if (rawQ !== undefined && rawQ !== null &&
              rawOptA !== undefined && rawOptA !== null &&
              rawOptB !== undefined && rawOptB !== null &&
              rawOptC !== undefined && rawOptC !== null &&
              rawOptD !== undefined && rawOptD !== null) {
              
            const qStr = String(rawQ).trim();
            const optAStr = String(rawOptA).trim();
            const optBStr = String(rawOptB).trim();
            const optCStr = String(rawOptC).trim();
            const optDStr = String(rawOptD).trim();
            const options = [optAStr, optBStr, optCStr, optDStr];
            
            // Ignore headers if present on row 0
            if (i === 0 && (qStr.toLowerCase() === 'question' || qStr.toLowerCase().includes('question'))) {
              continue;
            }
            
            if (qStr.length > 0 && optAStr.length > 0 && optBStr.length > 0 && optCStr.length > 0 && optDStr.length > 0) {
              let correctIndex = 0;
              let explanation = '';

              const findOptionIndex = (val) => {
                if (!val) return -1;
                const vUpper = val.toUpperCase();
                if (vUpper === 'A' || vUpper === 'OPTION A' || vUpper === '1') return 0;
                if (vUpper === 'B' || vUpper === 'OPTION B' || vUpper === '2') return 1;
                if (vUpper === 'C' || vUpper === 'OPTION C' || vUpper === '3') return 2;
                if (vUpper === 'D' || vUpper === 'OPTION D' || vUpper === '4') return 3;
                return options.findIndex(opt => opt.toLowerCase() === val.toLowerCase());
              };

              if (col6.length > 0) {
                // 7 columns: col5 is Correct Option, col6 is Explanation
                const idx = findOptionIndex(col5);
                correctIndex = idx !== -1 ? idx : 0;
                explanation = col6;
              } else if (col5.length > 0) {
                // 6 columns: test if col5 is Correct Option or Explanation
                const idx = findOptionIndex(col5);
                if (idx !== -1) {
                  correctIndex = idx;
                  explanation = '';
                } else {
                  correctIndex = 0;
                  explanation = col5;
                }
              }

              mcqs.push({
                question: qStr,
                options,
                correctIndex,
                explanation
              });
            }
          }
        }
        
        resolve(mcqs);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
