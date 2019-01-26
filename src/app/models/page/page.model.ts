import { Element } from '../element/element.model';

export class Page extends Object {
    public pageTitle: string;
    public formComposition: Array<Element> = [];

    public elementCount: number;
    pageSaved: Boolean = true ; 

    conditions: Array<{
        conditionType: string,
        compareTo: string,
        compareType: string,
        compareValue: string,
        actionOn: string,
        actionType: string,
        actionFrom: string
    }>;


    constructor(composition: Array<Element>, pageTitle: string, count: number) {
        super();
        this.formComposition = composition;
        this.pageTitle = pageTitle;
        this.elementCount = count;
    }

}
