class APIResponse{
    constructor(statusCode,mes="",data=null){
        this.statusCode=statusCode;
        this.message=mes;
        this.data=data;
        this.success= statusCode > 400
    }
}

export default APIResponse;