export class Form {
    public creatorId: string;
    public formComposition: Array<{id: number , type: string}> = [];
    public creationTimestamp: string;

    constructor(creator: string, composition: Array<{id: number , type: string}>, timestamp) {
        this.creatorId = creator;
        this.formComposition = composition;
        this.creationTimestamp = timestamp;
    }

}
