'use strict';
/* global $ */

const apiKey = 'Toxpz6W0wVrV7c9dwb0cOWvl3kmVZLztz1RYMcwM'; 
const searchURL = 'https://api.nps.gov/api/v1/parks';
let stateCodeString = '';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
    // for each park object in the data 
    //array, add a list item to the results 
    //list with the full name, description,
    //website URL, and address
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <a href='${responseJson.data[i].url}'>${responseJson.data[i].url}</a>
      </li>`
    );}
  //display the results section  
  $('#results').removeClass('hidden');
}

function makeStateCodeString(states) {
  stateCodeString = '';
  states.forEach(element => {
    stateCodeString += `stateCode=${element}&`;
  });
}

function getNationalParks(limit) {
  const params = {
    limit,
    api_key: apiKey,
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + stateCodeString + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const states = $('#states').val().split(',');
    makeStateCodeString(states);
    const limit = $('#max-results').val();
    getNationalParks(limit);
  });
}

$(watchForm);