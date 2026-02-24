const usereditvalidate=(req,res)=>{
    const allowedUpdates = [ 'age', 'firstname', 'lastname',"gender", "photourl", "about"];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    return isValidOperation;
}

module.exports={usereditvalidate};