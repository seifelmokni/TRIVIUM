export class Element extends Object {
    id: number;
    type: string;
    labelTitle: string;
    container: string;
    role: string;
    options: string;
    isRequired: Boolean;
    isConditioned: Boolean;
    value:string = "";
    inputType:string = ''


    constructor(id: number, type: string, labelTitle: string, con: string) {
        super();
        this.id = id;
        this.type = type;
        this.labelTitle = labelTitle;
        this.container = con;
        this.role = '';
    }
}
