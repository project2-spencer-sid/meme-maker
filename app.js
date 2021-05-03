import data from './data.js';
import userData from './env.js';

console.log(userData);
// create a namespace
const app = {
  memeIndex: 0,
};


const galleryUl = document.querySelector('.gallery');
const saveModal = document.querySelector('.saveModal');
const submitModal = document.querySelector('.submitModal');
const closeButton = document.querySelector('.closeButton');

const topCaption = document.getElementById('topText');
const bottomCaption = document.getElementById('bottomText');

// form clearing function
function clearInput (){
  topCaption.value='';
  bottomCaption.value='';
}
// console.log(data);
// display meme images
app.displayMemes = (memes) => {
  for (let i = app.memeIndex; i < app.memeIndex + 9; i++) {
    // create list items
    const li = document.createElement('li');
    li.className = 'galleryItem';

    const src = memes[i].url;
    const alt = memes[i].name;
    const memeId = memes[i].id;

    // li.setAttribute('data-url', src);
    // li.setAttribute('data-name', alt);
    li.setAttribute('data-template_id', memeId);

    // console.log(memeId);

    li.innerHTML = `<img class="imgBox" src="${src}" alt="${alt}" />`;
    // append list items to ul
    galleryUl.append(li);
  }
};

// get data from API (100 memes)
app.getMemeData = () => {
  const url = 'https://api.imgflip.com/get_memes';
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((info) => {
      // console.log(info.data.memes[5].url);
      app.displayMemes(info.data.memes);
      // cache memes data into namespace
      app.memes = info.data.memes;
    });
};

app.getMemeData();

// transform the data

// filter 9 memes
app.loadMore = () => {
  // display memes so that they're displayed evenly on screen (e.g. 2 x 4)
  app.memeIndex += 9;
};

// function to display image in modal
const displayModalImage = function (source, title) {
  // const source = dataset.url;
  // const title = dataset.name;
  // const img = document.createElement('img');
  // img.src = source;
  // img.alt = title;
  const modalImageContainer = document.querySelector('.modalImageContainer');
  console.log(source, title);
  modalImageContainer.innerHTML = `<img src="${source}" alt="${title}">`;

  // modalImageContainer.appendChild(img);
};

// bind event listeners to the elements (meme image elements, captioned image, and buttons)
galleryUl.addEventListener('click', function (event) {
  // console.log('event listener works');
  // console.log(event.target.tagName);
  // const liTarget = event.target.parentElement;
  const imgElem = event.target;
  if (imgElem.tagName === 'IMG') {
    console.log('list item has been clicked');
    // console.log(liTarget.dataset);
    submitModal.classList.add('show');
    const source = imgElem.src;
    const title = imgElem.alt;
    displayModalImage(source, title);
    app.selectedMemeId = imgElem.parentElement.dataset.template_id;
    console.log(app.selectedMemeId);
    // modal.style.display = 'block';
  }
});

closeButton.addEventListener('click', function () {
  submitModal.classList.remove('show');
});

// display the form to the user

// get form input values from user and send them to API

const captionsForm = document.querySelector('.captions');
captionsForm.addEventListener('submit', function(event) {
  event.preventDefault();
 
  
  const url = new URL('https://api.imgflip.com/caption_image');
  url.search = new URLSearchParams({
    text0: topCaption.value,
    text1: bottomCaption.value,
    template_id: app.selectedMemeId,
    username: userData.username,
    password: userData.password,
  })
  console.log(topCaption.value);
  console.log(bottomCaption.value);

// // Example POST method implementation:
  const data = {
    
    username: userData.username,
    password: userData.password,
  }

  console.log(data);
  // Default options are marked with *
  fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // TODO: get private info passed through the body, not search params
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  }).then((response) => {
      console.log(response);
      
      return response.json();
    }).then((jsonResponse) => {

      console.log(jsonResponse);
      displayModalImage(jsonResponse.data.url,'testtitle');
    })
  clearInput();

 })



// get response (captioned meme) from API

// display the captioned meme returned from API

// display download/email buttons

// implement download/email functionalities

// declare init function
// call the init()

// add event listener to "load more" button
const loadMoreButton = document.querySelector('.loadButton');
loadMoreButton.addEventListener('click', function () {
  app.loadMore();
  app.displayMemes(app.memes);
});
