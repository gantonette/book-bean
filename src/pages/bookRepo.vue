<!------------------- BOOK REPOSITORY --------------------->
<template>
<q-page class="flex flex-center bg-green-1">
  <div>

    <h1 class="text-center text-green-9">book repository</h1>
    <h6 class="text-overline text-center text-green-8 bg-green-1">books that have been read are stored here!</h6>



    <div class="bookRepo-cards center" v-for="book in bookRepoList" :key="book.id">
      <q-card class="my-card">
        <q-img class="repo-img" :src='book.imgURL'>
          <div class="absolute-bottom">
            <div class="text-h6"><p>{{ book.name }}</p></div>
            <div class="text-overline"><p>{{ book.author }}</p></div>
          </div>
        </q-img>
        <q-card-actions>
          <q-btn flat class="text-overline" @click="removeBookRepo(book.id)">remove</q-btn>
          <q-btn flat round color="green-9" icon="favorite" />
        </q-card-actions>
      </q-card>
    </div>

  </div>
</q-page>

</template>

<script>
import { defineComponent, ref } from "vue";
import { db } from './firebase';
import { getFirestore, collection, onSnapshot, doc, deleteDoc, addDoc} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";


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
name: "bookRepo",

setup() {

  const bookRepoList = ref([])
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      bookRepo.value = collection(db, 'users', uid, 'bookRepo');
      onSnapshot(bookRepo.value, (snapshot) => {
        bookRepoList.value = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      });
    }
  });

  return {
    bookRepoList
  }
},

  methods: {
    addItem() {
      addDoc(bookRepo.value, { name: this.booksToRead, author: this.author }).then(() => {
        this.booksToRead = ''
        this.author = ''
      })
    },
    async removeBookRepo(id) {
      if(id) {
        console.log('removing book: ' + id)
        await deleteDoc(doc(db,'users', uid, 'bookRepo', `${id}`));

      }
    }
  }
})

</script>

