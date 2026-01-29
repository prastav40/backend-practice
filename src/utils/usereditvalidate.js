const usereditvalidate=(req,res)=>{
    const allowedUpdates = [ 'age', 'firstname', 'lastname',"password"];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    return isValidOperation;
}

module.exports={usereditvalidate};