export function return404(res){
    let error = {
        error: 404,
        message: "Resource not found"
    }
    res.status(404).json(error);
}

export function return403(res){
    let error = {
        error: 403,
        message: "Permission denied"
    }
    res.status(403).json(error);
}


export function return400(res){
    let error = {
        error: 400,
        message: "Bad request"
    }
    res.status(400).json(error);
}
