<template>
  <div class="q-px-lg q-pb-md">
    <q-timeline :layout="layout" color="secondary">
      <q-timeline-entry heading>
        Timeline heading
        <br>
        ({{$q.screen.lt.sm ? 'Dense' : ($q.screen.lt.md ? 'Comfortable' : 'Loose')}} layout)
      </q-timeline-entry>

      <q-timeline-entry
        title="Book Name"
        subtitle="Publication Date"
        side="left"
      >
        <div>
          Description of the book and its content.
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Another Book Name"
        subtitle="Publication Date"
        side="right"
        icon="delete"
      >
        <div>
          Description of the book and its content.
        </div>
      </q-timeline-entry>

      <!-- Repeat the above structure for as many books as needed -->
    </q-timeline>
  </div>
</template>


<script>

import { defineComponent, ref } from "vue";
import { db } from './firebase';
import { getFirestore, collection, onSnapshot, doc, deleteDoc, addDoc} from "firebase/firestore";

const bookRepo = collection(db, 'bookRepo')

export default defineComponent ({
  name: 'TimelinePage',
  setup() {
    const bookRepoList = ref([])
    onSnapshot(bookRepo, (snapshot) => {
      bookRepoList.value = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    })
    return {
      bookRepoList
    }
  }
})

</script>
