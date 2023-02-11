<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="text-green-8">
          Book Bean
        </q-toolbar-title>
      </q-toolbar>

    <div class="q-horizontal-nav" id="vertical-nav">
      <q-btn to="/#" v-if="isLoggedIn">Home</q-btn>
      <q-btn to="/bookRepo" v-if="isLoggedIn">Book Repo</q-btn>
      <q-btn to="/TimelinePage" v-if="isLoggedIn">Timeline</q-btn>
      <q-btn to="/register" v-if="!isLoggedIn">Register</q-btn>
      <q-btn to="/signIn" v-if="!isLoggedIn">Sign In</q-btn>
      <button @click="handleSignOut" v-if="isLoggedIn">Sign Out</button>
     </div>
</q-header>

<!-- dont delete very important -->
<q-page-container>
  <router-view />
</q-page-container>
 <!-- dont delete very important -->

</q-layout>
</template>
<script setup>

import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { onMounted } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const isLoggedIn = ref(false);
const router = useRouter();

let auth;
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  });
});

const handleSignOut = () => {
  signOut(auth).then(() => {
    console.log("Signed Out");
    router.push("/signIn");
  }).catch((error) => {
    console.log(error.code);
    console.log(error.message);
  });
};

const linksList = []
</script>
