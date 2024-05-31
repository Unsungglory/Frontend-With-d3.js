
// ****************************************************************************************************************************** //
// Generates the pagination text for each page
// ****************************************************************************************************************************** //

// <!-- footer -->
// <footer class="footer-wrapper">
//     <!-- previous button -->
//     <img id='back-arrow' class='footer-btn' src="./engine/imgs/arrow-left.svg" alt="left-arrow">

//     <!-- pagination -->
//     <span class="footer-pagination-current">1</span> / <span class="footer-pagination-total">17</span>
//     <!-- end pagination -->

//     <!-- next button -->
//     <img id='forward-arrow' class='footer-btn' src="./engine/imgs/arrow-right.svg" alt="right-arrow">
// </footer>
// <!-- end footer -->


const allPages = websiteInfo.map(category => category.pages.map(page => page.link))
const allLinks = []
allPages.forEach(arr => {
    arr.forEach(el => {
        allLinks.push(el);
    })
})

const currentPageNumOverall = currentPageUrl === 'index.html' ? null : getCurrentPageNum();

function getCurrentPageNum() {
    let output;
    allLinks.forEach((link, i) => {
        // console.log('here', link, currentPageUrl, i, link === currentPageUrl)
        if (link === currentPageUrl)
            output = i + 1;
    })
    return output;
}

// GET CURRENT PAGE NUMBER FROM URL
// const currentPageNum = currentPageUrl === 'index.html' ? null : currentPageUrl.match(/([123456789])/)[0];
let currentPageNum = currentPageUrl === 'index.html' ? null : currentPageUrl.split('-')[1].split('.')[0];

if (currentPageNum && currentPageNum.length === 2 && currentPageNum[0] === '0') {
    currentPageNum = currentPageNum[1]
}

// GET PAGE CATEGORY
const pageCategory = currentPageUrl === 'index.html' ? null : currentCategory.category;

// gets pages in current category
const pages =
    currentPageUrl === 'index.html'
        ? null
        : websiteInfo.find(d => d.category.toLowerCase() === pageCategory.toLowerCase()).pages;

// gets number of pages in current category
const numberOfPages = currentPageUrl === 'index.html' ? null : pages.length;

function getNumberOfValidPages() {
    let total = 0;
    allLinks.forEach(link => {
        if (link !== '#') {
            total += 1;
        }
    })
    return total;
}

function generatePagination() {


    let prevArrow;
    let nextArrow;

    // sets 'page X of X' text
    let paginationSpans = `<span id='footer-pagination-current'>${currentPageNumOverall}</span> / <span id="footer-pagination-total">${getNumberOfValidPages()}</span>`;

    // if current page is the last page in category...
    // ...change arrow to 'next section' button or hide arrow if at end of data
    // else sets next link on page to correct-next-link in data array
    if (Number(currentPageNum) === numberOfPages) {
        // find next category
        // sets next link to first link in next category unless we are at the end of the data
        // *****************
        for (let i = 0; i < websiteInfo.length; i++) {
            if (websiteInfo[i].category.toLowerCase() === pageCategory.toLowerCase()) {
                if (websiteInfo[i + 1]) {
                    // HERE WE ARE AT THE LAST PAGE IN A CATEGORY, but NOT data

                    // set next arrow
                    nextArrow = `<img id='forward-arrow' class='footer-btn' src="./engine/imgs/arrow-right.svg" alt="right-arrow" href='${websiteInfo[i + 1].pages[0].link}' onclick='nextBtnClick()'>`

                    // document.querySelector('#p-next').setAttribute('href', websiteInfo[i + 1].pages[0].link);

                    // OLD STUFF
                    // let node = document.createElement('button');
                    // node.setAttribute('onclick', 'nextBtnClick()');
                    // node.id = 'footer-nxt-section-text';
                    // node.innerHTML = 'NEXT SECTION';

                    // document.getElementById('p-arrow-r').appendChild(node);
                } else {
                    // HERE WE ARE AT THE END OF THE DATA
                    nextArrow = ``

                    // document.querySelector('#p-next').setAttribute('href', '#'); // set link
                    // document.querySelector('.p-arrow-r').style.transform = 'scale(0)'; // hide arrow
                }
            }
        }
        // *****************
    } else {

        if (currentPageUrl === 'index.html') {
            paginationSpans = '';
            nextArrow = `<img id='forward-arrow' style='display: none;' href='${websiteInfo[0].pages[0].link}' onclick='nextBtnClick()'>`
        } else {
            // ELSE: NORMAL PAGE NOT AT THE END OF CATEGORY OR END OF DATA
            nextArrow = `<img id='forward-arrow' class='footer-btn' src="./engine/imgs/arrow-right.svg" alt="right-arrow" href='${pages[Number(currentPageNum)].link}' onclick='nextBtnClick()'>`
        }
    }

    // if current page is the first page in category, sets prev-link to 'index.html'
    // OR SETS PREV LINK TO PREV CAT'S LAST PAGE
    // else sets prev link on page to correct-prev-link in data array
    if (Number(currentPageNum) === 1) {
        if (websiteInfo[0].category.toLowerCase() === pageCategory.toLowerCase()) {
            prevArrow = `<img id='back-arrow' class='footer-btn' src="./engine/imgs/arrow-left.svg" alt="left-arrow" href='index.html' onclick='prevBtnClick()'>`;
        } else {
            // BACK TO PREVIOUS CATEGORY
            let prevCatLastLink = '';
            categoriesWithLinks.forEach((d, i) => {
                if (d.category === pageCategory) {
                    prevCatLastLink = websiteInfo[i - 1].pages[websiteInfo[i - 1].pages.length - 1].link;
                }
            });
            prevArrow = `<img id='back-arrow' class='footer-btn' src="./engine/imgs/arrow-left.svg" alt="left-arrow" href='${prevCatLastLink}' onclick='prevBtnClick()'>`;
        }
    } else {
        if (currentPageUrl === 'index.html') {
            prevArrow = ''
        } else {
            prevArrow = `<img id='back-arrow' class='footer-btn' src="./engine/imgs/arrow-left.svg" alt="left-arrow" href='${pages[Number(currentPageNum) - 2].link}' onclick='prevBtnClick()'>`;
        }
    }

    const footerElement = document.createElement('footer');
    footerElement.id = 'footer-wrapper';
    footerElement.innerHTML = prevArrow + paginationSpans + nextArrow;

    document.getElementById('nav-container').appendChild(footerElement);
}

generatePagination();