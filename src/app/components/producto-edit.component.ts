import { Component } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { ProductoService } from "../services/producto.service";
import { Producto } from "../models/producto";
import { GLOBAL } from "../services/global";

@Component({
    selector: "producto-edit",
    templateUrl: "../views/producto-add.html",
    providers: [ProductoService]
})
export class ProductoEditComponent {
    public titulo:string;
    public producto:Producto;
    public filesToUpload:any;
    public resultToUpload:any;
    public response:any;
    public is_edit:boolean;

    constructor(
        private _productoService: ProductoService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        this.titulo = 'Editar producto';
        this.producto = new Producto(0, "", "", 0, "");
        this.is_edit = true;
    }

    ngOnInit() {
        this.getProducto();
    }

    getProducto() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._productoService.getProducto(id).subscribe(
                result => {
                    this.response = result;
                    if (this.response.code == 200) {
                        this.producto = this.response.data;
                    } else {
                        this._router.navigate(['/productos']);
                    }
                }, error => {
                    console.log(<any>error);
                }
            )
        })
    }

    onSubmit() {
        console.log(this.producto);
        if(this.filesToUpload && this.filesToUpload.length >= 1) {
            this._productoService.makeFileRequest(GLOBAL.url+'upload-file', [], this.filesToUpload).then((result) => {
                this.resultToUpload = result;
                this.producto.imagen = this.resultToUpload.filename;
                this.updateProducto();
            }, (error) => {
                console.log(error);
            });
        } else {
            this.updateProducto();
        }
    }

    updateProducto() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._productoService.editProducto(id, this.producto).subscribe(
                result => {
                    this.response = result;
                    if (this.response.code == 200) {
                        this._router.navigate(['/producto', id]);
                    } else {
                        console.log(result);
                    }
                }
            );
        })
    };

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);
    }
}