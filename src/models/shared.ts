import { db } from "../firebase/firebase";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  setDoc,
  orderBy,
} from "firebase/firestore";

class UserAccount {
  static collection = collection(db, "users");

  // list of a users retrieved from database
  static users: UserAccount[] = [];

  // attributes
  private _docId: string | null;
  private _userUuid: string | null;
  private _username: string | null;
  private _difficulty: string | null = null;
  private _board: string | null; // board configuration as json string
  private _wordsFound: string | null;
  private _wordsToFind: string | null;
  private _timeElapsed: number | null;
  private _wordScore: number | null;
  private _mathScore: number | null;
  private _userAvatar: string | null;

  // private _wordsFound: string[]; // can remove this if not needed

  // constructor
  constructor(userUuid: string | null = null) {
    this._userUuid = userUuid;
    this._username = "unknown";
    this._board = "";
    this._wordsFound = ""; // can remove this if not needed
    this._wordsToFind = "";
    this._timeElapsed = 0;
    this._wordScore = 0;
    this._mathScore = 0;
    this._userAvatar = "male";


  }

  // getters
  get docId() {
    return this._docId;
  }
  get userUuid() {
    return this._userUuid;
  }
  get board() {
    return this._board;
  }
  get wordsFound() {
    return this._wordsFound;
  }
  get difficulty() {
    return this._difficulty;
  }
  get wordsToFind() {
    return this._wordsToFind;
  }
  get timeElapsed() {
    return this._timeElapsed;
  }
  get username() {
    return this._username;
  }

  get mathScore(){
    return this._mathScore
  }

  get wordScore(){
    return this._wordScore
  }

