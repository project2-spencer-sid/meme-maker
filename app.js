import data from './data.js';
import userData from './env.js';

console.log(userData);
// create a namespace
const app = {
  memeIndex: 0,
  memesPerPage: 8,
  bp: {
    lg: 1075,
    md: 815,
    sm: 556,
  },
  prewrittenCaptions: [
    {text0: '1', text1: '1b'},
    {text0: '2', text1: '2b'},
    {text0: '3', text1: '3b'},
    {text0: '4', text1: '4b'}
  ],
  generateCaptions: true,
  selectedMemeName: ''
};

console.log(app.prewrittenCaptions[2].text1);

const galleryUl = document.querySelector('.gallery');
const saveModal = document.querySelector('.saveModal');
const submitModal = document.querySelector('.submitModal');
const closeButton = document.querySelector('.closeButton');
const topCaption = document.getElementById('topText');
const bottomCaption = document.getElementById('bottomText');
const loadMoreButton = document.querySelector('.loadButton');
// const saveButton = document.getElementById('saveButton');
const captionsForm = document.querySelector('.captions');
const submitButton = document.querySelector('.submitButton');
const appElement = document.querySelector('.app');

// form clearing function
function clearInput() {
  topCaption.value = '';
  bottomCaption.value = '';
}
// console.log(data);
// display meme images
app.displayMemes = (memes) => {
  if (app.memeIndex > 99) return;

  const startingMemeIndex = app.memeIndex;

  let currentMemeIndex = 0;
  for (let i = currentMemeIndex; i < app.memesPerPage; i++) {
    currentMemeIndex = startingMemeIndex + i;
    // console.log({
    //   i,
    //   startingMemeIndex,
    //   currentMemeIndex,
    //   length: memes.length,
    // });

    // create list items
    const li = document.createElement('li');
    li.className = 'galleryItem';

    const src = memes[currentMemeIndex].url;
    const alt = memes[currentMemeIndex].name;
    const memeId = memes[currentMemeIndex].id;

    // li.setAttribute('data-url', src);
    // li.setAttribute('data-name', alt);
    li.setAttribute('data-template_id', memeId);

    // console.log(memeId);

    // transform the data
    li.innerHTML = `<img class="imgBox" src="${src}" alt="${alt}" />`;
    // append list items to ul
    galleryUl.append(li);

    if (currentMemeIndex >= memes.length - 1) break;
  }
  return currentMemeIndex;
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

function hideLoadMoreButton() {
  loadMoreButton.classList.add('hide');
}

// filter 9 memes
app.incrementMemeIndex = () => {
  // display memes so that they're displayed evenly on screen (e.g. 2 x 4)
  app.memeIndex += app.memesPerPage;
  console.log(app.memeIndex);
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
    app.selectedMemeName = title;
    console.log(app.selectedMemeId);
    // modal.style.display = 'block';
  }
});

closeButton.addEventListener('click', function () {
  submitModal.classList.remove('show');
  // hideSaveButton();
});

// function showSaveButton() {
//   saveButton.classList.add('show');
// }

// function hideSaveButton() {
//   saveButton.classList.remove('show');
// }

// display the form to the user
// get form input values from user and send them to API

// add input validation - remove disabled attribute from submit button when either of the caption value is not empty
const buttonModeChecker = () => {
  const firstInputValue = topCaption.value;
  const secondInputValue = bottomCaption.value;
  if (firstInputValue || secondInputValue) {
    submitButton.textContent = 'Add Caption';
    app.generateCaptions = false;
  } else {
    submitButton.textContent = 'Generate Random Captions';
    app.generateCaptions = true;
  }
}

captionsForm.addEventListener('input', buttonModeChecker);

const getRandomCaption = function () {
  const randomIndex = Math.floor(Math.random() * app.prewrittenCaptions.length);
  return app.prewrittenCaptions[randomIndex];
}

captionsForm.addEventListener('submit', function (event) {
  console.log;
  event.preventDefault();
  const formElement = document.querySelector('form.captions');

  const randomCaption = getRandomCaption();
  const text0 = app.generateCaptions? randomCaption.text0: topCaption.value
  const text1 = app.generateCaptions? randomCaption.text1: bottomCaption.value

  const url = new URL('https://api.imgflip.com/caption_image');
  const data = new URLSearchParams({
    text0,
    text1,
    template_id: app.selectedMemeId,
    username: userData.username,
    password: userData.password,
  });
  console.log(topCaption.value);
  console.log(bottomCaption.value);

 
  console.log(data);
  // Default options are marked with *
  fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // TODO: get private info passed through the body, not search params
    body: data, // body data type must match "Content-Type" header
  })
    .then((response) => {
      console.log(response);

      return response.json();
    })
    .then((jsonResponse) => {
      console.log(jsonResponse);
      const captionedUrl = jsonResponse.data.url;
      displayModalImage(captionedUrl, app.selectedMemeName);
      app.captionedUrl = captionedUrl;
      buttonModeChecker();
    });

  clearInput();
  // showSaveButton();
});

// implement download/email functionalities

// saveButton.addEventListener('click', function () {
//   // save image file to the local disk with FileSaver.js
//   const fileName = app.selectedMemeName;
//   saveAs(app.captionedUrl, app.selectedMemeName);
// });

// get response (captioned meme) from API

// display the captioned meme returned from API

// display download/email buttons

// add event listener to "load more" button
loadMoreButton.addEventListener('click', function () {
  app.incrementMemeIndex();
  const currentMemeIndex = app.displayMemes(app.memes);
  if (currentMemeIndex >= app.memes.length - 1) {
    hideLoadMoreButton();
  }
});

function updateMemesPerPage(width) {
  if (width > app.bp.lg) {
    app.memesPerPage = 8;
  } else if (width > app.bp.md) {
    app.memesPerPage = 9;
  } else if (width > app.bp.sm) {
    app.memesPerPage = 6;
  } else {
    app.memesPerPage = 4;
  }
}

// declare init function
app.init = () => {
  const { width } = appElement.getBoundingClientRect();

  updateMemesPerPage(width);
};

// call the init()
app.init();
