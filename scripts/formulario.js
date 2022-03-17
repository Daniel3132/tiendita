const carritoCont = document.querySelector('.carritoModal')
const btnPagar = document.getElementById('btnPagar')

const pintarCarrito = () =>{
    
    Object.values(carrito).forEach(producto=>{
        
        carritoCont.innerHTML+=`
        <div class="carritoCard " id="carritoCard">
            <img src="${producto.imagen}" alt="">
            <div class="carritoInfo ">
                <p>${producto.nombre}</p>
                <p>$${Math.ceil(producto.precio * producto.cantidad) }</p>
            </div>
            <div class="selectorU">
               
                <p id="cantidad">${producto.cantidad}</p>

            </div>
        </div>
        `
    })
    const nPrecio = Object.values(carrito).reduce((acc,{cantidad, precio}) => acc + cantidad * precio, 0)
    btnPagar.innerHTML=`Pagar $${Math.ceil(nPrecio) }`
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
    const acumulador = Object.values(carrito).reduce((acc,{cantidad, precio}) => acc + cantidad * precio, 0)
    Swal.fire(
        `Compra Exitosa por $${acumulador}`,
        'Gracias por preferirnos',
        'success'
      )
})