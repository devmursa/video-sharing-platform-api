class APIError extends Error{

 constructor(code,message="something went wrong!",error=[],stack=""){
     super(message);
    this.code=code;
    this.error=error;
    this.success=false;
    this.data=null;
    if(stack){
        this.stack=stack
    }else{
        Error.captureStackTrace(this,this.constructor)
    }
 }


}

export default APIError;