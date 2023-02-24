<template>
  <div class="q-pa-lg flex flex-center bg-green-1">
    <q-timeline :layout="layout" :side="side" color="secondary">
      <h1 class="text-center text-green-9">book bean</h1>
      <img src="../assets/images/timeline-cover.png" alt="Book Bean Logo" class="book-bean-logo"/>
      <h6 class="text-overline text-center text-green-8 bg-green-1">snap a photo & grow ur library</h6>
      <q-btn class="text-overline text-center text-green-8 bg-green-1" label="Add Book" color="primary" @click="showDialog = true" />


      <template v-for="book in bookRepoList" :key="book.id">
        <q-timeline-entry
          class="custom-timeline-entry"
          :title="book.name"
          :subtitle="new Date(book.timestamp).toLocaleString('en-us', {day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric', second: 'numeric'})"
          side="right"
          size="large"
        >
          <div class="timeline-content">
            <h6 class="text-overline text-center text-green-8 bg-green-1">{{ book.author }}</h6>
              <img class="timeline-img" :src="book.imgURL" alt="Book cover"/>
            <div class="timeline-description">
              {{ book.description }}
            </div>
          </div>
        </q-timeline-entry>
      </template>

  </q-timeline>

    <q-dialog v-model="showDialog">
    <q-card id="q-card-input" class="relative-position q-pa-lg flex flex-center bg-light-green-3" style="width: 50%">
      <div class="col-12">
        <q-input color="green-8" v-model="booksToRead" label="book" />
        <q-input color="green-8" v-model="author" label="author"/>
        <q-input color="green-8" v-model="description" label="description">
          <input type="file" ref="fileInput"/>
          <template v-slot:append>
            <q-btn round color="green-3" icon="local_florist" :ripple="{ center: true }" @click="addItem() + uploadFile()"/>
            <q-btn label="Add Existing Book" color="primary" @click="showBookRepoDialog = true" />

          </template>
        </q-input>
      </div>
    </q-card>
  </q-dialog>

  <!-- opens users book repository to select existing book -->
  <q-dialog v-model="showBookRepoDialog">
  <q-card>
    <q-list dense>
      <q-item v-for="book in bookRepoList" :key="book.id" clickable @click="selectedBook = book">
        <q-item-section>{{ book.name }}</q-item-section>
        <q-item-section side>
          <q-btn icon="add" color="primary" @click="addExistingBook(book.id)" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</q-dialog>


  </div>
</template>


<script>
import { defineComponent, ref } from "vue";
import { db } from './firebase';
import { getFirestore, collection, onSnapshot, doc, deleteDoc, addDoc, updateDoc} from "firebase/firestore";
import { getAuth, getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import 'firebase/storage';
import { getStorage, uploadBytes, ref as firebaseRef, getDownloadURL, getMetadata, updateMetadata } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';


// Authentication
const auth = getAuth();
const user = ref(auth.currentUser);
let uid;

onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    console.log('this is the user: ' + uid)
    user.value = uid;
  } else {
    console.log('no user');
  }
});

// Storage
const bookRepo = ref();

export default defineComponent({
name: "TimelinePage",

// ********** DATA **********
setup() {
  // For the popup dialog
  const showDialog = ref(false);
  const showBookRepoDialog = ref(false);
  const selectedBook = ref(null);


  // Storage
  const fileInput = ref(null);
    const uploadFile = async () => {
      const file = fileInput.value.files[0];

      if (!file) {
        return null;
      }

      const storage = getStorage();
      const storageRef = firebaseRef(storage, file.name);

      try {
        // Upload the file
        await uploadBytes(storageRef, file);

        // Get the download URL and return it
        const downloadURL = await getDownloadURL(storageRef);
        console.log('File uploaded successfully: ', downloadURL);
        return downloadURL;
      } catch (error) {
        console.error('Error uploading file: ', error);
        return null;
      }

  };


// BookRepo
const bookRepoList = ref([]);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      bookRepo.value = collection(db, 'users', uid, 'bookRepo');
      onSnapshot(bookRepo.value, (snapshot) => {
        bookRepoList.value = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        bookRepoList.value.sort((a, b) => b.timestamp - a.timestamp); // Sort by descending timestamp
      });
    }
  });

  const booksToRead = ref('');
  const author = ref('');
  const description = ref('');

  return {
    bookRepoList,
    layout: ref('loose'),
    side: ref('left'),

    fileInput,
    uploadFile,

    // New book properties
    booksToRead,
    author,
    description,

    showDialog,
    showBookRepoDialog,
  };
},

// ********** METHODS **********
  methods: {

    async addItem() {
      const book = {
        name: this.booksToRead,
        author: this.author,
        description: this.description,
        imgURL: null,
        timestamp: Date.now(), // Add timestamp
      };

      // Add the book to Firestore
      addDoc(bookRepo.value, book).then(async (docRef) => {
        console.log('Document written with ID: ' + docRef.id);

        // Update the imgURL field with the URL returned by uploadFile()
        const imgURL = await this.uploadFile();
        await updateDoc(doc(bookRepo.value, docRef.id), { imgURL });
      });
    },


    async addExistingBook(id) {
      console.log("this is the book: " + id);

      const book = {
        name: this.booksToRead,
        author: this.author,
        description: this.description,
        imgURL: null,
        timestamp: Date.now(), // Add timestamp
      };

      // Add the book to Firestore
      if (id) {
        const docRef = await addDoc(collection(bookRepo.value, id, "timelineEntries"), book);
        console.log('Document written with ID: ' + docRef.id);

        // Update the imgURL field with the URL returned by uploadFile()
        const imgURL = await this.uploadFile();
        await updateDoc(doc(collection(bookRepo.value, id, "timelineEntries"), docRef.id), { imgURL });
      } else {
        console.error("id value is empty");
      }
    },



  }
})

</script>
