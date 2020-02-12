export function delay(seconds:number){
    return new Promise( (resolve, _reject) => {
        setTimeout(resolve, seconds * 1000)
    })
}