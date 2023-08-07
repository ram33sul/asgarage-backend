export const validateName = (name) => {
    if(typeof name !== 'string'){
        return {
            error: "must be string"
        }
    }
    if(name.length > 15){
        return {
            error: "must have less than 16 letters"
        }
    }
    return {}
}

export const validateEmail = (email) => {
    const test = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(!!email && email.toLowerCase().match(test)){
        return {};
    }
    return {
        error: "is not valid"
    };
}

export const validateMobile = (mobile) => {
    if(typeof mobile !== 'string'){
        return {
            error: "must be a string"
        }
    }
    if(mobile.length !== 10){
        return {
            error: "must have 10 digits"
        }
    }
    if(parseInt(mobile) === NaN){
        return {
            error: "is not valid"
        }
    }
    return {}
}

export const validatePassword = (password) => {
    if(typeof password !== 'string'){
        return {
            error: "must be a string"
        }
    }
    if(password.length < 6){
        return {
            error: "must have atleast 6 characters"
        }
    }
    return {};
}

export const validateDescription = (description) => {
    if(typeof description !== 'string'){
        return {
            error: "must be a string"
        }
    }
    if(description.length > 100){
        return {
            error: "must have less than 100 characters"
        }
    }
    return {}
}

export const validatePrice = (price) => {
    if(typeof price !== 'number'){
        return {
            error: "must be a number"
        }
    }
    if(price < 0){
        return {
            error: "must be a positive number"
        }
    }
    if(price > 999999999){
        return {
            error: "must be less than 1000000000"
        }
    }
    return {}
}

export const validateProductName = (name) => {
    if(typeof name !== 'string'){
        return {
            error: "must be a string"
        }
    }
    if(name.length === 0){
        return {
            error: "is required"
        }
    }
    if(name.length > 16){
        return {
            error: "must have less than 16 characters"
        }
    }
    return {}
}

export const validateProductCategory = (category) => {
    if(typeof category !== 'string'){
        return {
            error: "must be a string"
        }
    }
    const categories = ['bike', 'part', 'accessory', 'other']
    if(!categories.includes(category)){
        return {
            error: "is not a valid category"
        }
    }
    return {}
}