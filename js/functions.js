$(document).ready(function () {
  var category_Selected = document.querySelector('.categorySelected');
  let paginationNumbers = document.getElementById("pagination-numbers");
  let listItems = document.querySelectorAll('#list-Item');
  let nextButton = document.getElementById("next-button");
  let prevButton = document.getElementById("prev-button");
  let Pagination_Limit = document.querySelector('.sortedPagination')
  let result_data = [];
  const paginationLimit = 9;
  let currentPage;
  let pages = [];
  let countpage;
  let search_input = document.getElementById('search-box');
  let btn_search = document.querySelector(".btn-search");
  let searchArray = [];
  let search_countpage;
  let searchArraysorted = [];
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };
  $("#searchcheck").hide();
  // function fetch api
  async function fetchApiNews(category_name, requestOptions) {
    //show spinner
    $.LoadingOverlay('show');
    $('.pagination-container').hide();
    $('.pagination-number').remove();
    const response = await fetch("https://inshorts.deta.dev/news?category=" + category_name, requestOptions);
    const result = await response.json();
    result_data = result.data;
  }
  // function get Api Data With Pagination
  async function getApiDataWithPagination() {
    // call function fetch api
    await fetchApiNews('all', requestOptions);

    $('.pagination-container').show();
    countpage = Math.ceil(result_data.length / paginationLimit);

    let handlePageButtonsStatus = () => {
      if (currentPage === 1) {
        disableButton(prevButton);
      } else {
        enableButton(prevButton);
      }
      if (countpage === currentPage) {
        disableButton(nextButton);
      } else {
        enableButton(nextButton);
      }
    };
    // function handle Active on PageNumber
    let handleActivePageNumber = () => {
      document.querySelectorAll(".pagination-number").forEach((button) => {
        button.classList.remove("active");
        const pageIndex = Number(button.getAttribute("page-index"));
        if (pageIndex == currentPage) {
          button.classList.add("active");
        }
      });
    };
    // function setCurrent Page
    let setCurrentPage = (pageNum) => {
      currentPage = pageNum;
      handleActivePageNumber();
      handlePageButtonsStatus();
      const prevRange = (pageNum - 1) * paginationLimit;
      const nexRange = (pageNum + 1) * paginationLimit;
      const currRange = pageNum * paginationLimit;
      listItems.forEach((item, index) => {
        item.classList.add("hidden");
        if (index >= prevRange && index <= nexRange) {
          item.classList.remove("hidden");
        }
      });
    };
    //function display Cards pageButton
    let displayCardspageButton = (index) => {
    
      for (let item of pages[index]) {
        $('.add-card-news').append(`
              <div class="col-sm-12 col-md-6 col-lg-4 remove-all-cards-news">   
              <a class="card-link-details" href=${item.readMoreUrl}>
             <div class="card my-3 ">
              <img class="img-card" src=${item.imageUrl} alt="Card image cap">
               <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <div class="card-date">${item.date}</div>
                <p class="card-text">${item.content}</p>
              </div>
            </div> 
            </a> 
          </div>`)
        $.LoadingOverlay('hide');
      }
    };
    //function index page
    let indexPage = (pageIndex) => {
      $('.remove-all-cards-news').remove();
      $.LoadingOverlay('show');
      // call function setCurrent Page
      setCurrentPage(pageIndex);
      displayCardspageButton(currentPage - 1);
    };
    // function iterat on button in pagination
    let iterateButtonsAndIndexPage = () => {
      debugger
      let pageNumber = document.createElement("button");
      pageNumber.className = "pagination-number";
      document.querySelectorAll(".pagination-number").forEach((button) => {
        let pageIndex = Number(button.getAttribute("page-index"));
        if (pageIndex) {
          button.addEventListener("click", () => {
            indexPage(pageIndex)
          });
        }
      });
    };
    //function prevpage
    let previousPage = () => {
      debugger
      $('.remove-all-cards-news').remove();
      setCurrentPage(currentPage - 1);
      displayCardspageButton(currentPage - 1);

    };
    // function nextPage
    let nextPage = () => {
      debugger
      $('.remove-all-cards-news').remove();
      setCurrentPage(currentPage + 1);
      displayCardspageButton(currentPage - 1);
    };
    let appendPageNumber = (index) => {
      let pageNumber = document.createElement("button");
      pageNumber.className = "pagination-number";
      pageNumber.innerHTML = index;
      pageNumber.setAttribute("page-index", index);
      pageNumber.setAttribute("aria-label", "Page " + index);
      paginationNumbers.append(pageNumber);
    };
    // function countpageindex
    let displayindexPagepage = (pagecount) => {

      for (let i = 1; i <= pagecount; i++) {
        appendPageNumber(i);
      }
    };
    // function sort array pages[]
    let dataSortedApiInArray = (data, paginationlimit) => {

      for (let i = 0; i < data.length; i += paginationlimit) {
        pages.push(data.slice(i, i + paginationlimit));

      }


    };
    let disableButton = (button) => {
      button.classList.add("disabled");
      button.setAttribute("disabled", true);
    };
    let enableButton = (button) => {
      button.classList.remove("disabled");
      button.removeAttribute("disabled");
    };
   function displayPagination() {
    // previous Button in pagination
    prevButton.addEventListener("click", previousPage);
    // number page Button in pagination
    iterateButtonsAndIndexPage();
    // next Button in pagination
    nextButton.addEventListener("click", nextPage);

  }
    //call function to display index in pagination
    displayindexPagepage(countpage);
    // call function sort array pages[]
    dataSortedApiInArray(result_data, paginationLimit);
    // call function display Cards pageButton (first 9items)
    displayCardspageButton(0);
    //call function display  Pagination
    displayPagination();

    // lets search filters it
    var search_News = function () {
      let keyword_search = search_input.value;
      if (keyword_search == "") {
        $("#searchcheck").show();
      }
      else {
        $("#searchcheck").hide();
        $('.remove-all-cards-news').remove();
        $('.pagination-number').remove();
        searchArray = [];
        for (let i = 0; i < pages.length; i++) {
          for (let item of pages[i]) {
            if (item.title.includes(keyword_search) || item.content.includes(keyword_search)) {
              searchArray.push(item);
            }
          }
        }
        search_countpage = Math.ceil(searchArray.length / paginationLimit);
        displayindexPagepage(search_countpage);
        pages = [];
        dataSortedApiInArray(searchArray, paginationLimit);
        displayCardspageButton(0);   
        //call function display  Pagination
        displayPagination();
      }
    }
    btn_search.addEventListener('click', search_News);
    // change category addEventListener
    category_Selected.addEventListener('change', async () => {

      $('.remove-all-cards-news').remove();
      $('.pagination-number').remove();

      // call function fetch api
      await fetchApiNews(category_Selected.value, requestOptions);
      // for empty array stor
      pages = []
      countpage = Math.ceil(result_data.length / paginationLimit);
      $('.pagination-container').show();
      displayindexPagepage(countpage);
      dataSortedApiInArray(result_data, paginationLimit);
      displayCardspageButton(0);
      displayPagination();

    });
    // sorted pagination
    Pagination_Limit.addEventListener('change', async () => {

      $('.remove-all-cards-news').remove();
      $('.pagination-number').remove();

      pages = []
      let pagination_Limit_Selected = parseInt(Pagination_Limit.value);
      countpage = Math.ceil(result_data.length / pagination_Limit_Selected);

      $('.pagination-container').show();
      displayindexPagepage(countpage);
      dataSortedApiInArray(result_data, pagination_Limit_Selected);
      displayCardspageButton(0);
      displayPagination();

    });
  }
  // call function get Api Data With Pagination
  getApiDataWithPagination();

});



