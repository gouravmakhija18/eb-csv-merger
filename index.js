/**
 * File: index.js
 * Description: This file read combine both csv file generated by converting eb_purchase_details.txt and eb_redemption_details.txt file and provide combined result file merged_eb_file.csv
 */
const fs = require('fs');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

// Function to read CSV file and return a Promise that resolves to an array of objects
function readCSV(filename) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filename)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// Function to write data to a CSV file
function writeCSV(data, filename, headers) {
  const csvWriter = createObjectCsvWriter({
    path: filename,
    header: headers.map(key => ({ id: key, title: key }))
  });
  csvWriter.writeRecords(data)
    .then(() => console.log('CSV file has been written successfully.'))
    .catch(error => console.error('Error writing CSV:', error));
}

// Main function to merge two CSV files
async function mergeCSV(file1, file2, commonKey, outputFile, mergedHeaders) {
  try {
    const data1 = await readCSV(file1);
    const data2 = await readCSV(file2);

    // Merge data based on common key
    const mergedData = data1.map(row1 => {
      const commonData = data2.find(row2 => row1[commonKey] === row2[commonKey]);
      return { ...row1, ...commonData };
    });

    // Extract required columns
    const filteredData = mergedData.map(row => {
      const filteredRow = {};
      mergedHeaders.forEach(column => {
        filteredRow[column] = row[column] || 'NA';
      });
      return filteredRow;
    });

    // Write merged data to CSV file
    writeCSV(filteredData, outputFile, mergedHeaders);
  } catch (error) {
    console.error('Error merging CSV files:', error);
  }
}

// Define merged headers
const mergedHeaders = [
  'S.No.',
  'Unique Id',
  'Prefix',
  'Bond Number',
  'Journal Date',
  'Date of Purchase',
  'Date Of Expiry',
  'Date of Encashment',
  'Name Of Political Party',
  'Account Number',
  'Name Of the Purchaser',
  'Redemption Denominations',
  'Pay Branch Code',
  'Pay Teller',
  'Reference No (URN)',
  'Purchase Denominations',
  'Issue Branch Code',
  'Issue Teller',
  'Status'
];

// function execution
mergeCSV(
  './output/eb_purchase_details.csv',
  './output/eb_redemption_details.csv',
  'Unique Id',
  './output/merged_eb_file.csv',
  mergedHeaders
);
