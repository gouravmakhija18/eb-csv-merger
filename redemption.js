/**
 * File: redemption.js
 * Description: This file read eb_redemption_details.txt which is text conversion of electoral bond redemption details pdf file and convert into csv file
 */
const fs = require('fs');
const readline = require('readline');
const { Transform } = require('stream');

const inputFilePath = './input/eb_redemption_details.txt';
const outputFilePath = './output/eb_redemption_details.csv';

const readStream = fs.createReadStream(inputFilePath);
const rl = readline.createInterface({
    input: readStream
});

const writeStream = fs.createWriteStream(outputFilePath);

const columnNames = [
    "S.No.",
    "Unique Id",
    "Date of Encashment",
    "Name Of Political Party",
    "Account Number",
    "Prefix",
    "Bond Number",
    "Redemption Denominations",
    "Pay Branch Code",
    "Pay Teller"
];

writeStream.write(`${columnNames.join(',')}\n`);

const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        const line = chunk.toString().trim();
        const [serial, date, ...rest] = line.split(/\s+/);
        
        const partyNameIndex = rest.findIndex(item => item.match(/[*]{7}\d+/));
        const partyName = rest.slice(0, partyNameIndex).join(' ').replace(/,/g, '');
        
        const accountMatch = line.match(/[*]{7}\d+/);
        const account = accountMatch ? accountMatch[0] : '';
        
        const prefixIndex = rest.indexOf(account) + 1;
        const prefix = rest[prefixIndex];
        const bondNumber = rest[prefixIndex + 1].toString();
        const denominations = rest[prefixIndex + 2].replace(/,/g, '');
        
        const branch = rest[rest.length - 2].toString();
        const teller = rest[rest.length - 1].toString();
        
        const pkey = `${prefix}${bondNumber}`;
        
        const csvData = `${serial},${pkey},${date},${partyName},${account},${prefix},${bondNumber},${denominations},${branch},${teller}\n`;        
        this.push(csvData);
        callback();
    }
});

rl.on('line', (line) => {
    transformStream.write(line + '\n');
});

transformStream.pipe(writeStream);

writeStream.on('finish', () => {
    console.log('CSV file has been created successfully.');
});

writeStream.on('error', (err) => {
    console.error('Error writing CSV file:', err);
});
