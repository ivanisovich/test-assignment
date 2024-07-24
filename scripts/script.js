document.addEventListener("DOMContentLoaded", () => {
  var swiper = new Swiper(".swiper-container", {
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      400: {
        slidesPerView: 1,
        spaceBetween: 8,
      },
      668: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      990: {
        slidesPerView: 3,
        spaceBetween: 22,
      },
      1250: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
    },
  });

  const popup = document.querySelector(".popup");
  const bookmarksCountElement = document.querySelector(".bookmarks-count");
  let bookmarksCount = 0;

  document.addEventListener("click", (e) => {
    if (e.target.closest(".menu__burger-btn")) {
      popup.classList.add("visible");
    }

    if (e.target.closest(".close-btn")) {
      popup.classList.remove("visible");
    }
  });

  const addBookmarkListeners = (bookmark) => {
    bookmark.addEventListener("load", () => {
      const svgDoc = bookmark.contentDocument;
      if (svgDoc) {
        const svgElement = svgDoc.documentElement;
        svgElement.addEventListener("click", function (event) {
          event.preventDefault();
          const bookmarkBtn = bookmark.closest(".bookmark-btn");
          if (bookmarkBtn) {
            const isBookmarked = svgElement.classList.toggle("bookmarked");
            bookmarksCount += isBookmarked ? 1 : -1;
            bookmarksCountElement.classList.add("visible");
            bookmarksCountElement.innerHTML = bookmarksCount;
            if (bookmarksCount === 0) {
              bookmarksCountElement.classList.remove("visible");
            }
          }
        });
      }
    });
  };

  document.querySelectorAll(".bookmark").forEach((bookmark) => {
    if (
      bookmark.contentDocument &&
      bookmark.contentDocument.readyState === "complete"
    ) {
      addBookmarkListeners(bookmark);
    } else {
      bookmark.addEventListener("load", () => addBookmarkListeners(bookmark));
    }
  });
});
