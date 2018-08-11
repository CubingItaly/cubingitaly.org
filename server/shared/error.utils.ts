export function return404(res){
    let error = {
        status: 404,
        message: "Resource not found"
    }
    res.status(404).send(error);
}