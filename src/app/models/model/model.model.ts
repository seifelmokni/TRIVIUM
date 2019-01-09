export class Model extends Object {

    modelId: string;
    name: string;
    description: string;
    subject: string;
    content: string;
    files: Array<string>;
    metaData: string;
    createdAt: Date = new Date();
    creatorID: string;
    constructor() {
        super();
    }
}
