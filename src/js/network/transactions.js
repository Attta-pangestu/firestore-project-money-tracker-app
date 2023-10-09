import axios from "axios";
import ApiEndpoint from "../config/api-endpoint";
import Utlis from "../utlis/utlis";
import {firebaseAuth , db } from "../utlis/firebase";
import {
    // mendapatkan data dengan query di firestore
    collection, getDocs, doc, where, query,
    // menambahkan data di firestore
    addDoc
} from 'firebase/firestore' ;
import Config from "../config/config";

const Transaction = {
    /*
    =========================================
    MENGGUNAKAN FIREBASE
    =========================================
    */  
    async GET_ALL_TRANSACTION(id) {
        const transactionRef = collection(db, `transaksiUser/${id}/transactionsHistory`) ; 
        const transactionQuery = query(transactionRef) ; 
        const querySnapshot = await getDocs(transactionQuery) ; 
        let transactions = [] ; 
        querySnapshot.forEach((item) => {
            transactions.push({
                id : item.id, 
                ...item.data(), 
            });
        });
        return transactions;
    }, 

    async addTransaction(id, {name,date, amount ,type, description,evidence}) {
        const transactionRef = collection(db,`transaksiUser/${id}/transactionHistory`) ;  
        // const data = {name, date, amount, type, description, evidence}; 
        return await addDoc(transactionRef, {
            name, 
            date,
            amount, 
            type, 
            description,
            evidence
        } ) ; 
    }

    /* 
    =============================================
    MENGGUNAKAN AXIOS API
    =============================================
    async GET_ALL_TRANSACTION() {
        const transactionsData = await axios.get(ApiEndpoint.GET_ALL_TRANSACTION, {
            headers : {
                Authorization : `Bearer ${Utlis.getUserToken(Config.USER_TOKEN_KEY)}`
            }
        }) ; 
        return transactionsData ; 
    },
    async getIdTransaction(id) {
        const transactionId = await axios.get(ApiEndpoint.GET_ID_TRANSACTION(id), {
            headers : {
                Authorization : `Bearer ${Utlis.getUserToken(Config.USER_TOKEN_KEY)}` 
            }
        }) ; 
        return transactionId ; 
    },
    async addTransaction({name, date, amount, type, description, evidence}) {
        return axios.post(ApiEndpoint.GET_ALL_TRANSACTION, {name, date, amount, type,  description, evidence}, {
            headers : {
                'Content-Type' : 'multipart/form-data', 
                'Authorization' : `Bearer ${Utlis.getUserToken(Config.USER_TOKEN_KEY)}`
            }
        })  ;
    }, 
    async editTransaction( id,{name, date, amount, type, description, evidence}) {
        return await axios.put(ApiEndpoint.EDIT_TRANSACTION(id),{name, date, amount, type, description, evidence}, {
            headers : {
                'Content-Type' : 'multipart/form-data', 
                'Authorization' : `Bearer ${Utlis.getUserToken(Config.USER_TOKEN_KEY)}`
            }
        })
    }, 

    async deleteTransactions(id) {
        return await axios.delete(ApiEndpoint.DEL_TRANSACTION(id), {
            headers : {
                'Authorization' : `Bearer ${Utlis.getUserToken(Config.USER_TOKEN_KEY)}`
            }
        })
    } 
    */
}

export default Transaction ; 