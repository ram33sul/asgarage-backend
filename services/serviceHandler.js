export const serviceHandler = (callback) => {
    return async (req, res) => {
        try {
            await callback(req,res)
        } catch (error) {
            res.status(500).send({error: "Internal error occurred"})
            console.log(error)
        }
    }
}