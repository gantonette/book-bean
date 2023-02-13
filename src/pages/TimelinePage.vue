<template>
  <div class="q-pa-lg">

    <q-timeline :layout="layout" :side="side" color="secondary">
      <q-timeline-entry heading>Book Bean</q-timeline-entry>

      <template v-for="book in bookRepoList" :key="book.id">

      <q-timeline-entry class="timeline-entry"
        :title="book.name"
        :subtitle="book.author"
        side="right"
        size="large"
      >
        <div class="q-pt-lg timeline-entry-content">
          <q-img class="timeline-img" src="../assets/images/bookcover.png" />
          {{book.description}}
          <img class="timeline-img" id="myimg" />
        </div>
      </q-timeline-entry>
    </template>

    </q-timeline>

    <q-card id="q-card-input" class="relative-position q-pa-lg flex flex-center bg-light-green-3" style="width: 50%">
      <div class="col-12">
        <q-input color="green-8" v-model="booksToRead" label="book" />
        <q-input color="green-8" v-model="author" label="author"/>
        <q-input color="green-8" v-model="description" label="description">
          <input type="file" ref="fileInput"/>
          <template v-slot:append>
            <q-btn round color="green-3" icon="local_florist" :ripple="{ center: true }" @click="addItem() + uploadFile()"/>
          </template>
        </q-input>
      </div>
    </q-card>
  </div>
</template>


<script>
import { defineComponent, ref } from "vue";
import { db } from './firebase';
import { getFirestore, collection, onSnapshot, doc, deleteDoc, addDoc} from "firebase/firestore";
import { getAuth, getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import 'firebase/storage';
import { getStorage, uploadBytes, ref as firebaseRef, getDownloadURL} from "firebase/storage";

const storage = getStorage();

let bookID;


getDownloadURL(firebaseRef(storage, '/1907868.jpg'))
  .then((url) => {
    // Or inserted into an <img> element
    const img = document.getElementById('myimg');
    img.setAttribute('src', url);
  })
  .catch((error) => {
    // Handle any errors
  });


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

const bookRepo = ref();

export default defineComponent({
name: "TimelinePage",

setup() {

  // Storage
  const fileInput = ref(null);

  const uploadFile = async () => {
    if (fileInput.value) {
      const file = fileInput.value.files[0];
      const storage = getStorage();
      const storageRef = firebaseRef(storage, file.name);

      uploadBytes(storageRef, file).then((snapshot) => {
        console.log('Uploaded a file!');
      });
    }
  };

  const bookRepoList = ref([])
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      bookRepo.value = collection(db, 'users', uid, 'bookRepo');
      onSnapshot(bookRepo.value, (snapshot) => {
        bookRepoList.value = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        console.log(bookRepoList.value)
      });
    }
  });

  return {
    bookRepoList,
    layout: ref('loose'),
    side: ref('left'),

    fileInput,
    uploadFile
  }
},

  methods: {

    addItem() {
      addDoc(bookRepo.value, { name: this.booksToRead, author: this.author, description: this.description }).then((docRef) => {
        this.booksToRead = ''
        this.author = ''
        this.description = ''
        bookID = docRef.id;
        console.log("book id is: " + bookID)
      })
},
    async removeBookRepo(id) {
      if(id) {
        await deleteDoc(doc(db,'users', uid, 'bookRepo', `${id}`));
      }
    }
  }
})

</script>
