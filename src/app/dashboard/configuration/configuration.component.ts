import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Collection } from '../../models/collection/collection.model';
import { ConfigurationService } from '../../shared/configuration/configuration.service';

@Component({
    selector: 'app-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {
    @ViewChild('leftContainer') leftContainer: ElementRef;
    @ViewChild('collectionItemContainer') collectionItemContainer: ElementRef;

    collections: Collection[];
    collection: Collection;
    collectionCounter = 0;
    collectionItemCounter = 0;
    csvContent: string;

    showCreateNewCollectionPanel: Boolean = false;

    constructor(private renderer: Renderer2,
        private elementRef: ElementRef,
        private configservice: ConfigurationService) { }

    ngOnInit() {
        this.configservice.listCollection().subscribe(
            (collections: Collection[]) => {
                this.collections = collections;
                this.loadCollection();
            }
        );
    }

    loadCollection() {
        for (let i = 0; i < this.collections.length; i++) {

            const html = '<div class="collection" id="col-' + i + '">' +
                '<label id="col-lbl-' + i + '" style="display: inline">' + this.collections[i].collectionName + '</label>' +
                '<input type="text" value="' + this.collections[i].collectionName + '" id="col-input-' + i +
                '" style="display: none" placeholder="nombre de la colección" />' +
                '<span class="collection-edit">' +
                '<a id="col-edit-' + i + '" style="margin-left: 10px">' +
                '<i class="fa fa-pencil-alt"></i>' +
                '</a>' +
                '<a id="col-del-' + i + '" style="margin-left: 10px">' +
                '<i class="fa fa-trash-alt"></i>' +
                '</a>' +
                '<a id="col-prev-' + i + '" style="margin-left: 10px">' +
                '<i class="fa fa-eye"></i>' +
                '</a>' +
                '</span>' +
                '</div>';
            this.leftContainer.nativeElement.insertAdjacentHTML('beforeEnd', html);
            this.collectionCounter++;
            this.elementRef.nativeElement.querySelector('#col-input-' + i)
                .addEventListener('blur', () => this.editCollectionName(i));
            this.elementRef.nativeElement.querySelector('#col-input-' + i)
                .addEventListener('keyup', (event) => this.changeNameKeyUp(i, event.keyCode));
            this.elementRef.nativeElement.querySelector('#col-edit-' + i)
                .addEventListener('click', () => this.showChangeNameInput(i));
            this.elementRef.nativeElement.querySelector('#col-del-' + i)
                .addEventListener('click', () => this.deleteCollection(i));
            this.elementRef.nativeElement.querySelector('#col-prev-' + i)
                .addEventListener('click', () => this.showCollection(i));
        }
    }

    createNewCollection(isReady: Boolean) {

        const html = '<div class="collection" id="col-' + this.collectionCounter + '">' +
            '<label id="col-lbl-' + this.collectionCounter + '" style="display: none"></label>' +
            '<input type="text" id="col-input-' + this.collectionCounter +
            '" style="display: inline" placeholder="nombre de la colección" />' +
            '<span class="collection-edit">' +
            '<a id="col-edit-' + this.collectionCounter + '" style="margin-left: 10px">' +
            '<i class="fa fa-pencil-alt"></i>' +
            '</a>' +
            '<a id="col-del-' + this.collectionCounter + '" style="margin-left: 10px">' +
            '<i class="fa fa-trash-alt"></i>' +
            '</a>' +
            '<a id="col-prev-' + this.collectionCounter + '" style="margin-left: 10px">' +
            '<i class="fa fa-eye"></i>' +
            '</a>' +
            '</span>' +
            '</div>';
        this.leftContainer.nativeElement.insertAdjacentHTML('beforeEnd', html);
        this.collectionCounter++;
        for (let i = 0; i < this.collectionCounter; i++) {
            this.elementRef.nativeElement.querySelector('#col-input-' + i)
                .addEventListener('blur', () => this.editCollectionName(i));
            this.elementRef.nativeElement.querySelector('#col-input-' + i)
                .addEventListener('keyup', (event) => this.changeNameKeyUp(i, event.keyCode));
            this.elementRef.nativeElement.querySelector('#col-edit-' + i)
                .addEventListener('click', () => this.showChangeNameInput(i));
            this.elementRef.nativeElement.querySelector('#col-del-' + i)
                .addEventListener('click', () => this.deleteCollection(i));
            this.elementRef.nativeElement.querySelector('#col-prev-' + i)
                .addEventListener('click', () => this.showCollection(i));
        }
        this.elementRef.nativeElement.querySelector('#col-input-' + (this.collectionCounter - 1)).focus();
        this.showCreateNewCollectionPanel = true;
        this.collection = new Collection();
        this.collection.colectionId = '';
        this.collection.items = [];
    }

    showCollection(index) {
        console.log('show ' + index);
        this.showCreateNewCollectionPanel = true;
        for (let i = 0; i < this.collectionItemCounter; i++) {
            this.deleteCollectionItem(i);
        }
        this.collection = this.collections[index];
        console.log(this.collection);
        this.loadItems(this.collection.items, false);

    }
    deleteCollection(index) {
        console.log('delete ' + index);
    }
    showChangeNameInput(index) {
        console.log('change name ' + index);
        this.renderer.setStyle(this.elementRef.nativeElement.querySelector('#col-lbl-' + index), 'display', 'none');
        this.renderer.setStyle(this.elementRef.nativeElement.querySelector('#col-input-' + index), 'display', 'inline');
        this.elementRef.nativeElement.querySelector('#col-input-' + index).focus();

    }
    changeNameKeyUp(index, code) {
        if (code === 13) {
            this.editCollectionName(index);
        }
    }
    editCollectionName(index) {
        this.elementRef.nativeElement.querySelector('#col-lbl-' + index).innerHTML =
            this.elementRef.nativeElement.querySelector('#col-input-' + index).value;
        this.renderer.setStyle(this.elementRef.nativeElement.querySelector('#col-lbl-' + index), 'display', 'inline');
        this.renderer.setStyle(this.elementRef.nativeElement.querySelector('#col-input-' + index), 'display', 'none');
        this.collection.collectionName = this.elementRef.nativeElement.querySelector('#col-input-' + index).value;
    }

    addCollectionItem() {

        const html = '<li id="ci-' + this.collectionItemCounter + '">' +
            '<input type="text" id="ci-input-' + this.collectionItemCounter + '" value="" placeholer="entra en el elemento">' +
            '<a title="Eliminar opción" id="ci-del-' + this.collectionItemCounter + '">' +
            '<i class="fa fa-minus-square"></i>' +
            '</a>' +
            '</li>';
        this.collectionItemContainer.nativeElement.insertAdjacentHTML('beforeEnd', html);
        
        this.elementRef.nativeElement.querySelector('#ci-del-' + this.collectionItemCounter).addEventListener(
            'click', () => this.deleteCollectionItem(this.collectionItemCounter)
            );
        this.elementRef.nativeElement.querySelector('#ci-input-' + this.collectionItemCounter).addEventListener(
            'keyup', () => this.addItemToCollection(this.collectionItemCounter)
            );
            console.log('item counter');
            console.log(this.collectionItemCounter);
    
        this.collectionItemCounter++;



    }
    deleteCollectionItem(index) {
        console.log('delete item '+index );
        if (this.elementRef.nativeElement.querySelector('#ci-' + index)) {
            this.renderer.removeChild(this.collectionItemContainer.nativeElement,
                this.elementRef.nativeElement.querySelector('#ci-' + index)
            );
        }

    }
    addItemToCollection(index) {
        console.log(' add item to collection ' + index);
        if (this.collection.items.length > index) {
            this.collection.items[index] = this.elementRef.nativeElement.querySelector('#ci-input-' + index).value;
        } else {
            this.collection.items.push(this.elementRef.nativeElement.querySelector('#ci-input-' + index).value);
        }
    }
    onFileLoad(fileLoadedEvent) {
        const textFromFileLoaded = fileLoadedEvent.target.result;
        this.csvContent = textFromFileLoaded;
        console.log('csv file content');
        console.log(this.csvContent);
        this.addItemsFromCSV();


    }

    onFileSelect(input: HTMLInputElement) {

        const files = input.files;
        if (files && files.length) {
            /*
             console.log("Filename: " + files[0].name);
             console.log("Type: " + files[0].type);
             console.log("Size: " + files[0].size + " bytes");
             */

            const fileToRead = files[0];

            const fileReader = new FileReader();
            fileReader.onload = (e) => this.onFileLoad(e);
            fileReader.readAsText(fileToRead, 'UTF-8');

        }

    }

    loadItems(items, shouldAdd) {
        const itemCounter = this.collectionItemCounter;
        
        this.showCreateNewCollectionPanel = true;
        for (let i = 0; i < items.length; i++) {
            const id = itemCounter + i;
            const html = '<li id="ci-' + id + '">' +
                '<input type="text" id="ci-input-' + id + '" value="" placeholer="entra en el elemento">' +
                '<a title="Eliminar opción" id="ci-del-' + id + '">' +
                '<i class="fa fa-minus-square"></i>' +
                '</a>' +
                '</li>';
            this.collectionItemContainer.nativeElement.insertAdjacentHTML('beforeEnd', html);
            console.log('element ' + i);
            this.elementRef.nativeElement.querySelector('#ci-del-' + id).addEventListener('click', () => this.deleteCollectionItem(i));
            this.elementRef.nativeElement.querySelector('#ci-input-' + id).addEventListener('keyup', () => this.addItemToCollection(i));
            console.log('index');
            console.log(this.collectionItemCounter - 1 + i);
            this.elementRef.nativeElement.querySelector('#ci-input-' + id).value = items[i].replace(/"/g, '');
            if (shouldAdd) {
                this.collection.items.push(items[i].replace(/"/g, ''));
            }
        }

        this.collectionItemCounter = items.length;
    }

    addItemsFromCSV() {
        const items = this.csvContent.split(',');
        this.loadItems(items, true);
        this.collectionItemCounter += items.length;
        console.log('item counter');
        console.log(this.collectionItemCounter);
    }

    validateCollection() {
        console.log('collection');
        console.log(this.collection);

        if (this.collection.colectionId === '') {
            this.configservice.saveCollection(this.collection).then(
                () => {
                    this.collection = new Collection();
                    this.collection.colectionId = '';
                    for (let i = 0; i < this.collectionItemCounter; i++) {
                        this.deleteCollectionItem(i);

                    }
                    this.showCreateNewCollectionPanel = false;
                }
            );
        } else {
            console.log('updating');
            this.configservice.updateCollection(this.collection).then(
                () => {
                    this.collection = new Collection();
                    this.collection.colectionId = '';
                    for (let i = 0; i < this.collectionItemCounter; i++) {
                        this.deleteCollectionItem(i);

                    }
                    this.showCreateNewCollectionPanel = false;
                }
            );
        }


    }


}
