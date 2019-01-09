export class User extends Object {

    public login = '';
    public password = '';
    public role = '';
    public userID = '';
    public firstName = '';
    public lastName = '';
    public birthDate = '';
    public portable = '';
    public fix = '';

    public street = '';
    public city = '';
    public zipcode = '';
    public country = '';

    public image: string;
    constructor(login: string, password: string, r: string, uid: string) {
        super();
        this.login = login;
        this.password = password;
        this.role = r;
        this.userID = uid;
    }
}
