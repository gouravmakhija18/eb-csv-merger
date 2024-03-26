/**
 * File: purchase.js
 * Description: This file read eb_purchase_details.txt which is text conversion of electoral bond purchaser details pdf file and convert into csv file
 */
const fs = require('fs');
const readline = require('readline');
const { Transform } = require('stream');

const inputFilePath = './input/eb_purchase_details.txt';
const outputFilePath = './output/eb_purchase_details.csv';

const readStream = fs.createReadStream(inputFilePath);
const rl = readline.createInterface({
    input: readStream
});

const writeStream = fs.createWriteStream(outputFilePath);

const columnNames = [
    "S.No.",
    "Unique Id",
    "Reference No (URN)",
    "Journal Date",
    "Date of Purchase",
    "Date Of Expiry",
    "Name Of the Purchaser",
    "Prefix",
    "Bond Number",
    "Purchase Denominations",
    "Issue Branch Code",
    "Issue Teller",
    "Status",
];

writeStream.write(`${columnNames.join(',')}\n`);

const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        const line = chunk.toString().trim();
        const [serial, refNo, ...rest] = line.split(/\s+/);

        const journalDate = rest.shift();
        const dateOfPurchase = rest.shift();
        const dateOfExpiry = rest.shift();

        // Extract party name
        const dateOfExpiryIndex = rest.findIndex(item => /\d{2}\/\w{3}\/\d{4}/.test(item));
        const prefixIndex = rest.length - 6;

        // Extract party name
        const partyName = rest.slice(dateOfExpiryIndex + 1, prefixIndex).join(' ').replace(/,/g, '');

        const prefix = rest[rest.length - 6];
        const bondNumber = rest[rest.length - 5];
        const denominations = rest[rest.length - 4].replace(/,/g, '');
        const issueBranchCode = rest[rest.length - 3];
        const issueTeller = rest[rest.length - 2];
        const status = rest[rest.length - 1];
        const uniqueKey = `${prefix}${bondNumber}`;

        const csvData = `${serial},${uniqueKey},${refNo},${journalDate},${dateOfPurchase},${dateOfExpiry},${partyName},${prefix},${bondNumber},${denominations},${issueBranchCode},${issueTeller},${status}\n`;
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
