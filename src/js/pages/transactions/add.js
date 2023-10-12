import Transaction from "../../network/transactions";
import CheckUserAuth from "../auth/check-user-auth";
import Login from "../auth/login";

const Add = {
  async init() {
    CheckUserAuth.checkLoginState() ; 
    this._initialUI();
    const userId = await Login._cekCurrentUser() ;
    // console.log('Sedang menambahkan data untuk user id : ' ,userId) ; 
    this._initialListener(userId);
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

    const inputRadioTransactionTypeAdd = document.querySelector('#inputRadioTransactionTypeAdd');
    inputRadioTransactionTypeAdd.setAttribute(
      'listRadio',
      JSON.stringify(listInputRadioTransactionType),
    );
  },

    _initialListener(userId) {
    const addFormRecord = document.querySelector('#addRecordForm');
    addFormRecord.addEventListener(
      'submit',
      async (event) => {
        event.preventDefault();
        event.stopPropagation();

        addFormRecord.classList.add('was-validated');
        await this._sendPost(userId);
        // this._refreshPage() ; 
      },
      false,
    );
  },

  _refreshPage() {
    window.location.href = '/transactions/add.html' ; 
  }, 

  async _sendPost(userId) {
    const formData = this._getFormData();

    if (this._validateFormData({ ...formData })) {
      console.log('Ini hasil generate formData di halaman add');
      console.log(formData);

      // this._goToDashboardPage();
      try{
        const uploadFile = await Transaction.uploadFile(formData.evidence) ; 
        const fileUrl = await Transaction.getFileUrl(uploadFile.ref) ; 
        const uploadDatabase = await Transaction.addTransaction(userId,{
          ...formData, 
          evidence : fileUrl,
        }) ;
        window.alert('Berhasil Menambahkan Transaksi Baru') ;  
      }
      catch(error) {
        console.log('Terjadi Error Saat Menambahkan Data', error) ; 
      }
    }
  },

  _getFormData() {
    const nameInput = document.querySelector('#validationCustomRecordName');
    const amountInput = document.querySelector('#validationCustomAmount');
    const dateInput = document.querySelector('#validationCustomDate');
    const evidenceInput = document.querySelector('#validationCustomEvidence');
    const descriptionInput = document.querySelector('#validationCustomNotes');
    const typeInput = document.querySelector('input[name="recordType"]:checked');

    return {
      name: nameInput.value,
      amount: Number(amountInput.value),
      date: new Date(dateInput.value),
      evidence: evidenceInput.files[0] ,
      description: descriptionInput.value,
      type: typeInput.value,
    };
  },

  

  _validateFormData(formData) {
    const formDataFiltered = Object.values(formData).filter((item) => item === '');
    return formDataFiltered.length === 0;
  },

  _goToDashboardPage() {
    window.location.href = '/';
  },
};

export default Add;
