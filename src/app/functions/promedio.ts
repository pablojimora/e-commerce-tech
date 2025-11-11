const promedio = (numeros:number[])=>{
    const suma = numeros.reduce((a:number,b:number) => a + b, 0);
    return suma / numeros.length;
}

export default promedio;