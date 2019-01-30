export class Sede extends Object {
    id:string;
    lastUpdateUserId:string;
    lastUpdate:string ;
    columns: Array<string> = [];
    rows: Array<string> = [];
    table: Array<{key:string , value:string}> = [];
    constructor(){
        super();
    }
}
