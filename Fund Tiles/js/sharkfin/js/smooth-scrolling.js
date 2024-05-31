const elementToScrollTo = document.querySelector('#disclosures');
const elementToClick = document.querySelector('.disclosure-button');
elementToClick.addEventListener('click', (e) => {
  e.preventDefault();
  smoothScrolling(elementToScrollTo)
})

const smoothScrolling = (element) => {
  var jump = parseInt(element.getBoundingClientRect().top * .2);
  document.body.scrollTop += jump;
  document.documentElement.scrollTop += jump;

  if (!element.lastjump || element.lastjump > Math.abs(jump)) {
    element.lastjump = Math.abs(jump);
    setTimeout(function() { smoothScrolling(element);}, "50");
  } else {
    element.lastjump = null;
  }
}
