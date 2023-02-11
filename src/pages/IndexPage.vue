<template>
  <q-page class="flex flex-center bg-green-1">

    <q-card class="my-card q-py-md" style="width: 600px">

      <q-card-section>
        <div class="text-overline text-center text-teal-9">welcome to book bean!</div>
      </q-card-section>

      <q-card-section>
        <div class="text-h4 text-center text-teal-5 text-italic">book bean</div>
        <div class="text-overline text-center text-green-5">add books to read. add it to your repo by clicking the sprout! </div>
      </q-card-section>

      <q-card-section>
        <div class="row-justify-center">
          <div class="col-12">
            <q-input color="green-5" v-model="booksToRead" label="book" >
            <q-input color="green-5" v-model="author" label="author"/>
              <template v-slot:append>
                <q-btn round color="secondary" icon="local_florist" :ripple="{ center: true }" @click="addItem"/>
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row justify-center" v-for="book in bookList" :key="book.id">
          <div class="col-8 q-py-md">
            <p class="text-h6 text-teal-9">{{ book.name }}</p>
            <p class="text-caption">{{ book.author }}</p>
          </div>
          <div class="col-auto q-py-md">
            <q-btn padding="xs" color="primary" round icon="eco" @click="addToRepo(book.id, book.name, book.author)" />
            <q-btn round color="secondary" :ripple="{ center: true }" @click="removeBook(book.id)">bye</q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
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


// collection reference
const colRef = ref();
const bookRepo = ref();

export default defineComponent({
  name: "IndexPage",

  setup() {
    const bookList = ref([])
    const bookRepoList = ref([])
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        bookRepo.value = collection(db, 'users', uid, 'bookRepo');
        bookList.value = collection(db, 'users', uid, 'bookList');
        onSnapshot(bookRepo.value, (snapshot) => {
          bookRepoList.value = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        });
        onSnapshot(bookList.value, (snapshot) => {
          bookList.value = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        });
      }
    });

    return {
      bookRepoList,
      bookList
    }
  },

  methods: {
    addItem() {
      addDoc(colRef, { name: this.booksToRead, author: this.author }).then(() => {
        this.booksToRead = ''
        this.author = ''
      })
    },
    async addToRepo(id, book, name) {
      if (id) {
        console.log(book, name)
        // Add the item to the bookRepo collection
        addDoc(bookRepo, { name: book, author: name })
        console.log(bookRepo.value)
        // Remove the item from the bookList collection
        await deleteDoc(doc(db, `bookList/${id}`));
      } else {
        console.log('Invalid id')
      }
    },
    async removeBook(id) {
      if(id) {
        await deleteDoc(doc(db, `bookList/${id}`));
      }
    }
  }
})
</script>
