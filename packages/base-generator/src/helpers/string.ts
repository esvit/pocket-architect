export function capitalize(str:string):string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function variableCase(str:string):string {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

export function kebabCase(str:string):string {
    return str.charAt(0).toLowerCase() + str.slice(1).replace(/([A-Z])/g, '-$1').toLowerCase();
}
