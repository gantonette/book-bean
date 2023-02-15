<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="text-green-8">
          Book Bean
        </q-toolbar-title>
      </q-toolbar>

      <div class="q-horizontal-nav q-gutter-sm text-center" id="vertical-nav" style="border: none;">
        <q-btn to="/#" v-if="isLoggedIn" class="text-green-8">Home</q-btn>
        <q-btn to="/bookRepo" v-if="isLoggedIn" class="text-green-8">Book Repo</q-btn>
        <q-btn to="/TimelinePage" v-if="isLoggedIn" class="text-green-8">Timeline</q-btn>
        <q-btn to="/register" v-if="!isLoggedIn" class="text-green-8">Register</q-btn>
        <q-btn to="/signIn" v-if="!isLoggedIn" class="text-green-8">Sign In</q-btn>
        <button @click="handleSignOut" v-if="isLoggedIn" class="text-red-8" style="float:right;">Sign Out</button>
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