  get userAvatar(){
    return this._userAvatar
  }


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
    this._wordsToFind = words;
  }

  set timeElapsed(time) {
    this._timeElapsed = time;
  }
  set difficulty(value) {
    this._difficulty = value;
  }

  set username(username) {
    this._username = username;
  }

  set mathScore(score){
    this._mathScore = score
  }

  set wordScore(score){
    this._wordScore = score
  }

  set userAvatar(userAvatar){
    this._userAvatar = userAvatar
  }


  // To recreate an instance of User ( since data retrieved from database is in json -> convert the json back into a User instance )
  fromData(docId, data) {
    this._docId = docId;
    this._userUuid = data["userUuid"];
    this._board = data["board"] || "";
    this._wordsFound = data["wordsFound"] || "";
    this._wordsToFind = data["wordsToFind"] || "";
    this._timeElapsed = data["timeElapsed"] || 0;
    this._username = data["username"];
    this._mathScore = data["mathScore"] || 0;
    this._wordScore = data["wordScore"] || 0;
    this._userAvatar = data["userAvatar"]
  }

  // CRUD operations

  // GET COLLECTION OF ACCOUNTS
  static async getCollection(): Promise<UserAccount[]> {
    // Retrieve collection from database
    const querySnapshot = await getDocs(UserAccount.collection);

    // create new empty array
    UserAccount.users = [];

    querySnapshot.forEach((doc) => {
      // data
      const data = doc.data();

      // Recreate instance of User using json retrieved from database
      const user = new UserAccount(null);
      user.fromData(doc.id, data);

      // push to the array
      UserAccount.users.push(user);
    });

    return UserAccount.users;
  }

  // GET USER ACCOUNT FROM UID
  static async getUserByUuid(userUuid: string): Promise<UserAccount> {
    // Query Firestore to find the document with the matching userUuid
    const querySnapshot = await getDocs(
      query(UserAccount.collection, where("userUuid", "==", userUuid))
    );

    if (querySnapshot.empty) {
      throw new Error("Cannot find userUuid");
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
        username: user.username,
        mathScore : user.mathScore,
        wordScore : user.wordScore,
        userAvatar : user.userAvatar

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
      console.log(user.board);
      console.log(user.wordsToFind);
      console.log(user.wordsFound);
      await updateDoc(userRef, {
        board: user.board,
        wordsFound: user.wordsFound,
        wordsToFind: user.wordsToFind,
        timeElapsed: user.timeElapsed,
      });
    } else {
      throw new Error("Cannot update user without a userUuid");
    }
  }

  static async updateUserName(user: UserAccount, newUsername: string): Promise<void> {
    if (user.docId) {
      const oldUserRef = doc(UserAccount.collection, user.docId);
      
      const oldDocSnapshot = await getDoc(oldUserRef);
  
      if (!oldDocSnapshot.exists()) {
        throw new Error("Document not found");
      }
  
      const oldData = oldDocSnapshot.data();
  
      oldData.username = newUsername;
  
      const newUserRef = doc(UserAccount.collection, newUsername);
      
      await setDoc(newUserRef, oldData);
  
      await deleteDoc(oldUserRef);
  
      user.docId = newUsername;
    } else {
      throw new Error("Cannot update user without a userUuid");
    }
  }

  static async changeAvatar(avatar : String , user: UserAccount): Promise<boolean> {
    try {
      // Reference to the user document
      const userRef = doc(UserAccount.collection, user.docId);

      // Update the avatar field
      await updateDoc(userRef, {
        userAvatar: avatar
      });

      console.log('Avatar updated successfully.');
      return true
    } catch (error) {
      console.error('Error updating avatar:', error);
      return false
    }
  }

  // DELETE
  static async deleteUser(user: UserAccount): Promise<void> {
    if (user.docId) {
    const userRef = doc(UserAccount.collection, user.docId);
    await deleteDoc(userRef);
    }
  }

  // Store difficulty selection
  static async storeDifficulty(
    userUuid: string | undefined,
    difficulty: string
  ): Promise<void> {
    const user = UserAccount.users.find((u) => u.userUuid === userUuid);
    if (user) {
      user.difficulty = difficulty;
      await UserAccount.updateUser(user);
    } else {
      // const newUser = new UserAccount(userUuid);
      // newUser.difficulty = difficulty;
      // await UserAccount.addUser(newUser);
      console.log("Error.");
    }
  }

  // // Static method to get user UUID
  // static getUserUuid(): string {
  //     // Your logic to get the user UUID
  //     return "unique-user-identifier"; // Replace with the actual logic to retrieve user UUID
  // }

  // Method to get user's rank based on their score among all users
  static async getUserRank(userUuid: string, puzzleType: string = "word"):  Promise<{ rank: number | null, sortedUsers: UserAccount[] } | null> {
    try {
      let q;
      
      if (puzzleType === "overall") {
        // For overall rank, retrieve all users and calculate total scores
        const allUsersQuery = query(this.collection);
        const querySnapshot = await getDocs(allUsersQuery);

        // Extract user data from querySnapshot
        const users: { user: UserAccount; totalScore: number }[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const user = new UserAccount(doc.id);
          user.fromData(doc.id, data);
          
          if (user.mathScore != null || user.wordScore !== null ){
            // Calculate the total score for overall ranking
              const totalScore = (user.mathScore ?? 0) + (user.wordScore ?? 0);
            users.push({ user, totalScore });
          }
          
        });
        

        // Sort users by total score in descending order
        users.sort((a, b) => b.totalScore - a.totalScore);

        // Find the user with the specified userUuid and determine their rank
        const userIndex = users.findIndex(({ user }) => user._userUuid === userUuid);

        const sortedUsers = users.map(({ user }) => user);

        const rank = userIndex === -1 ? null : userIndex + 1;

        // Return the rank (1-based index)
        return { rank, sortedUsers };

        
      } else {
        // For individual puzzle types (math or word), retrieve and sort accordingly
        q = query(this.collection, orderBy(`${puzzleType}Score`, "desc"));
        const querySnapshot = await getDocs(q);

        // Extract user data from querySnapshot
        const users: UserAccount[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const user = new UserAccount(null);
          user.fromData(doc.id, data);
          users.push(user);
        });

        // Find the user with the specified userUuid and determine their rank
        const userIndex = users.findIndex(user => user._userUuid === userUuid);

        const rank = userIndex === -1 ? null : userIndex + 1;
        const sortedUsers = users; // Users are already sorted by the query
        // Return the rank (1-based index)
        return { rank, sortedUsers };
      }
    } catch (error) {
      console.error("Error retrieving user rank:", error);
      return null;
    }
  }

}

export { UserAccount };
