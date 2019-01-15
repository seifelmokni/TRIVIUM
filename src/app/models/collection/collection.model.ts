export class Collection extends Object {
    colectionId: string;
    collectionName: string;
    createdAt: Date = new Date();
    items: Array<string>;
    creatorId: string;
    constructor() {
        super();
    }
}
