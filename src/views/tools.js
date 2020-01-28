let showText=(d)=>{
    if(d<10){
        return `black`
    }
    if(d<100){
        return `blue`
    }
    return  `red`
}


export {
    showText
}