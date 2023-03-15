// Смена в пагинации при прокрутке
const scrollHeight = window.scrollTop;
const pageHeight = document.documentElement.scrollHeight;

$(window).scroll(function () {
  function checkHeight() {
    var windowHeight = $(window).scrollTop(),
      elem = $(".pagination__item");
    if (windowHeight < 200) {
      $(elem[1]).removeClass("pagination__item--current");
      $(elem[0]).addClass("pagination__item--current");
    }
    if (windowHeight > 768) {
      $(elem[0]).removeClass("pagination__item--current");
      $(elem[2]).removeClass("pagination__item--current");
      $(elem[1]).addClass("pagination__item--current");
    }
    if (windowHeight > 1100) {
      $(elem[1]).removeClass("pagination__item--current");
      $(elem[2]).addClass("pagination__item--current");
    }
  }

  checkHeight();

  $(window).resize(function () {
    checkHeight();
  });
});

// Исходный код для слайдера взят с сайта https://habr.com/ru/post/501258/#fixedFull
let slider = document.querySelector(".slider"),
  sliderList = slider.querySelector(".slider-list"),
  sliderTrack = slider.querySelector(".slider-track"),
  slides = slider.querySelectorAll(".slider-track__item"),
  arrows = slider.querySelector(".slider-arrows"),
  prev = arrows.children[0],
  next = arrows.children[1],
  slideWidth = slides[0].offsetWidth,
  slideIndex = 0,
  posInit = 0,
  posX1 = 0,
  posX2 = 0,
  posY1 = 0,
  posY2 = 0,
  posFinal = 0,
  isSwipe = false,
  isScroll = false,
  allowSwipe = true,
  transition = true,
  nextTrf = 0,
  prevTrf = 0,
  lastTrf = --slides.length * slideWidth,
  posThreshold = slides[0].offsetWidth * 0.35,
  trfRegExp = /([-0-9.]+(?=px))/,
  getEvent = function () {
    return event.type.search("touch") !== -1 ? event.touches[0] : event;
  },
  slide = function () {
    if (transition) {
      sliderTrack.style.transition = "transform .5s";
    }
    sliderTrack.style.transform = `translate3d(-${
      slideIndex * slideWidth
    }px, 0px, 0px)`;

    prev.classList.toggle("disabled", slideIndex === 0);
    next.classList.toggle("disabled", slideIndex === --slides.length);
  },
  swipeStart = function () {
    let evt = getEvent();

    if (allowSwipe) {
      transition = true;

      nextTrf = (slideIndex + 1) * -slideWidth;
      prevTrf = (slideIndex - 1) * -slideWidth;

      posInit = posX1 = evt.clientX;
      posY1 = evt.clientY;

      sliderTrack.style.transition = "";

      document.addEventListener("touchmove", swipeAction);
      document.addEventListener("mousemove", swipeAction);
      document.addEventListener("touchend", swipeEnd);
      document.addEventListener("mouseup", swipeEnd);

      sliderList.classList.remove("grab");
      sliderList.classList.add("grabbing");
    }
  },
  swipeAction = function () {
    let evt = getEvent(),
      style = sliderTrack.style.transform,
      transform = +style.match(trfRegExp)[0];

    posX2 = posX1 - evt.clientX;
    posX1 = evt.clientX;

    posY2 = posY1 - evt.clientY;
    posY1 = evt.clientY;

    // определение действия свайп или скролл
    if (!isSwipe && !isScroll) {
      let posY = Math.abs(posY2);
      if (posY > 7 || posX2 === 0) {
        isScroll = true;
        allowSwipe = false;
      } else if (posY < 7) {
        isSwipe = true;
      }
    }

    if (isSwipe) {
      // запрет ухода влево на первом слайде
      if (slideIndex === 0) {
        if (posInit < posX1) {
          setTransform(transform, 0);
          return;
        } else {
          allowSwipe = true;
        }
      }

      // запрет ухода вправо на последнем слайде
      if (slideIndex === --slides.length) {
        if (posInit > posX1) {
          setTransform(transform, lastTrf);
          return;
        } else {
          allowSwipe = true;
        }
      }

      // запрет протаскивания дальше одного слайда
      if (
        (posInit > posX1 && transform < nextTrf) ||
        (posInit < posX1 && transform > prevTrf)
      ) {
        reachEdge();
        return;
      }

      // двигаем слайд
      sliderTrack.style.transform = `translate3d(${
        transform - posX2
      }px, 0px, 0px)`;
    }
  },
  swipeEnd = function () {
    posFinal = posInit - posX1;

    isScroll = false;
    isSwipe = false;

    document.removeEventListener("touchmove", swipeAction);
    document.removeEventListener("mousemove", swipeAction);
    document.removeEventListener("touchend", swipeEnd);
    document.removeEventListener("mouseup", swipeEnd);

    sliderList.classList.add("grab");
    sliderList.classList.remove("grabbing");

    if (allowSwipe) {
      if (Math.abs(posFinal) > posThreshold) {
        if (posInit < posX1) {
          slideIndex--;
        } else if (posInit > posX1) {
          slideIndex++;
        }
      }

      if (posInit !== posX1) {
        allowSwipe = false;
        slide();
      } else {
        allowSwipe = true;
      }
    } else {
      allowSwipe = true;
    }
  },
  setTransform = function (transform, comapreTransform) {
    if (transform >= comapreTransform) {
      if (transform > comapreTransform) {
        sliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
      }
    }
    allowSwipe = false;
  },
  reachEdge = function () {
    transition = false;
    swipeEnd();
    allowSwipe = true;
  };

sliderTrack.style.transform = "translate3d(0px, 0px, 0px)";
sliderList.classList.add("grab");

sliderTrack.addEventListener("transitionend", () => (allowSwipe = true));
slider.addEventListener("touchstart", swipeStart);
slider.addEventListener("mousedown", swipeStart);

arrows.addEventListener("click", function () {
  let target = event.target;

  if (target.classList.contains("slider-arrows--next")) {
    slideIndex++;
  } else if (target.classList.contains("slider-arrows--prev")) {
    slideIndex--;
  } else {
    return;
  }

  slide();
});
