import { Page } from '../page/page.model';

export class Form extends Object {
    formId: string;
    public creatorId: string;
    public pages: Array<Page> = [];
    public creationTimestamp: string;
    public title: string;
    public modelToSendId: string;
    public isRegisterForm: Boolean = false;
    public isPreInterviewForm: Boolean = false ; 
    public isInterviewForm: Boolean = false;
    public isSingleColumnForm: Boolean; 

    constructor(creator: string, composition: Array<Page>, timestamp: string, title: string) {
        super();

        this.creatorId = creator;
        this.pages = composition;
        this.creationTimestamp = timestamp;
        this.title = title;
    }

}
