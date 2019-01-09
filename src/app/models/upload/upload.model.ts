export class Upload extends Object {
    $key: string;
    file: File;
    name: string;
    url: string;
    progress: number;
    createdAt: Date = new Date();

    constructor(file: File) {
        super();
        this.file = file;
    }
}
