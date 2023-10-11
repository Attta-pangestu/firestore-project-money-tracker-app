import CheckUserAuth from "../auth/check-user-auth";
import Transaction from "../../network/transactions";

const Edit = {
  _userID : null, 
  _transactionId: null, 

  async init() {
    this._initialUI();
    await this._initialData();
    this._initialListener();
  },

  _initialUI() {
    const listInputRadioTransactionType = [
      {
        inputId: 'recordType1',
        value: 'income',
        caption: 'Pemasukan',
        required: true,
      },
      {
        inputId: 'recordType2',
        value: 'expense',
        caption: 'Pengeluaran',
        required: true,
      },
    ];

    const inputRadioTransactionTypeEdit = document.querySelector('#inputRadioTransactionTypeEdit');
    inputRadioTransactionTypeEdit.setAttribute(
      'listRadio',
      JSON.stringify(listInputRadioTransactionType),
    );
  },

  async _initialData() {
    const paramsId  = this._getTransactionId();
    const transactionId = paramsId.transactionId ;
    const userId =  paramsId.userId ; 

    this._userID = userId ; 
    this._transactionId = transactionId; 
  
    if (!transactionId) {
      alert(`Data dengan id ${transactionId} yang dicari tidak ditemukan`);
      return;
    }

    const dataRecord = await this._getTransactionData(userId, transactionId) ; 
    const formattedDataRecord = this._changeDateFormat(dataRecord) ; 
    console.log('Ini data yang diubah format tanggalnya') ; 
    console.log(formattedDataRecord) ; 
    this._populateTransactionToForm(formattedDataRecord);

    /* INI CARA DENGAN FETCH DENGAN DATA LOKAL 

    const fetchRecords = await fetch('/data/DATA.json');
    const responseRecords = await fetchRecords.json();
    const userTransactionsHistory = responseRecords.results.transactionsHistory;
    */ 
  },

  _changeDateFormat(dataRecord) {
    const getDate = dataRecord.date.seconds ; 
    const newDate = new Date( getDate * 1000) ; 
    const formattedDate = newDate.toISOString().split('T')[0] ;   
    return {
      ...dataRecord,
      date : formattedDate
    }
  },

  _initialListener() {
    const editRecordForm = document.querySelector('#editRecordForm');
    editRecordForm.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        editRecordForm.classList.add('was-validated');
        this._sendPost();
      },
      false,
    );
  },

  async _getTransactionData(userId, transactionId) {
      try{
        const response = await Transaction.getIdTransaction(userId, transactionId) ; 
        return response ; 
      }
      catch(error) {
        console.log('Terjadi Error Saat Mengambil Data Transaksi ID : ', error) ; 
      }
  }, 

  async _sendPost() {
    const formData = await this._getFormData();

    if (this._validateFormData({ ...formData })) {
      console.log('Ini data hasil perubahannya');
      console.log(formData);
      // this._goToDashboardPage();
    } ; 

    try{
      const response = await Transaction.editTransaction(this._userID, this._transactionId, formData) ;
      window.alert('Perubahan Transaksi Telah Disimpan') ; 
    }
    catch(error) {
      console.log('Terjadi Error Saat Melakukan Update Transaksi :  ', error) ; 
    }

  },

  async _urlToBlob(url) {
    const response = await fetch(url) ; 
    return await response.blob() ; 
  }, 

  async _getFormData() {
    const nameInput = document.querySelector('#validationCustomRecordName');
    const amountInput = document.querySelector('#validationCustomAmount');
    const dateInput = document.querySelector('#validationCustomDate');
    const descriptionInput = document.querySelector('#validationCustomNotes');
    const typeInput = document.querySelector('input[name="recordType"]:checked');
    const evidenceInput = document.querySelector('#validationCustomEvidence');

    // Check apakah user merubah input gambar
    if(!evidenceInput.files[0]) {
      const urlFileImage = document.querySelector('#validationCustomEvidenceImgChange').style.backgroundImage.slice(5,-2) ; 
      try{
        const imgBlob = await this._urlToBlob(urlFileImage) ; 
        evidenceInput.files[0] = imgBlob ; 
      }
      catch(error) {
        console.log('Terjadi Error saat merubah url ke file input ', error) ; 
      }
    }

    return {
      name: nameInput.value,
      amount: Number(amountInput.value),
      date: new Date(dateInput.value),
      evidence: 'https://mekarisign.com/wp-content/uploads/2022/09/contoh-nota-debit-yang-merupakan-salah-satu-jenis-bukti-transaksi.webp' ,
      description: descriptionInput.value,
      type: typeInput.value,
    };
  },

  _populateTransactionToForm(transactionRecord = null) {
    if (!(typeof transactionRecord === 'object')) {
      throw new Error(
        `Parameter transactionRecord should be an object. The value is ${transactionRecord}`,
      );
    }

    const nameInput = document.querySelector('#validationCustomRecordName');
    const amountInput = document.querySelector('#validationCustomAmount');
    const dateInput = document.querySelector('#validationCustomDate');
    const evidencePreview = document.querySelector('#validationCustomEvidenceImgChange');
    const descriptionInput = document.querySelector('#validationCustomNotes');
    const typesInput = document.querySelectorAll('input[name="recordType"]');

    nameInput.value = transactionRecord.name;
    amountInput.value = transactionRecord.amount;
    dateInput.value = transactionRecord.date.slice(0,16);
    evidencePreview.style.backgroundImage = `url(${transactionRecord.evidenceUrl})`;
  
    console.log('Ini link gambarnya ya  ', transactionRecord.evidenceUrl)
    descriptionInput.value = transactionRecord.description;
    typesInput.forEach((item) => {
      item.checked = item.value === transactionRecord.type;
    });
  },

  _validateFormData(formData) {
    delete formData.evidence;
    const formDataFiltered = Object.values(formData).filter((item) => item === '');

    return formDataFiltered.length === 0;
  },

  _getTransactionId() {
    const searchParamEdit = new URLSearchParams(window.location.search);
    const paramsId = { 
      transactionId : searchParamEdit.get('transactionId'), 
      userId : searchParamEdit.get('userId') 
    } ; 
    return searchParamEdit.has('userId')  ? 
      paramsId
      : null;
  },

  _goToDashboardPage() {
    window.location.href = '/';
  },
};

export default Edit;
