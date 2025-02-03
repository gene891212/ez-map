import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC_EIhWeQn4dfNfS6kk5PwiMUt8JRkKGZ4",
    authDomain: "eden-map-802c4.firebaseapp.com",
    databaseURL: "https://eden-map-802c4-default-rtdb.firebaseio.com",
    projectId: "eden-map-802c4",
    storageBucket: "eden-map-802c4.firebasestorage.app",
    messagingSenderId: "567721919417",
    appId: "1:567721919417:web:99467bf3dc9709525c6c68"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化 Realtime Database
const database = getDatabase(app);

const auth = getAuth();

export { database, auth };
