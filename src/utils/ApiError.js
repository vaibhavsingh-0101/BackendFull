class ApiError extends Error{
  custructor(
    statusCode,
    message="Somthing went wrong",
    errors = [],
    statck =""
  ){
    super(message)
    this.statusCode = statusCode
    this.data = null
    this.message =message
    this.success = false
    this.errors = errors

    if (stack){
      this.stack=statck
    }else{
      Error.captureStackTrace(this,this.custructor)
    }
  }
}
export {ApiError}