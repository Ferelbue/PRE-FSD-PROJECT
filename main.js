//Initial var
let shoppingCartArray = [];
let total = 0;
let productContainer = document.querySelector('.shop-items');
let totalElement = document.querySelector('.cart-total-title');

//Server products request
let res = await fetch('https://fakestoreapi.com/products')
let data = await res.json()

//Four products limit
let productsArray = data.slice(9 ,13)

//Print products 
productsArray.forEach(product => {
    productContainer.innerHTML += `
    <div class="shop-item" id="${product.id}">
        <span class="shop-item-title">${product.title}</span>
        <img class="shop-item-image" src="${product.image}" draggable="true">
        <div class="shop-item-details">
        <span class="shop-item-price">${product.price}€</span>
        <button class="btn btn-primary shop-item-button" type="button">ADD TO CART</button>
        </div>
    </div>`
});

//Listen to click on button add to chart
let addBtns = document.querySelectorAll('.shop-item-button');
addBtns = [...addBtns];

//Add products on chart
let cartContainer = document.querySelector('.cart-items');
addBtns.forEach(btn=>{
    btn.addEventListener('click', event => {
        //Search product id
        let actualID = parseInt((event.target.parentNode.parentNode.id));
        //Find product by id
        let actualProduct= productsArray.find(item => item.id == actualID)
        if(actualProduct.quantity == undefined){
        actualProduct.quantity = 1;
        }
        //product already on cart?
        let existe = false
        shoppingCartArray.forEach(product => {
        
            if(actualID == product.id){
            existe = true
           }
        })

        if(existe){
            actualProduct.quantity++
        }
        else{
            shoppingCartArray.push(actualProduct) 
        }
        //Add products on chart
        drawItems()
        //Actual price
        getTotal()
        //Update number of items
        updateNumberOfItems()
        //Remove Items
        removeItems()
    });
});

function getTotal(){
    let sumTotal
    let total = shoppingCartArray.reduce((sum, item)=>{
        sumTotal = sum + item.quantity*item.price
        return sumTotal
    } , 0);
    totalElement.innerText = `${total}€`
}

function drawItems(){
    cartContainer.innerHTML = '';
        shoppingCartArray.forEach(item => {
        cartContainer.innerHTML +=`
        <div class="cart-row">
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${item.image}" width="100" height="100">
                <span class="cart-item-title">${item.title}</span>
            </div>
            <span class="cart-price cart-column">${item.price}€</span>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" min="1" type="number" value="${item.quantity}">
                <button class="btn-danger" type="button">REMOVE</button>
            </div>
        </div>`
        });

        // //Drag and Drop 
        // const imagen = productElement.querySelector('.shop-item-image');
        // imagen.addEventListener('dragstart', e => {
        // console.log('Drag Start');
        // })

        //Remove Items
        removeItems()
}
function updateNumberOfItems(){
    let inputNumber = document.querySelectorAll('.cart-quantity-input');
    inputNumber = [...inputNumber]
    inputNumber.forEach(item => {
        item.addEventListener('click', (event)=>{
            //Get product name
            let actualProductTitle = event.target.parentElement.parentElement.childNodes[1].innerText;
            //Get product quantity
            let actualProductQuantity = parseInt(event.target.value);
            //Search product with this name
            let actualProductObject = shoppingCartArray.find(item => item.title == actualProductTitle);
            //Refresh quantity
            actualProductObject.quantity = actualProductQuantity;
            //Refresh price
            getTotal()
        });
   })
}

function removeItems(){
    let removeBtn = document.querySelectorAll('.btn-danger');
    removeBtn = [...removeBtn];
    removeBtn.forEach(btn => {
        btn.addEventListener('click', event=> {
            //Get product name
            let actualProductTitle = event.target.parentElement.parentElement.childNodes[1].innerText;      
            //Search product with this name
            let actualProductObject = shoppingCartArray.find(item => item.title == actualProductTitle);
            //Return quantity to 1 after remove item
            if (actualProductObject === undefined || actualProductObject.quantity === undefined) {
                actualProductObject = { quantity: 1 };
            } else {
                 actualProductObject.quantity = 1;
            }
            //Remove cart product
            shoppingCartArray = shoppingCartArray.filter(item => item != actualProductObject);
            //Refresh products on chart
            drawItems()
            //Actual price
            getTotal()
            //Update number of items
            updateNumberOfItems()
        })
    })
}


//DragandDrop
let imgMove = document.querySelectorAll('.shop-item');
imgMove = [...imgMove];
imgMove.forEach(move=>{
    move.addEventListener('dragstart', event => {
        let newID = event.target.parentNode.id;
        console.log('Dragstart');
        event.dataTransfer.setData('IDinf', newID); 
    });
    move.addEventListener('dragend', event => {
    //console.log('Dragend');
    });
    move.addEventListener('drag', event => {
    //console.log('Drag');
    });
});
const cartImage = document.querySelector('.shopping-cart');
cartImage.addEventListener('dragenter', event => {
    //console.log('Drag Enter');  
});
cartImage.addEventListener('dragleave', event => {
    //console.log('Drag Leave');  
});
cartImage.addEventListener('dragover', event => {
    event.preventDefault();
    //console.log('Drag Over');
});
cartImage.addEventListener('drop', event => {
    const data = event.dataTransfer.getData('IDinf');
    const newID = parseInt(data);
    console.log(newID);
});


