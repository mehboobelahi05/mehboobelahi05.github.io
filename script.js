

var que_data_array = [{
    que_array: [],
    curr_que_id:'',
    cat_array:[],
    search_cat:'',
    search_text:'',
    
    fil_que_array:[],
    que_no:0,
    que_id:'',
    que_level:'all',
    que_type:'normal', 
}];
var qq = que_data_array[0];



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
    document.querySelector('.categories-area').classList.remove('hide');
});



function loadQuestion(){
    qq.que_type = document.querySelector('#practice .que-type select').value.toLowerCase().trim();
    qq.que_level = document.querySelector('#practice .que-level select').value.toLowerCase().trim();
    qq.search_cat = document.querySelector('#practice .search-container input').value.trim();
    filterQuestion();
}
loadQuestion();

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
    qq.que_array.forEach( array => {
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
    });

    // Close the autocomplete list when clicking outside the input field
    document.addEventListener('click', function(event) {
        if (!input.contains(event.target)) {
            autocompleteList.classList.remove('active');
            autocompleteList.classList.add('hide');
        }
    });
}

function filterQuestion(){
  console.log( 'filter called ' + qq.que_level + ' ' + qq.que_type + ' ' + qq.search_cat  );

}



document.querySelector('#add button.add-que').addEventListener('click', addQuestion);

function addQuestion(){
    var type = document.querySelector("#add .que-type select").value.toLowerCase();
    var answer;
    if ( type == 'mcq' ){
        answer = document.querySelector("#add .options select").value;
    } else {
        answer = '';
    }

    qq.que_array.push({
        id: generateID(),
        type: document.querySelector("#add .que-type select").value.toLowerCase(),
        question: document.querySelector("textarea#question").value.trim(),
        explanation: document.querySelector("textarea#explanation").value.trim(),
        answer: answer,
        categories: document.querySelector("#add .categories input").value.toLowerCase().trim(),
        level: 'hard',
        wronged: false,
        date: getTodayDateUid(),
        filter: true
    });
    console.log(qq.que_array);
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


