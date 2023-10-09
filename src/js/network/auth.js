import {
    // Menambahkan user baru
    createUserWithEmailAndPassword, 
    //Mengupdate profil 
    updateProfile,
    // Melakukan Login
    signInWithEmailAndPassword

} from 'firebase/auth' ;
import {firebaseAuth} from '../utlis/firebase' ;

import axios from 'axios' ; 
import ApiEndpoint from '../config/api-endpoint';


const Auth = {
    /* ========================================================================
    MENGGUNAKAN FIREBASE AUTHENTIFIKASI
    ========================================================================
    */
    async register({ email, password}) {
        return createUserWithEmailAndPassword(firebaseAuth, email, password) ; 
    },

    async login({email, password}) {
        return await signInWithEmailAndPassword(firebaseAuth,email, password ) ;  
    }, 

    async updateProfile(user, {displayName=null}) {
        return await updateProfile(user, {
            displayName, 
        })
    }

    /*
    ========================================================================
    MENGGUNAKAN API SENDIRI
    ========================================================================
    
    async register({name, email, password}) {
        return await axios.post(ApiEndpoint.REGISTER, {name, email, password},{
            headers: {
                'Content-Type' : 'application/json'
            }
        } ) ; 
    }, 
    async login({email, password}) {
        return await axios.post(ApiEndpoint.LOGIN, {email, password}, {
            headers: {
                'Content-Type' : 'application/json'
            }
        }) ; 
    }
    */
};

export default Auth ; 