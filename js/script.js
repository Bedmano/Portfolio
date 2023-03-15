const menu = document.querySelector('.open-menu');
const nav = document.querySelector('.main-nav');

menu.onclick = function () {
  nav.classList.toggle('show');
};

$(function () {
  var topScroll = $('.scroll-top'),
    display;
  var main = $('.main-content');
  var scrollBottom = $('.scroll-bottom'),
    display;
  var portfolio = $('.portfolio');
  var upButton = $('.modal-top'),
    display;

  var headerLinks = $('.list-item');
  var mainLinks = $('.additional-link');

  // код для перехода по якорным ссылкам, если элементы ещё скрыты

  $.each(headerLinks, function () {
    upButton.addClass('show');
    portfolio.addClass('show');
  });

  $.each(mainLinks, function () {
    upButton.addClass('show');
    portfolio.addClass('show');
  });

  //  функция для появления и сокрытия кнопки 'наверх'

  $(window).scroll(function () {
    display = $(this).scrollTop() > 1000;
    if (display) {
      upButton.addClass('show');
    } else {
      upButton.removeClass('show');
    }
  });

  if (screen.width < 1920) {
    $(window).scroll(function () {
      display = $(this).scrollTop() >= 1970;

      if (display) {
        scrollBottom.hide();
        portfolio.addClass('show');
      }
    });
  }

  if (screen.width >= 1920) {
    $(window).scroll(function () {
      display = $(this).scrollTop() > 20;

      if (display) {
        topScroll.hide();
        main.addClass('show');
      }
    });

    $(window).scroll(function () {
      display = $(this).scrollTop() >= 1540;

      if (display) {
        scrollBottom.hide();
        portfolio.addClass('show');
      }
    });
  }

  if (screen.width >= 2560) {
    $(window).scroll(function () {
      display = $(this).scrollTop() > 5;

      if (display) {
        topScroll.hide();
        main.addClass('show');
      }
    });

    $(window).scroll(function () {
      display = $(this).scrollTop() >= 920;

      if (display) {
        scrollBottom.hide();
        portfolio.addClass('show');
      }
    });
  }
  // Открытие контента, если прокрутка не срабатывает
  $(topScroll).click(function () {
    topScroll.hide();
    main.addClass('show');
  });

  $(scrollBottom).click(function () {
    scrollBottom.hide();
    portfolio.addClass('show');
  });
});
