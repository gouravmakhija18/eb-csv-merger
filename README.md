# CSV Data Merger
This repo is used only for learning purpose which use live data of EB text files and convert them into CSV file and make relation in between purchaser and redeemer based on unique identification number

## Instruction how to see output file
1. Download this repo using git link
2. open repo in terminal. e.g. cd <repo_path>
3. Install repo dependencie's using `npm install` command
4. run command `npm run generate:output`
5. Above command will generate 3 outout files in output folder as described below
  a) eb_purchase_details.csv - it contain electoral bond purchaser information
  b) eb_redemption_details.csv - it contain electoral bond redemption information
  c) merged_eb_file.csv - It is combined final output file which is having purchaser and redemption relation based on common unique bond number

## Text Reference source
https://www.eci.gov.in/disclosure-of-electoral-bonds
