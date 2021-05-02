import data from './data.js';

// create a namespace
const app = {
  memeIndex: 0,
};

const galleryUl = document.querySelector('.gallery');
const saveModal = document.querySelector('.saveModal');
const submitModal = document.querySelector('.submitModal');
const closeButton = document.querySelector('.closeButton');

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

    li.setAttribute("data-url", src);
    li.setAttribute("data-template_id",memeId);
    li.setAttribute("data-name", alt);

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

// function to display image in modal
const displayModalImage = function(dataset) {
  const source = dataset.url;
  const title = dataset.name;
  // const img = document.createElement('img');
  // img.src = source;
  // img.alt = title;
  const modalImageContainer = document.querySelector('.modalImageContainer');
  console.log(source, title);
  modalImageContainer.innerHTML=`<img src="${source}" alt="${title}">`;

  // modalImageContainer.appendChild(img);
}


// bind event listeners to the elements (meme image elements, captioned image, and buttons)
galleryUl.addEventListener('click', function(event){
  console.log("event listener works");
  console.log(event.target.tagName);
  const liTarget = event.target.parentElement;
  if (liTarget.tagName==='LI'){
    console.log("list item has been clicked");
    console.log(liTarget.dataset);
    submitModal.classList.add('show');
    displayModalImage(liTarget.dataset);
    // modal.style.display = 'block';
  }
})

closeButton.addEventListener('click', function(){
  submitModal.classList.remove('show');
})


// display the form to the user

// get form input values from user and send them to API

// get response (captioned meme) from API

// display the captioned meme returned from API

// display download/email buttons

// implement download/email functionalities

// declare init function
// call the init()
