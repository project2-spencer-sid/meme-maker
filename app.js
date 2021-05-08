import prewrittenCaptions from './captions.js';

// create a namespace
const app = {
  memeIndex: 0,
  memesPerPage: 8,
  bp: {
    lg: 1075,
    md: 815,
    sm: 556,
  },
  prewrittenCaptions,
  generateCaptions: true,
  selectedMemeName: '',
};

// Caching all selectors and make them global variables
const galleryUl = document.querySelector('.gallery');
const submitModal = document.querySelector('.submitModal');
const modalImageContainer = document.querySelector('.modalImageContainer');
const closeButton = document.querySelector('.closeButton');
const topCaption = document.getElementById('topText');
const bottomCaption = document.getElementById('bottomText');
const loadMoreButton = document.querySelector('.loadButton');
const captionsForm = document.querySelector('.captions');
const submitButton = document.querySelector('.submitButton');
const appElement = document.querySelector('.app');
const mainElement = document.querySelector('main');

// Acquire page width from init function and adjust the number of memes displayed
app.updateMemesPerPage = (width) => {
  if (width > app.bp.lg) {
    app.memesPerPage = 8;
  } else if (width > app.bp.md) {
    app.memesPerPage = 9;
  } else if (width > app.bp.sm) {
    app.memesPerPage = 6;
  } else {
    app.memesPerPage = 4;
  }
};

// display meme images
app.displayMemes = (memes) => {
  if (app.memeIndex > 99) return;

  const startingMemeIndex = app.memeIndex;

  let currentMemeIndex = 0;
  // Go through all memes to display them
  for (let i = currentMemeIndex; i < app.memesPerPage; i++) {
    currentMemeIndex = startingMemeIndex + i;

    // create list items
    const li = document.createElement('li');
    li.className = 'galleryItem';

    // get url and alt for accessibility
    const src = memes[currentMemeIndex].url;
    const alt = memes[currentMemeIndex].name;
    const memeId = memes[currentMemeIndex].id;

    li.setAttribute('data-template_id', memeId);

    // transform the data
    li.innerHTML = `<img class="imgBox" src="${src}" alt="${alt}" />`;
    // append list items to ul
    galleryUl.append(li);

    // break out of loop when we reached the end of memes array
    if (currentMemeIndex >= memes.length - 1) break;
  }
  return currentMemeIndex;
};

app.getErrorHtml = function (invalidUser) {
  const errorHtml = `<div>
    <h2>Failed to access meme database. Please try again later.</h2>
    </div>`;
  return errorHtml;
};

// get data from API (100 memes)
app.getMemeData = () => {
  const url = 'https://api.imgflip.com/get_memes';
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((info) => {
      app.displayMemes(info.data.memes);
      // cache memes data into namespace
      app.memes = info.data.memes;
    })
    .catch((err) => {
      // Handle API errors
      console.log(err);
      const errorHTML = app.getErrorHtml();
      mainElement.innerHTML = errorHTML;
    });
};

app.hideLoadMoreButton = () => {
  loadMoreButton.classList.add('hide');
};

app.incrementMemeIndex = () => {
  app.memeIndex += app.memesPerPage;
};

// function to display image in modal
app.displayModalImage = (source, title) => {
  const modalImageContainer = document.querySelector('.modalImageContainer');
  modalImageContainer.innerHTML = `<img src="${source}" alt="${title}">`;
};

// add input validation - remove disabled attribute from submit button when either of the caption value is not empty
app.buttonModeChecker = () => {
  const firstInputValue = topCaption.value;
  const secondInputValue = bottomCaption.value;
  if (firstInputValue || secondInputValue) {
    submitButton.textContent = 'Add Caption';
    app.generateCaptions = false;
  } else {
    submitButton.textContent = 'Generate Random Captions';
    app.generateCaptions = true;
  }
};

app.getRandomCaption = () => {
  const randomIndex = Math.floor(Math.random() * app.prewrittenCaptions.length);
  return app.prewrittenCaptions[randomIndex];
};

// form clearing function
app.clearInput = () => {
  topCaption.value = '';
  bottomCaption.value = '';
};

app.handleFormSubmit = function (event) {
  event.preventDefault();

  // get prewritten captions
  const randomCaption = app.getRandomCaption();

  // Use prewritten captions or user input based on generateCaptions flag
  const text0 = app.generateCaptions ? randomCaption.text0 : topCaption.value;
  const text1 = app.generateCaptions
    ? randomCaption.text1
    : bottomCaption.value;

  const url = new URL('https://api.imgflip.com/caption_image');
  const data = new URLSearchParams({
    text0,
    text1,
    template_id: app.selectedMemeId,
    username: 'sidlee',
    password: '04f5b6fce72a',
  });

  // get response (captioned meme) from API
  // Sending captions to API to get back captioned meme.
  fetch(url, {
    method: 'POST',
    body: data,
  })
    .then((response) => {
      return response.json();
    })
    .then((jsonResponse) => {
      const captionedUrl = jsonResponse.data.url;
      // display the captioned meme returned from API
      app.displayModalImage(captionedUrl, app.selectedMemeName);
      app.captionedUrl = captionedUrl;
      app.buttonModeChecker();
    })
    .catch((err) => {
      // Handle API errors
      console.log(err);
      const errorHTML = app.getErrorHtml();
      modalImageContainer.innerHTML = errorHTML;
    });

  app.clearInput();
};

app.handleGalleryClick = function (event) {
  const imgElem = event.target;
  if (imgElem.tagName === 'IMG') {
    // display the form to the user
    submitModal.classList.add('show');
    const source = imgElem.src;
    const title = imgElem.alt;
    app.displayModalImage(source, title);
    app.selectedMemeId = imgElem.parentElement.dataset.template_id;
    app.selectedMemeName = title;
  }
};

app.handleLoadMoreClick = function () {
  app.incrementMemeIndex();
  const currentMemeIndex = app.displayMemes(app.memes);
  // Hide loadMore button once the user reached the end of memes array
  if (currentMemeIndex >= app.memes.length - 1) {
    app.hideLoadMoreButton();
  }
};

app.handleCloseButtonClick = function () {
  submitModal.classList.remove('show');
};

// bind event listeners to the elements (meme image elements, captioned image, and buttons)
app.attachEventListener = () => {
  loadMoreButton.addEventListener('click', app.handleLoadMoreClick);
  captionsForm.addEventListener('submit', app.handleFormSubmit);
  closeButton.addEventListener('click', app.handleCloseButtonClick);
  captionsForm.addEventListener('input', app.buttonModeChecker);
  galleryUl.addEventListener('click', app.handleGalleryClick);
};

// declare init function
app.init = () => {
  // get screen width and update memesPerPage property
  const { width } = appElement.getBoundingClientRect();
  app.updateMemesPerPage(width);

  app.getMemeData();
  app.attachEventListener();
};

// call the init()
app.init();
