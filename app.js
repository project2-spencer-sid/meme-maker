import data from './data.js';

// create a namespace
const app = {
  memeIndex: 0,
};

// console.log(data);
// display meme images
app.displayMemes = (memes) => {
  for (let i = app.memeIndex; i < app.memeIndex + 9; i++) {
    const ul = document.querySelector('.gallery');

    const li = document.createElement('li');
    li.className = 'galleryItem';

    const src = memes[i].url;
    const alt = memes[i].name;
    li.innerHTML = `<img class="imgBox" src="${src}" alt="${alt}" />`;
    ul.append(li);
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
      console.log(info.data.memes[5].url);
      app.displayMemes(info.data.memes);

      // add event listener to "load more" button
      const loadMoreButton = document.querySelector('.loadButton');
      loadMoreButton.addEventListener('click', function () {
        app.loadMore();
        app.displayMemes(info.data.memes);
      });
    });
};

app.getMemeData();

// transform the data

// filter 9 memes
app.loadMore = () => {
  app.memeIndex += 9;
};

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
