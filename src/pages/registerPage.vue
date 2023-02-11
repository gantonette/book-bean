<template>
  <h1 class="title">Create an Account!</h1>
  <div class="input-container">
    <p><input type="text" placeholder="Email" v-model="email" class="input" /></p>
    <p><input type="password" placeholder="Password" v-model="password" class="input" /></p>
    <p v-if="errMsg" class="error-message">{{ errMsg }}</p>
  </div>
  <div class="button-container">
    <p><button @click="register" class="submit-button">Submit</button></p>
    <p><button @click="signInWithGoogle" class="google-button">Sign In With Google</button></p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "vue-router";
import router from "src/router";

const email = ref("");
const password = ref("");
const errMsg = ref("");
const { push } = useRouter();

const register = () => {
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
      console.log("Successfully Registered!");
      push("/timelinePage");
    })
    .catch((error) => {
      console.log(error.code);
      switch (error.code) {
        case 'auth/email-already-in-use':
          errMsg.value = 'Email Already In Use';
          break;
        case 'auth/invalid-email':
          errMsg.value = 'Invalid Email';
          break;
        case 'auth/weak-password':
          errMsg.value = 'Weak Password';
          break;
        default:
          errMsg.value = 'Unknown Error';
      }
    })
};

const signInWithGoogle = () => {

};


</script>
