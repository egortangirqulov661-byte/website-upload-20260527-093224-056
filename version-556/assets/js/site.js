(function () {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
  }

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  let currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === currentSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5200);
  }

  const searchForms = document.querySelectorAll('[data-site-search]');

  searchForms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const input = form.querySelector('input[name="q"]');
      const value = input ? input.value.trim() : '';
      const prefix = form.getAttribute('data-search-prefix') || '';

      if (value) {
        window.location.href = prefix + 'search.html?q=' + encodeURIComponent(value);
      }
    });
  });

  const resultBox = document.querySelector('[data-search-results]');
  const countBox = document.querySelector('[data-search-count]');
  const searchInput = document.querySelector('[data-search-input]');

  function renderSearchResults(keyword) {
    if (!resultBox || !window.MOVIE_SEARCH_DATA) {
      return;
    }

    const normalized = keyword.trim().toLowerCase();
    const data = window.MOVIE_SEARCH_DATA;
    const matches = normalized
      ? data.filter(function (item) {
          return [item.title, item.region, item.type, item.year, item.genre, item.tags]
            .join(' ')
            .toLowerCase()
            .includes(normalized);
        }).slice(0, 120)
      : data.slice(0, 60);

    if (countBox) {
      countBox.textContent = '找到 ' + matches.length + ' 条结果';
    }

    resultBox.innerHTML = matches.map(function (item) {
      return [
        '<a class="search-result" href="' + item.link + '">',
        '  <img src="' + item.cover + '" alt="' + item.title + '">',
        '  <span>',
        '    <strong>' + item.title + '</strong><br>',
        '    <small>' + item.year + ' · ' + item.region + ' · ' + item.type + '</small><br>',
        '    <small>' + item.genre + '</small>',
        '  </span>',
        '</a>'
      ].join('');
    }).join('');
  }

  if (resultBox) {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';

    if (searchInput) {
      searchInput.value = q;
      searchInput.addEventListener('input', function () {
        renderSearchResults(searchInput.value);
      });
    }

    renderSearchResults(q);
  }
})();
