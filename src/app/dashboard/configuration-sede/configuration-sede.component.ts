import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddCellPopupComponent } from '../popup/add-cell-popup/add-cell-popup.component';
import { Sede } from 'src/app/models/sede/sede.model';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { SedeService } from 'src/app/shared/Sede/sede.service';
import { Links } from 'src/app/models/links/links.model';

@Component({
  selector: 'app-configuration-sede',
  templateUrl: './configuration-sede.component.html',
  styleUrls: ['./configuration-sede.component.css']
})
export class ConfigurationSedeComponent implements OnInit {
  columns: Array<string> = []
  rows:Array<string> = [];
  sede:Sede ; 


  constructor(private dialog: MatDialog , private autService: AuthService , private sedeService: SedeService) { }

  ngOnInit() {
    this.sede = new Sede();

    this.sedeService.list().subscribe(
      (sedes: Sede[]) => {
        if(sedes.length != 0){
          this.sede = sedes[0] ; 
        }
      }
    );
  }

  editRownName(i){
    const dialogRef = this.dialog.open(AddCellPopupComponent, {
      width: '50px',
      data: {message: 'editar fila' , content: this.rows[i]  }
  });

  dialogRef.afterClosed().subscribe(result => {
      if (result !== '' && result != undefined) {
          console.log('The dialog was closed');
          console.log(result);
         // this.sede.columns.push(result);
         this.sede.rows[i] = result ; 
      }
  });
  }
  editColumnName(i){
    const dialogRef = this.dialog.open(AddCellPopupComponent, {
      width: '50px',
      data: {message: 'editar columna' , content: this.rows[i]  }
  });

  dialogRef.afterClosed().subscribe(result => {
      if (result !== '' && result != undefined) {
          console.log('The dialog was closed');
          console.log(result);
          this.sede.columns[i] = result ; 
         // this.sede.columns.push(result);
      }
  });
  }

  deleteRow(i){
    this.sede.rows.splice(i , 1) ; 
  }
  deleteColumn(i){
    this.sede.columns.splice(i,1);
  }

  addColumn(){
    const dialogRef = this.dialog.open(AddCellPopupComponent, {
      width: '50px',
      data: {message: 'nueva columna'  }
  });

  dialogRef.afterClosed().subscribe(result => {
      if (result !== '' && result != undefined) {
          console.log('The dialog was closed');
          console.log(result);
          this.sede.columns.push(result);
      }
  });
  }
  addRow(){
    const dialogRef = this.dialog.open(AddCellPopupComponent, {
      width: '50px',
      data: {message: 'nueva fila'  }
  });

  dialogRef.afterClosed().subscribe(result => {
      if (result !== '' && result != undefined) {
          console.log('The dialog was closed');
          console.log(result);
          this.sede.rows.push(result) ; 
      }
  });  
}

  updateCellValue(i , j){
    console.log('cell update value');
    const dialogRef = this.dialog.open(AddCellPopupComponent, {
      width: '50px',
      data: {message: 'valor de celda'  }
  });

  dialogRef.afterClosed().subscribe(result => {
      if (result !== '' && result != undefined) {
        const colName = this.sede.columns[i] ; 
        const rowName = this.sede.rows[j] ; 
        const key = i+'----'+j ;
        const el  = {key:key , value:result};
        let found = false ; 
        for(let i = 0 ; i < this.sede.table.length ; i++){
          if(this.sede.table[i].key == key){
            this.sede.table[i].value =result ;
            found = true ;
            break;
          }
        }
        if(!found){
          this.sede.table.push(el);  
        }
        //this.sede.table.set([colName , rowName] , result) ; 
      }
  });
  }

  saveSede(){
    console.log(this.sede) ; 
    this.sede.lastUpdate = (new Date()).toString();
    
    this.sede.lastUpdateUserId = this.autService.getUserSession().userID;
    this.sedeService.saveSede(this.sede);
  }
  

}
