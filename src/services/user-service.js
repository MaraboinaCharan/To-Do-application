import bcrypt from 'bcrypt';
import crypto from 'crypto';


  const comparePasswordInDb=async function(pass, passDb){
        return await bcrypt.compare(pass, passDb);
    }

  const isPasswordChanged=async function(JWTTimestamp){
        if (this.passwordChangedAt) {
            const passwordChangeTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
            return JWTTimestamp < passwordChangeTimestamp;
        }
        return false;
    }

   

    const userService={
        comparePasswordInDb,isPasswordChanged
    }

export default userService;