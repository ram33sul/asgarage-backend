import { validateDescription, validateEmail, validateMobile, validateName, validatePassword, validatePrice, validateProductCategory, validateProductName } from "./inputsServices.js";

const validations = {
    name: validateName,
    email: validateEmail,
    mobile: validateMobile,
    password: validatePassword,
    description: validateDescription,
    price: validatePrice,
    productName: validateProductName,
    productCategory: validateProductCategory
}

const validateInputs = (inputs) => {
    const errors = [];
    for(let input of inputs){
        if(input.length !== 0){
            const validation = validations[input[1]](input[0]);
            if(validation.error){
                errors.push([input[2] ?? input[1], validation.error])
            }
        }
    }
    return errors;
}

export default validateInputs