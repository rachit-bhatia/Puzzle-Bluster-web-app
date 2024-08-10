import { db } from "../firebase/firebase";
import {addDoc,collection,getDocs,updateDoc,deleteDoc,doc, query, where, setDoc} from 'firebase/firestore'

class UserAccount {

    static collection = collection(db,"users")

    // list of a users retrieved from database
    static users : UserAccount[] = []


    // attributes 
    private _docId : string | null ;
    private _userUuid: string | null;
    private _username: string | null;
    private _difficulty: string | null = null;
    private _board: string | null; // board configuration as json string
    private _wordsFound: string | null; 
    private _wordsToFind: string | null;
    private _timeElapsed: number | null;
    // private _wordsFound: string[]; // can remove this if not needed
    

    // constructor 
    constructor(userUuid: string | null = null) {
        this._userUuid = userUuid;
        this._username = "unknown"
        this._board = "";
        this._wordsFound = ""; // can remove this if not needed
        this._wordsToFind = "";
        this._timeElapsed = 0;

    }

    // getters
    get docId() {return this._docId}
    get userUuid() {return this._userUuid}
    get board() {return this._board}
    get wordsFound() {return this._wordsFound}
    get difficulty() { return this._difficulty; }
    get wordsToFind() {return this._wordsToFind}
    get timeElapsed() {return this._timeElapsed}
    get username(){return this._username}

    // Setters

    set docId(value) {
        this._docId = value;
    }
    set userUuid(value) {
        this._userUuid = value;
    }

    set board(board) {
        this._board = board;
    }

    set wordsFound(words) {
        this._wordsFound = words;
    }

    set wordsToFind(words) {
        this._wordsToFind = words
    }

    set timeElapsed(time) {
        this._timeElapsed = time;
    }
    set difficulty(value) { this._difficulty = value; }

    set username(username){
        this._username  = username
    }


    // To recreate an instance of User ( since data retrieved from database is in json -> convert the json back into a User instance )
    fromData(docId,data){
        this._docId = docId
        this._userUuid = data["userUuid"]
        this._board = data["board"] || ""
        this._wordsFound = data["wordsFound"]  || ""
        this._wordsToFind = data["wordsToFind"] || ""
        this._timeElapsed = data["timeElapsed"] || 0
        this._username = data["username"]
    }
    
    // CRUD operations 

    // GET COLLECTION OF ACCOUNTS
    static async getCollection(): Promise<UserAccount[]> {
        // Retrieve collection from database
        const querySnapshot = await getDocs(UserAccount.collection);

        // create new empty array 
        UserAccount.users = [];

        querySnapshot.forEach(doc => {

            // data
            const data = doc.data();
            
            // Recreate instance of User using json retrieved from database
            const user = new UserAccount(null);
            user.fromData(doc.id,data)

            // push to the array 
            UserAccount.users.push(user);
        });
       
        return UserAccount.users;
    }

    // GET USER ACCOUNT FROM UID
    static async getUserByUuid(userUuid: string): Promise<UserAccount> {
        // Query Firestore to find the document with the matching userUuid
        const querySnapshot = await getDocs(query(UserAccount.collection, where("userUuid", "==", userUuid)));
    
        if (querySnapshot.empty) {
            throw new Error("Cannot find userUuid")
        }
    
        // Assuming userUuid is unique, there should be only one document
        const doc = querySnapshot.docs[0];
    
        // Create a new UserAccount instance
        const user = new UserAccount();
    
        // Populate the UserAccount instance with data from the document
        user.fromData(doc.id, doc.data());
        return user;
    }

    // POST
    // static async addUser(user: UserAccount): Promise<void> {
    //     const docRef = await addDoc(UserAccount.collection, {

    //         userUuid: user.userUuid,
    //         board: user.board,
    //         wordsFound: user.wordsFound,
    //         wordsToFind: user.wordsToFind,
    //         timeElapsed: user.timeElapsed,
    //         username : user.username
    //     });
    // }
    static async addUser(user: UserAccount): Promise<void> {
        if (user.username) {
            // Use the email as the document ID
            const emailAsDocId = user.username;
            
            await setDoc(doc(UserAccount.collection, emailAsDocId), {
                userUuid: user.userUuid,
                board: user.board,
                wordsFound: user.wordsFound,
                wordsToFind: user.wordsToFind,
                timeElapsed: user.timeElapsed,
                username: user.username
            });
        } else {
            throw new Error("Username (email) is required to create a document.");
        }
    }
    // UPDATE
    static async updateUser(user: UserAccount): Promise<void> {
        // if doc id exists
        if (user.docId) {
            const userRef = doc(UserAccount.collection, user.docId);
            console.log(user.board)
            console.log(user.wordsToFind)
            console.log(user.wordsFound)
            await updateDoc(userRef, {
                board: user.board,
                wordsFound: user.wordsFound,
                wordsToFind: user.wordsToFind,
                timeElapsed: user.timeElapsed
            });
        } else {
            throw new Error("Cannot update user without a userUuid");
        }
    }

    // DELETE
    static async deleteUser(docId: string): Promise<void> {
        const userRef = doc(UserAccount.collection, docId);
        await deleteDoc(userRef);
    }

    // Store difficulty selection
    static async storeDifficulty(userUuid: string | undefined  , difficulty: string): Promise<void> {
        const user = UserAccount.users.find(u => u.userUuid === userUuid);
        if (user) {
            user.difficulty = difficulty;
            await UserAccount.updateUser(user);
        } else {
            // const newUser = new UserAccount(userUuid);
            // newUser.difficulty = difficulty;
            // await UserAccount.addUser(newUser);
            console.log("Error.")
        }
    }

    // // Static method to get user UUID
    // static getUserUuid(): string {
    //     // Your logic to get the user UUID
    //     return "unique-user-identifier"; // Replace with the actual logic to retrieve user UUID
    // }



}


export {UserAccount}
