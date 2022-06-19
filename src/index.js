/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

const CLIENT_ID = '406307705399-k9ubjl0a7m4ni2kajduqsh1ieijb7fae.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAEVygFACok9Qi5j0dTm-K6WrVbNf9dSZA';

// Discovery doc URL for APIs
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;
let studentsList = [];

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client', intializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the discovery doc to initialize the API.
 */
async function intializeGapiClient() {
    await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
    });
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '',
    });
}

/**
 *  Sign in the user.
 */
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
        throw (resp);
    }

    document.getElementById('login').remove();

    document.getElementById('content').style.width = '100%';
    document.getElementById('content').innerHTML = 
    `<h4>Resultado</h4>` +
    `<p><i>Verifique se você foi aprovado no curso<br><strong>Boas Escolhas Online</strong></i></p>` +
    `<div class="search-container">` +
        `<input id="search-input" type="text" placeholder="Digite aqui o seu nome"><button onclick="handleSearchStudent()">Consultar</button>` +
    `</div>` +
    `<div id="result-container">` +
    `</div>`;

    await loadSpreadsheetData();
    };

    if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data when establishing a new session.
    tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
    }
}

/**
 *  Load spreadsheet data into memory.
 */
async function loadSpreadsheetData(){
    var params = {
        // The spreadsheet to request.
        spreadsheetId: '1cPefI67Fc1XFJ9sKMp1Qkp5seBmo6vK8tiEwOKxc7Uc',

        // The ranges to retrieve from the spreadsheet.
        ranges: [],

        // True if grid data should be returned.
        // This parameter is ignored if a field mask was set in the request.
        includeGridData: true,
    };

    var request = gapi.client.sheets.spreadsheets.get(params);
        request.then(function(response) {
            getStudentsInformation(response.result.sheets[0].data[0].rowData);
        }, function(reason) {
            console.error('error: ' + reason.result.error.message);
        });
}

/**
 * Populates the students list based on the loaded data from the spreadsheet.
 */
function getStudentsInformation(sheetRows){
    /* Each value in the first row corresponds to a worksheet's column (which will correspond to an student's attribute),
    so we skip it starting with the second line. */
    for(index = 1; index < sheetRows.length; index++){
    /* From now on, each line corresponds to a student record. Each record corresponds 
    to an array where each index contains the value of a certain student's attribute. */
    let newStudent = {
        name: sheetRows[index].values[0].effectiveValue.stringValue,
        grades: {
        module_01: sheetRows[index].values[1].effectiveValue.numberValue,
        module_02: sheetRows[index].values[2].effectiveValue.numberValue,
        module_03: sheetRows[index].values[3].effectiveValue.numberValue,
        module_04: sheetRows[index].values[4].effectiveValue.numberValue
        }
    }
    studentsList.push(newStudent);
    }
}

/**
 * Main function for checking the researched student's result.
*/
function handleSearchStudent(){
    let studentResearched = document.getElementById('search-input').value;
    
    let student = getStudentByName(studentResearched);

    if(student ==  undefined){
    buildMessageStudentNotFound();
    return;
    }

    let studentGradeAverage = getStudentGradeAverage(student.grades);

    if(studentGradeAverage >= 7.0) {
    buildMessageApprovedStudent(studentGradeAverage);
    } else {
    buildMessageDisapprovedStudent(studentGradeAverage);
    }
}

/**
 * Function that returns the researched student's data.
*/
function getStudentByName(studentName){
    return studentsList.filter(student => student.name == studentName)[0];
}

/**
 * Function that returns the student's grades average.
*/
function getStudentGradeAverage(studentGrades){
    return (studentGrades.module_01 + studentGrades.module_02 + studentGrades.module_03 + studentGrades.module_04)/4;
}

/**
 * Function that inserts an not found student's information in the DOM.
*/
function buildMessageStudentNotFound(){
    document.getElementById('result-container').innerHTML = 
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M208.4 208C208.4 225.7 194 240 176.4 240C158.7 240 144.4 225.7 144.4 208C144.4 190.3 158.7 176 176.4 176C194 176 208.4 190.3 208.4 208zM304.4 208C304.4 190.3 318.7 176 336.4 176C354 176 368.4 190.3 368.4 208C368.4 225.7 354 240 336.4 240C318.7 240 304.4 225.7 304.4 208zM0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"/></svg>`+
    `<h4>Aluno(a) não econtrado(a)!</h4>`;
}

