

var que_data_array = [{
    que_array: [],
    curr_que_id:'',
    cat_array:[],
    search_cat:'',
    search_text:'',
    
    fil_que_array:[],
    fil_que_count:0,
    que_no:0,
    que_no_index:0,
    que_id:'',
    que_level:'all',
}];
var qq = que_data_array[0];

document.getElementById('backup').addEventListener('click', function() {
  // Get the current date in the format yyyy_mm_dd
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const currentDate = `${year}_${month}_${day}`;

  // Create a Blob containing the JSON data
  const jsonBlob = new Blob([JSON.stringify(que_data_array)], { type: 'application/json' });

  // Create a download link for the Blob
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(jsonBlob);
  downloadLink.download = `data_backup_${currentDate}.json`;

  // Simulate a click on the download link to trigger the download
  downloadLink.click();

  // Clean up by revoking the Blob URL
  URL.revokeObjectURL(downloadLink.href);
});



document.querySelector('.tablinks.practice-que').addEventListener('click', function(){
    document.querySelector('body .main-content > #practice').classList.remove('hide');
    document.querySelector('body .main-content > #add').classList.add('hide');
    document.querySelector('.tablinks.practice-que').classList.add('active');
    document.querySelector('.tablinks.add-que').classList.remove('active');
})

document.querySelector('.tablinks.add-que').addEventListener('click', function(){
    document.querySelector('body .main-content > #practice').classList.add('hide');
    document.querySelector('body .main-content > #add').classList.remove('hide');
    document.querySelector('.tablinks.practice-que').classList.remove('active');
    document.querySelector('.tablinks.add-que').classList.add('active');
})


document.querySelector(' button#answer-button').addEventListener('click', function(){
    document.querySelector('.answer-area').classList.remove('hide');
    document.querySelector('.que-level-message').textContent = '';
    document.querySelector('.categories-area').classList.remove('hide');
});





document.querySelectorAll('#practice .que-level select').forEach(select => {
    select.addEventListener('change', function() {
      const selectedOption = select.options[select.selectedIndex];
      qq.que_level = selectedOption.value;
      filterQuestion();
    });
  });

  document.querySelectorAll('#practice .que-type select').forEach(select => {
    select.addEventListener('change', function() {
      const selectedOption = select.options[select.selectedIndex];
      qq.que_type = selectedOption.value.toLowerCase();
      filterQuestion();
    });
  });



function loadCategories(){
    qq.cat_array = [];
    qq.fil_que_array.forEach( array => {
        let cat =  array.categories;
        let categories = cat.split(',');
        categories.forEach(category => {
            if (!qq.cat_array.includes( category )) {
                qq.cat_array.push( category);
            }
        });
    });
    console.log( 'me: categories cat_array[] = ' + qq.cat_array );
    setAutoCompelete()
}

var div = document.createElement('div');
div.className = 'autocomplete-list';
document.body.append(div);
function setAutoCompelete() {
    const input = document.querySelector('.search-container input');
    const autocompleteList = document.querySelector(' .autocomplete-list');
    autocompleteList.style.position = 'absolute';

    input.addEventListener('input', function() {
        var inputValue = input.value.toLowerCase();

        const matchingNames = qq.cat_array.filter(name => name.toLowerCase().includes(inputValue));

        
        autocompleteList.innerHTML = '';
        if (matchingNames.length === 0) {
            autocompleteList.classList.remove('active');
            return;
        }

        
        matchingNames.forEach(name => {
            const item = document.createElement('div');
            item.textContent = name;

            item.addEventListener('click', function() {
                
            
                input.value = name;
                autocompleteList.classList.remove('active');
                qq.search_cat = name;
                qq.search_text = '';
                filterQuestion();
            });
            autocompleteList.appendChild(item);
        });
        autocompleteList.style.width = document.querySelector('input#search-input').offsetWidth + 'px';
        autocompleteList.style.top = document.querySelector('input#search-input').offsetTop + 36 + 'px';
        autocompleteList.style.left = document.querySelector('input#search-input').offsetLeft + 'px';
        autocompleteList.classList.add('active');
        autocompleteList.classList.remove('hide');

        autocompleteList.style.left = document.querySelector('input#search-input').offsetLeft + 'px';
        
        document.querySelector('.clear-icon').classList.remove('hide');
        document.querySelector('.clear-icon').addEventListener('click', function(){
            document.querySelector('#practice .search-container input').value = '';
            qq.search_cat = '';
            document.querySelector('.clear-icon').classList.add('hide');
            filterQuestion();
        })

        autocompleteList.classList.remove('hide');
    });

    // Close the autocomplete list when clicking outside the input field
    document.addEventListener('click', function(event) {
        if (!input.contains(event.target)) {
            autocompleteList.classList.remove('active');
            autocompleteList.classList.add('hide');
        }
    });
}

