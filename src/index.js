const axios = require('axios').default;
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const searchBtn = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-form__input');
const loadMore = document.querySelector('.load-more');

loadMore.style.display = 'none';

let pageId = 1;

let apiDetails = {
  key: '33395235-316870acdb7f794f3e9104cab',
  image_type: 'image',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
};

var lightbox = new SimpleLightbox('.gallery a');
const displayImgEl = img => {
  gallery.insertAdjacentHTML(
    'beforeend',
    `<div class="photo-card">
      <a href="${img.largeImageURL}">
        <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
      </a>
    <div class="info">
      <p class="info-item">
        <span>Likes</span>
        ${img.likes}
      </p>
      <p class="info-item">
        <span>Views</span>
        ${img.views}
      </p>
      <p class="info-item">
        <span>Comments</span>
        ${img.comments}
      </p>
      <p class="info-item">
        <span>Downloads</span>
        ${img.downloads}
      </p>
    </div>
  </div>`
  );
};

const getImage = async (value, page) => {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${apiDetails.key}&q=${value}&image_type=${apiDetails.image_type}&orientation=${apiDetails.orientation}&safesearch=${apiDetails.safesearch}&per_page=${apiDetails.per_page}&page=${page}`
    );

    const data = response.data.hits;

    data.forEach(img => {
      displayImgEl(img);
    });

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 0.5,
      behavior: 'smooth',
    });
    if (pageId === 1) {
      console.log(response.data.hits.length);
      loadMore.style.display = 'flex';
      lightbox.refresh();
      Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
    } else if (response.data.hits.length == 0) {
      loadMore.style.display = 'none';
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      console.log(response.data.hits.length);
      lightbox.refresh();
    }
  } catch (error) {
    loadMore.style.display = 'none';
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
};

searchBtn.addEventListener('submit', event => {
  event.preventDefault();
  gallery.innerHTML = '';
  if (searchInput.value == '') {
    return;
  } else {
    pageId = 1;
    getImage(searchInput.value.trim(), pageId);
  }
});

loadMore.addEventListener('click', () => {
  pageId++;
  getImage(searchInput.value.trim(), pageId);
});
