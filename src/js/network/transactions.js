import axios from "axios";
import ApiEndpoint from "../config/api-endpoint";
import Utlis from "../utlis/utlis";
import {firebaseAuth , db , storage } from "../utlis/firebase";
import {
    // mendapatkan data dengan query di firestore
    collection, getDocs, doc, where, query, getDoc,
    // menambahkan data di firestore
    addDoc,
    // mengedit data atau doc
    updateDoc, 
    // menghapus data atau doc sesuai ID nya
    deleteDoc, 

} from 'firebase/firestore' ;

import {
    // Path
    ref,
    // Untuk mengambil data berupa url 
    getDownloadURL,
    // Mengupload file ke cloud storage
    uploadBytes, 
    // Menghapus file
    deleteObject
} from 'firebase/storage' ; 
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
        console.log('ID User yang ditambahkan adalah  : ', id) ; 
        const transactionRef = collection(db,`transaksiUser/${id}/transactionsHistory`) ;  
        // const data = {name, date, amount, type, description, evidence}; 
        return await addDoc(transactionRef, {
            name, 
            date,
            amount, 
            type, 
            description,
            evidence
        } ) ; 
    }, 
    async getIdTransaction(userID, transactionId) {
        const pathRef = `transaksiUser/${userID}/transactionsHistory/${transactionId}` ; 
        const transactionRef = doc(db, pathRef) ; 
        const docSnapshot = await getDoc(transactionRef) ; 
        console.log('Hasil get data sesuai ID dari modul Transaksi adalah : ') ;
        console.log(docSnapshot.data()) ;
        return docSnapshot.data() ; 
    }, 
    async editTransaction(userId, transactionId,  {name, date, amount, type, description, evidence}) {
        const pathRef = `transaksiUser/${userId}/transactionsHistory/${transactionId}`;
        const transactionRef = doc(db, pathRef);
        const data = {name, date, amount, type, description, evidence}
        console.log(data) ; 
        return await updateDoc(transactionRef, data) ; 
    }, 

    async deleteTransaction(userId, transactionId) {
        const pathRef = `transaksiUser/${userId}/transactionsHistory/${transactionId}`;
        const transactionRef = doc(db, pathRef) ; 
        return await deleteDoc(transactionRef) ; 
    }, 

    async uploadFile(file) {
        const fileRef = ref(storage,`gs://dicoding-1-8dcb8.appspot.com/${file.name}`) ; 
        return await uploadBytes(fileRef, file) ; 
    },
    async getFileUrl(fileRef) {
        return await getDownloadURL(fileRef) ; 
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