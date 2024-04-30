
class ProjectModel{
    constructor(id,name,subject,URL_G,URL_T,URL_S){
        this.id = id;
        this.name =name;
        this.subject=subject;
        this.URL_G=URL_G;
        this.URL_T=URL_T;
        this.URL_S=URL_S;
    }

    getName(){
        return this.name;
    }
}

module.exports=ProjectModel;