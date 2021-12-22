import { Component } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { ProductoService } from "../services/producto.service";
import { Producto } from "../models/producto";

@Component({
    selector: 'productos-list',
    templateUrl: '../views/productos-list.html',
    providers: [ProductoService]
})
export class ProductosListComponent{
    public titulo:string;
    public response:any;
    public productos:any;
    public confirmado:any = null;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _productoService: ProductoService
    ) {
        this.titulo = "Listado de productos";
    }

    ngOnInit() {
         this.getProductos();
    }

    getProductos() {
        this._productoService.getProductos().subscribe(
            result => {
                this.response = result;
                if (this.response.code != 200) {
                    console.log(this.response.status);
                } else {
                    this.productos = this.response.data;
                    return this.productos;
                }            
            }
        );
    }

    borrarConfirm(id:number) {
        this.confirmado = id;
    }

    cancelarConfirm() {
        this.confirmado = null;
    }

    onDeleteProducto (id:number) {
        this._productoService.deleteProducto(id).subscribe(
            result => {
                this.response = result;
                if (this.response.code == 200) {
                    this.getProductos();
                } else {
                    alert('Error al borrar el producto.');
                }
            }, error => {
                console.log(<any>error);
            }
        );
    }
}