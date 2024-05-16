import { db } from "../firebase/firebase";
import {addDoc,collection,getDocs,updateDoc,deleteDoc,doc} from 'firebase/firestore'

class User {

    static collection = collection(db,"users")

    // list of a users 
    static users : User[] = []


    // attributes 
    private _docId : string | null ;
    private _userUuid: string | null;
    private _wordsFound: string[]; // can remove this if not needed
    

    // constructor 
    constructor(userUuid: string | null = null) {
        this._docId = "test"
        this._userUuid = userUuid;
        this._wordsFound = []; // can remove this if not needed

    }

    // getters
    get docId() {return this._docId}
    get userUuid() {return this._userUuid}
    get wordsFound() {return this._wordsFound}
    


    // Setters

    set docId(value) {
        this._docId = value;
    }
    set userUuid(value) {
        this._userUuid = value;
    }

    set wordsFound(words) {
        if (Array.isArray(words)) {
            this._wordsFound = words;
        } else {
            throw new Error("wordsFound must be an array");
        }
    }

    // To recreate an instance of User ( since data retrieved from database is in json -> convert the json back into a User instance )
    fromData(docId,data){
        this._docId = docId
        this._userUuid = data["userUuid"]
        this._wordsFound = data["wordsFound"]  || []
    }
    
    // CRUD operations 

    // GET
    static async getCollection(): Promise<User[]> {
        // Retrieve collection from database
        const querySnapshot = await getDocs(User.collection);

        // create new empty array 
        User.users = [];
        querySnapshot.forEach(doc => {

            // data
            const data = doc.data();
            
            // Recreate instance of User using json retrieved from database
            const user = new User();
            user.fromData(doc.id,data)

            // push to the array 
            User.users.push(user);
        });

        return User.users;
    }

    // POST
    static async addUser(user: User): Promise<void> {
        const docRef = await addDoc(User.collection, {
            userUuid: user.userUuid,
            wordsFound: user.wordsFound,
        });
    }

    // UPDATE
    static async updateUser(user: User): Promise<void> {
        // if doc id exists
        if (user.docId) {
            const userRef = doc(User.collection, user.docId);
            await updateDoc(userRef, {
                wordsFound: user.wordsFound,
            });
        } else {
            throw new Error("Cannot update user without a userUuid");
        }
    }

    // DELETE
    static async deleteUser(docId: string): Promise<void> {
        const userRef = doc(User.collection, docId);
        await deleteDoc(userRef);
    }

    



}


export {User}