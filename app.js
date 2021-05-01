import data from './data.js';

// create a namespace
const app = {};

// console.log(data);

// get data from API (100 memes)
app.getMemeData = () => {
  const url = 'https://api.imgflip.com/get_memes';
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((info) => {
      console.log(info.data.memes[5].url);
    });
};

app.getMemeData();

// transform the data

// filter 9 memes

// display meme images

// create list items

// append list items to ul

// bind event listeners to the elements (meme image elements, captioned image, and buttons)

// display the form to the user

// get form input values from user and send them to API

// get response (captioned meme) from API

// display the captioned meme returned from API

// display download/email buttons

// implement download/email functionalities

// declare init function
// call the init()
