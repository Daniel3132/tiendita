const carritoCont = document.querySelector('.carritoModal')

const pintarCarrito = () =>{

    Object.values(carrito).forEach(producto=>{
        
        carritoCont.innerHTML+=`
        <div class="carritoCard " id="carritoCard">
            <img src="${producto.imagen}" alt="">
            <div class="carritoInfo ">
                <p>${producto.nombre}</p>
                <p>$${producto.precio * producto.cantidad}</p>
            </div>
            <div class="selectorU">
               
                <p id="cantidad">${producto.cantidad}</p>

            </div>
        </div>
        `
    })
    localStorage.setItem('carrito', JSON.stringify(carrito))

}

if (localStorage.getItem('carrito')) {
    carrito = JSON.parse(localStorage.getItem('carrito'))
    pintarCarrito()
}
function comprado (){
    Swal.fire(
        'The Internet?',
        'That thing is still around?',
        'question'
      )
}
document.addEventListener('submit',(e)=>{
    e.preventDefault();
    Swal.fire(
        'Compra Exitosa',
        'Gracias por preferirnos',
        'success'
      )
})