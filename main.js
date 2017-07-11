 let post ;
 let c ;
  window.onload = ()  => {
     
    const headers = new Headers();
    headers.append("Content-type", "application/json");
    
    const request = new Request("https://api.myjson.com/bins/152f9j", {
     method: "Get",
     headers
    });
   
    fetch(request)
        .then( response => {
            response.json().then( data =>{
                post = data.data; 
                sort_posts(post);
                filter_post();
                add_seach();
                lazy_load_event();
                
                          
            });
        })
        .catch( err => {
            console.log(err)
        })
       
      show_tags_list(); 
      submit();
      
      
      
} ;





function sort_posts(value) {
                value.sort(function (a, b) {
                    if (a.createdAt < b.createdAt) {
                        return 1;
                    }
                    if (a.createdAt > b.createdAt) {
                        return -1;
                    }
                    // a должно быть равным b
                return 0;
            });
}



let current= 0;
function show_post(value) {
    
    let div = document.getElementById("container");
    let post_container = document.createElement('div');
    
    
    

     for( let i = 0; i < value.length; i++){
        let post_div = document.createElement('div');
        let h3 = document.createElement("h3");
        let img = document.createElement("img");
        let span = document.createElement("span");
        let p = document.createElement("p");
        let ul = document.createElement("ul");
        let button = document.createElement("button");
        
        if( i > 9){
            post_div.classList.add("hidden");
        }
            
            for (let tag of value[i].tags) {
                let li = document.createElement("li");
                li.innerHTML = tag;
                ul.appendChild(li);
            }
            
        button.innerHTML = "Удалить";
        h3.innerHTML = value[i].title;
        img.src = value[i].image;
        p.innerHTML = value[i].description;
        
        let date_creat = new Date();
        date_creat.setTime(Date.parse(value[i].createdAt));
        

        span.innerHTML = ` Дата : ${date_creat.toLocaleString("ru")}`;

        post_div.appendChild(h3);
        post_div.appendChild(img);
        post_div.appendChild(p);
        post_div.appendChild(span);
        post_div.appendChild(ul);
        post_div.appendChild(button);
        post_div.classList.add("delete");
        post_container.appendChild(post_div); 
     
     }
    post_container.classList.add("scroll");
    div.appendChild(post_container);  
    
      
}        




function show_tags_list(){
    if(localStorage.getItem("tags")){
        let element = document.getElementById("select_tags");
        element.classList.add("hidden");
        
    }
}  



function save_tags(){
    event.preventDefault();
    let storage_list = []
    let list = document.querySelectorAll(".tags_select input");
    for( let tag of list ) {
        if( tag.checked ) {
            storage_list.push(tag.value)
        }
    }
    
    if(storage_list.length > 0) {
        localStorage.tags = JSON.stringify(storage_list);
    }
    show_tags_list();
}



function submit() {
    let elem = document.getElementById("form_tag");
    elem.addEventListener("submit", save_tags);

};


function sort_by_tags() {
        let arr_default = [];
        let arr_tags = [];
        tags_list =  JSON.parse(localStorage.tags);

       post.forEach(function(element) {
           if(element.tags.includes(...tags_list)) {
              arr_tags.push(element) 
           } else {
            arr_default.push(element);
           }
            
        });

         sort_posts(arr_default);
         sort_posts(arr_tags);
        let post_tags_priority = [...arr_tags,...arr_default];
        return post_tags_priority;
        
}


function filter_post(){
  
    if(localStorage.getItem("tags")) {
        show_post(sort_by_tags());
    } else {
        
        show_post(post)
    }
}


/*
function seach(event) {
     let div = document.getElementById("container");
     let input_value = document.getElementById("search").value;
        if(input_value.length === 0 ){
            div.innerHTML = "";
             filter_post();
        } 
      
         
        function seach_filter(item) {
            let str_tags = item.title.toLowerCase();
            let str_input = input_value.toLowerCase();

            return str_tags.includes(str_input);
        }
        let c = sort_by_tags().filter(seach_filter);
        let s = post.filter(seach_filter);
        
            
        if(localStorage.getItem("tags")){
            div.innerHTML = "";
             show_post(c);
             console.log(c);
             
        } else {
            div.innerHTML = "";
             show_post(s);
             console.log(s);
        }
    
}
*/





function add_seach(event) {
    
    let elem = document.getElementById("search");   
    elem.addEventListener("input", seach);

};



 function seach_filter(item) {
            let str_tags = item.title.toLowerCase();
            let input_value = document.getElementById("search").value;
            let str_input = input_value.toLowerCase();
            return str_tags.includes(str_input) ;   

        }




function seach(event) {
     let div = document.getElementById("container");
     let input_value = document.getElementById("search").value;
        
      
         
       
        let c = sort_by_tags().filter(seach_filter);
        console.log(c);
        let s = post.filter(seach_filter);
        console.log(s);
            
        if(localStorage.getItem("tags")){
            div.innerHTML = "";
            c.length > 0 ? show_post(c): div.innerHTML = "Ничего не найдено"
            // show_post(c);
        } else {
            div.innerHTML = "";
             show_post(s);
        }
    }


function lazy_load(){
    
     
      let elem = document.querySelectorAll("#container .hidden");
          console.log(elem);
           
        if (window.pageYOffset >= document.body.scrollHeight -  window.innerHeight){
             console.log(window.pageYOffset) ;
           console.log(document.documentElement.scrollHeight) ;
            for( let i = 0; i < 10; i++){
                console.log(elem[i].classList.toggle("hidden"));
            }          
   

        }
 
    }




function lazy_load_event() {
    
    
    window.addEventListener("scroll", lazy_load);
        

}    

function delete_post(event){
    event.preventDefault();
    let elem = document.querySelector(".delete button");
    elem.parentElement.remove();
    refresh_post();

}

function delete_post_event(){
    window.addEventListener("click", delete_post);
}
  
delete_post_event();    



function refresh_post(){
    let elem_hidden = document.querySelectorAll("#container .hidden");
    let elem_show = document.querySelectorAll("#container .delete");
    
    if(elem_show.length - elem_hidden.length < 10 ) {
        for( let i = elem_show.length - elem_hidden.length; i < 10; i++){
                elem_hidden[i].classList.toggle("hidden");
        }  
    }

}