/**
 * Function that inserts an approved student's information in the DOM.
*/
function buildMessageApprovedStudent(value){
    document.getElementById('result-container').innerHTML = 
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M199.8 167.3L237.9 172.3C240.1 172.7 243.5 174.8 244.5 177.8C245.4 180.7 244.6 183.9 242.4 186L214.5 212.5L221.5 250.3C222 253.4 220.8 256.4 218.3 258.2C215.8 260.1 212.5 260.3 209.8 258.8L175.1 240.5L142.2 258.8C139.5 260.3 136.2 260.1 133.7 258.2C131.2 256.4 129.1 253.4 130.5 250.3L137.5 212.5L109.6 186C107.4 183.9 106.6 180.7 107.5 177.8C108.5 174.8 111 172.7 114.1 172.3L152.2 167.3L168.8 132.6C170.1 129.8 172.9 128 175.1 128C179.1 128 181.9 129.8 183.2 132.6L199.8 167.3zM359.8 167.3L397.9 172.3C400.1 172.7 403.5 174.8 404.5 177.8C405.4 180.7 404.6 183.9 402.4 186L374.5 212.5L381.5 250.3C382 253.4 380.8 256.4 378.3 258.2C375.8 260.1 372.5 260.3 369.8 258.8L336 240.5L302.2 258.8C299.5 260.3 296.2 260.1 293.7 258.2C291.2 256.4 289.1 253.4 290.5 250.3L297.5 212.5L269.6 186C267.4 183.9 266.6 180.7 267.5 177.8C268.5 174.8 271 172.7 274.1 172.3L312.2 167.3L328.8 132.6C330.1 129.8 332.9 128 336 128C339.1 128 341.9 129.8 343.2 132.6L359.8 167.3zM349.5 308.4C368.2 303.1 385.4 320.4 374.1 336.5C350.4 374.6 306.3 399.1 255.9 399.1C205.6 399.1 161.5 374.6 136.9 336.5C126.5 320.4 143.7 303.1 162.3 308.4C191.3 315.1 222.8 318.8 255.9 318.8C289 318.8 320.6 315.1 349.5 308.4zM0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464z"/></svg>`+
    `<h4>Parabéns! Você foi aprovado(a) no curso com média ${value}!</h4>`;
}

/**
 * Function that inserts an disapproved student's information in the DOM.
*/
function buildMessageDisapprovedStudent(value){
    document.getElementById('result-container').innerHTML = 
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M159.6 220C148.1 220 139.7 223.8 134.2 229.7C126.7 237.7 114 238.1 105.1 230.6C97.89 223 97.48 210.4 105 202.3C119.6 186.8 140.3 180 159.6 180C178.1 180 199.7 186.8 214.2 202.3C221.8 210.4 221.4 223 213.3 230.6C205.2 238.1 192.6 237.7 185 229.7C179.6 223.8 170.3 220 159.6 220zM297.9 230.6C289.9 223 289.5 210.4 297 202.3C311.6 186.8 332.3 180 351.6 180C370.1 180 391.7 186.8 406.2 202.3C413.8 210.4 413.4 223 405.3 230.6C397.2 238.1 384.6 237.7 377 229.7C371.6 223.8 362.3 220 351.6 220C340.1 220 331.7 223.8 326.2 229.7C318.7 237.7 306 238.1 297.9 230.6zM208 320C208 293.5 229.5 272 256 272C282.5 272 304 293.5 304 320V352C304 378.5 282.5 400 256 400C229.5 400 208 378.5 208 352V320zM0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM400 406.1C439.4 368.2 464 314.1 464 256C464 141.1 370.9 48 256 48C141.1 48 48 141.1 48 256C48 314.1 72.55 368.2 112 406.1V288C112 274.7 122.7 264 136 264C149.3 264 160 274.7 160 288V440.6C188.7 455.5 221.4 464 256 464C290.6 464 323.3 455.5 352 440.6V288C352 274.7 362.7 264 376 264C389.3 264 400 274.7 400 288V406.1z"/></svg>`+
    `<h4>Com sua média ${value}, infelizmente você não foi aprovado(a) no curso.</h4>`;
}