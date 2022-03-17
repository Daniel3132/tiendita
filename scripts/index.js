const url = 'https://tiendapao.herokuapp.com/productos'
const cartasCont = document.getElementById('cardsContainer')
const recomendados = document.getElementById('cardsContainer2')
const infoCont = document.getElementById('productoInfo')
let carrito = {}
const carritoCard = document.getElementById('carritoCard')
const contenedorCartas = document.getElementById('contenedorCartas')


window.addEventListener('DOMContentLoaded',showCards())

async function getProducts(){
    try {
        const resp = await fetch(url)
        const data = await resp.json()
        return data
    } catch (error) {
        console.log(error);
    }
}
infoCont.addEventListener('click',e=>{
    addCarrito(e)
})

const addCarrito = e =>{
    if (e.target.classList.contains('btnAddCarrito')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()

}
const setCarrito = objeto =>{

    const producto ={
        id: objeto.querySelector('.btnAddCarrito').dataset.id,
        imagen: objeto.querySelector('.imgElegido').src,
        nombre: objeto.querySelector('h2').textContent,
        precio: objeto.querySelector('#precio').textContent,
        cantidad: Number(objeto.querySelector('input').value),
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}
    
    pintarCarrito()
    
}

const pintarCarrito = () =>{
    contenedorCartas.innerHTML=""
    Object.values(carrito).forEach(producto=>{
        
        contenedorCartas.innerHTML+=`
        <div class="carritoCard " id="carritoCard">
            <img src="${producto.imagen}" alt="">
            <div class="carritoInfo ">
                <p>${producto.nombre}</p>
                <p>${producto.precio * producto.cantidad}</p>
            </div>
            <div class="selectorU">
                <button type="button" data-id="${producto.id}" class="btn-resta"  >-</button>
                <p id="cantidad">${producto.cantidad}</p>
                <button type="button" data-id="${producto.id}" class="btn-suma"   >+</button>
            </div>
        </div>
        `
    })
    localStorage.setItem('carrito', JSON.stringify(carrito))

    pintarCarritoBot()
}





const pintarCarritoBot = () =>{

    const nCantidad = Object.values(carrito).reduce((acc,{cantidad}) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc,{cantidad, precio}) => acc + cantidad * precio, 0)

    console.log(nCantidad)
    const carCount = document.querySelector('.carCount')
    const btnPagar = document.getElementById('btnPagar')
    carCount.innerHTML= nCantidad
    btnPagar.innerHTML= `
    <p>${nCantidad}</p>
    Ir a pagar
    <p>${nPrecio}</p>`

    const botonVaciar = document.getElementById('btnVaciar')
    botonVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })

    contenedorCartas.addEventListener('click',(e)=>{
        btnAumentarDisminuir(e)
    })
}

const btnAumentarDisminuir = e => {

    if (e.target.classList.contains('btn-suma')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }

        pintarCarrito()
    }

    if (e.target.classList.contains('btn-resta')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        pintarCarrito()
    }
    e.stopPropagation()
}

async function modalInfo(idChosen,categoriaChosen){
    const productos =  await getProducts('productos')
    const infoModal = document.getElementById('infoModal')
    const productoInfo = document.getElementById('productoInfo')
    const recomendados = document.getElementById('recomendados')

    infoModal.classList.remove('invisible')

    productos.forEach(product => {
        const {id,nombre,precioAhora,contenido,categoria,pesoGramos,nota,descuento,imagen,precioAntes,unidadMedida}=product
        if(id==idChosen){
            productoInfo.innerHTML=`    
            
            <div class="infoCont" id="infoCont">
                <img src="${imagen}" class="imgElegido" alt="">
                <h2 id="nombre">${nombre}</h2>
                <p id="precio">${precioAhora}</p>
                <p>${nota}</p>    
                <h5>selecciona la cantidad que deseas</h5>
                <input type="number" id="cantidadInput" style="width: 2rem;" min="1" value="1">
                <button class="btnAddCarrito" data-id="${id}">Agregar</button>            
            </div>  
            `
        }
        if (categoriaChosen=='ofertas' && categoria == 'ofertas' && id != idChosen){
            recomendados.innerHTML+=`
            <div class="card">
                <p id="descuento">${descuento}% dto.</p>
                <img  class="" src="${imagen}" alt="">
                <span id="precio">
                    $${precioAhora}/kg
                    <br>
                    <span>${precioAntes}/${unidadMedida}</span>
                </span>
                <p id="nombre">${nombre}</p>
                <button onclick="modalInfo(${id},ofertas)" class="btnInfo">Agregar</button>
            </div>   
            `
        }else if (categoriaChosen=='populares' && categoria == 'populares' && id != idChosen){
            recomendados.innerHTML+=`
            <div class="card">
                <img  class="" src="${imagen}" alt="">
                <span id="precio">
                    $${precioAhora}
                </span>
                <p id="nombre">${nombre}</p>
                <p>${contenido}($${pesoGramos}/${unidadMedida})</p>
                <button onclick="modalInfo(${id},'${categoria}')" class="btnInfo">Agregar</button>
            </div>                  
            `
        }
    });
}

async function showCards(){
    let productos =  await getProducts('ofertas')

    productos.forEach(product => {
        const {id,nombre,precioAhora,contenido,categoria,pesoGramos,nota,descuento,imagen,precioAntes,unidadMedida}=product
            
        if (categoria=='ofertas') {
             cartasCont.innerHTML+=`
            <div class="card">
                <p id="descuento">${descuento}% dto.</p>
                <img  class="" src="${imagen}" alt="">
                <span id="precio">
                    $${precioAhora}/kg
                    <br>
                    <span>$${precioAntes}/${unidadMedida}</span>
                </span>
                <p id="nombre">${nombre}</p>
                <button onclick="modalInfo(${id},'${categoria}')" class="btnInfo">Agregar</button>
            </div>                  
            `
        } else {
            recomendados.innerHTML+=`
            <div class="card">
                <img  class="" src="${imagen}" alt="">
                <span id="precio">
                    $${precioAhora}
                </span>
                <p id="nombre">${nombre}</p>
                <p>${contenido}($${pesoGramos}/${unidadMedida})</p>
                <button onclick="modalInfo(${id},'${categoria}')" class="btnInfo">Agregar</button>
            </div>                  
            `
        }
    })
}


function showCarrito() {
    const ciudad = document.getElementById('selectorCiudad').value
    document.querySelector('.paginaFullCarrito').classList.remove('active')
    const ciudadWrite = document.getElementById('ciudadWrite')
    if(ciudad!='0'){
        ciudadWrite.value = ciudad
    }else{
        console.log('NO Hay NADA')
    }
}