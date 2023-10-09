import axios from "axios";
import Auth from "../../network/auth";
import Config from "../../config/config";
import CheckUserAuth from "./check-user-auth";
import Utlis from "../../utlis/utlis";
import { firebaseAuth } from "../../utlis/firebase";

const Login = {
    async init() {
        CheckUserAuth.checkLoginState() ; 
        this._initialListener() ; 
    },

    _initialListener() {
        const loginForm = document.querySelector('#loginForm') ; 
        loginForm.addEventListener('submit', 
        
            async (event) => {
                event.preventDefault() ;
                event.stopPropagation() ;

                loginForm.classList.add('was-validated'); 
                await this._getLogged() ; 
            }
        );
    }, 
    

    async _getLogged() {
        try {
            const formData = this._getFormData() ;
            
            if(this._validateFormData({...formData})) {
                console.log('Ini Data Form Data') ; 
                console.log(formData) ; 
            }  ; 
            const response = await Auth.login({
                email : formData.email,
                password: formData.password  
            }) ;
            const userId = await this._cekCurrentUser() ; 
            console.log(userId) ; 
            const token = response.user.accessToken ; 
            Utlis.setUserToken(Config.USER_TOKEN_KEY, token) ; 
            window.alert('User process to logged in ', token) ; 
            this._goToDashboard() ; 
        }
        catch(error) {
            console.log('Terjadi Error ', error) ; 
        }
    }, 

    async  _cekCurrentUser() {
        return new Promise((resolve, reject) => {
          firebaseAuth.onAuthStateChanged((user) => {
            if (user) {
              resolve(user.uid);
            } else {
              reject(new Error("Tidak ada pengguna yang masuk"));
            }
          });
        });
      },

    _getFormData() {
        const email = document.querySelector('#validationCustomRecordEmail').value ; 
        const password = document.querySelector('#validationCustomRecordPass').value ; 
        
        return {
            email, 
            password,
        } ;
    },

    _validateFormData(formData) {
        const formDataFiltered = Object.values(formData).filter(item => item === ''); 
        return formDataFiltered.length === 0 ;
    }, 

    _goToDashboard() {
        window.location.href = '/' ; 
    }
}

export default Login ;