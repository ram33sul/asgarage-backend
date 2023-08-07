export const validateImages = (images) => {
    const errors = [];
    images.forEach(({mimetype}, i) => {
        const type = mimetype.split('/')[0];
        if(type !== 'image'){
            errors.push({
                index: i,
                error: "must be an image"
            })
        }
    })
    return errors;
}