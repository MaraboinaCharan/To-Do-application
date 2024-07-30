import bcrypt from 'bcrypt';

  const hashThePassword=async function(next){

    try {
        if (!this.isModified('password')) {
            return next();
        }
     
            const hashedPassword = await bcrypt.hash(this.password, 12);
            this.password = hashedPassword;
            this.confirmPassword = undefined;
            next();
        } catch (err) {
            next(err);
        }
    }


const userMiddleware={
    hashThePassword
};

export default userMiddleware;