document.querySelectorAll('.question-level button').forEach( btn => {
    btn.addEventListener('click', function(event){
        qq.fil_que_array[ qq.que_no ].level = btn.value;
        document.querySelector('.que-level-message').textContent = 'Question is added as ' + btn.value;
        debugger;
        var xx = '#practice #'+ btn.value +'-button';
        xx = document.querySelector(xx);
        xx = getComputedStyle(xx);
        xx = xx.backgroundColor;
        document.querySelector('.que-level-message').style.color = xx;

    });
});

document.querySelector('#next-button').addEventListener('click', function(){
        ++qq.que_no;
        if( qq.que_no  < qq.fil_que_array.length){
            showQuestion();
        } else {
            --qq.que_no;
        }
});

document.querySelector('#prev-button').addEventListener('click', function(){
    --qq.que_no;
    if( qq.que_no  >= 0){
        showQuestion();
    } else {
        qq.que_no = 0;
    }
});

function filterQuestion(){
    qq.que_level = document.querySelector('#practice .que-level select').value.toLowerCase().trim();
    qq.search_cat = document.querySelector('#practice .search-container input').value.trim();
    qq.fil_que_array = [];
    qq.que_array.forEach(item => {
        if( (qq.que_level == 'all' || qq.que_level == item.level ) && item.categories.includes( qq.search_cat ) ){
            qq.fil_que_array.push(item);
        }    
    });
    if( qq.fil_que_array.length > 0){
        qq.que_no = 0;
        loadCategories();
        showQuestion();
    } else {
        document.querySelector('.que-area .message').textContent = 'No Question Found';
        document.querySelector('.question p').textContent = '';
        document.querySelector('.bottom').classList.add('hide');
    }
    
}

function noQuestion(){
        document.querySelector('.que-area .message').textContent = 'No Question Found';
        document.querySelector('.question p').textContent = '';
        document.querySelector('.bottom').classList.add('hide');
}
function showQuestion(){
    document.querySelector('.bottom').classList.remove('hide'); 
    document.querySelector('.answer-area').classList.add('hide');
    document.querySelector('.categories-area').classList.add('hide');
   
    loadQuestionCategories();
    document.querySelector('.que-area .message').textContent = (qq.que_no + 1) +'/'+ qq.fil_que_array.length;
    document.querySelector('.question p').textContent = qq.fil_que_array[qq.que_no].question;
    document.querySelector('#answer-text').textContent = qq.fil_que_array[qq.que_no].explanation;
}

function loadQuestionCategories(){
    var div = document.querySelector('.categories');
    div.innerHTML = '';
    var cat = qq.fil_que_array[ qq.que_no ].categories;
    var categories = cat.split(',');
    categories.forEach( cat => {
        cat = cat.toLowerCase().trim();
        var span = document.createElement('span');
        span.className = 'category';
        span.textContent = cat;
        div.append(span);

        if( qq.search_cat == cat  ){
            span.classList.add('search-cat');
        } else {
            span.addEventListener('click', function(){
                qq.search_cat = cat;
                document.querySelector('#practice .search-container input').value = cat;
                filterQuestion();
            });
        }
        
        
        
    });
}


const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", function () {
    if (this.value.trim() !== "") {
        this.classList.add("active");
    } else {
        this.classList.remove("active");
    }
});
searchInput.addEventListener("click", function (e) {
    if (this.classList.contains("active")) {
        if (e.target.matches("#search-input.active::after")) {
            this.value = ""; // Clear the input
            this.classList.remove("active");
        }
    }
});




document.querySelector('#add button.add-que').addEventListener('click', addQuestion);

function addQuestion(){
    qq.que_array.push({
        id: generateID(),
        type: 'normal',
        question: document.querySelector("textarea#question").value.trim(),
        explanation: document.querySelector("textarea#explanation").value.trim(),
        categories: document.querySelector("#add .categories input").value.toLowerCase().trim() + ', ' + getTodayDateUid(),
        level: 'hard',
        wronged: false,
        date: getTodayDateUid(),
        filter: true
    });
    document.querySelector('.que-add-message').textContent = 'Question has been added';
    document.querySelector('.que-add-message').classList.remove('hide');
    setTimeout(() => { 
        document.querySelector('.que-add-message').classList.add('hide');
    }, 4000);

    console.log('me: question has been added.\n Here is the question array' + qq.que_array);
    saveData('my_que_array', que_data_array );
}



function generateID() {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
    const idLength = 9;
    let id = '';

    for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters[randomIndex];
    }

    return id;
}
function getTodayDateUid() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
}

function saveData(key, data) {
    try {
        const jsonData = JSON.stringify(data);
        localStorage.setItem(key, jsonData);
        console.log(`Data saved with key: ${key}`);
    } catch (error) {
        console.error('Error saving data to localStorage:', error);
    }
}




function getData(key) {
    try {
        const jsonData = localStorage.getItem(key);
        if (jsonData === null) {
            console.log(`No data found for key: ${key}`);
            return null;
        }
        que_data_array = JSON.parse(jsonData);
        qq = que_data_array[0];
        return data;
    } catch (error) {
        console.error('Error retrieving data from localStorage:');
        return null;
    }
}

getData('my_que_array');
loadCategories();
filterQuestion();

