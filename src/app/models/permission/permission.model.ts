export class Permission extends Object {
    profileName: string;
    description: string;
    userId: string;
    access: Array<{ permissionName: string, view: Boolean, create: Boolean, edit: Boolean, delete: Boolean }>;
    id: string;
    showInUserList: Boolean;
    isSuperAdmin: Boolean;
    creationTimeStamp: string;

    constructor(
        profle: string,
        desc: string,
        uid: string,
        acc: Array<{ permissionName: string, view: Boolean, create: Boolean, edit: Boolean, delete: Boolean }>,
        siul: Boolean,
        isSA: Boolean) {
        super();
        this.profileName = profle;
        this.description = desc;
        this.userId = uid;
        this.access = acc;
        this.showInUserList = siul;
        this.isSuperAdmin = isSA;
    }
}
