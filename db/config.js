const mongoose  = require("mongoose");

const dbConnecion = async() => {

    try {
        
        await mongoose.connect( process.env.BD_CNN );
        
        /*,{ //Eso ya esta obsoleto
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true            
        } */

        console.log('DB Online');

    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar BD...');
    }
    
}

module.exports = {
    dbConnecion
}