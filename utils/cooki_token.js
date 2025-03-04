const cookieToken = (user, res) =>{
    // generate token
    const token = user.getJwtToken()

    const options = {
        expires: new Date(
            Date.now() + 3 * 24 * 60 * 60 *1000
        ),
            httpOnly: true
        }
        user.password = undefined
        // send user in cookies and json
        res.status(201).cookie('token', token, options).json({
            message: "user successfully create",
            token,
            user
        })
}



module.exports =cookieToken