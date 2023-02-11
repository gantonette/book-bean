<template>
  <h1 class="title">Sign In!</h1>
  <div class="input-container">
    <p><input type="text" placeholder="Email" v-model="email" class="input" /></p>
    <p><input type="password" placeholder="Password" v-model="password" class="input" /></p>
    <p v-if="errMsg" class="error-message">{{ errMsg }}</p>
  </div>
  <div class="button-container">
    <p><button @click="signIn" class="submit-button">Submit</button></p>
    <p><button @click="signInWithGoogle" class="google-button">Sign In With Google</button></p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "vue-router";
import router from "src/router/routes";

const email = ref("");
const password = ref("");
const errMsg = ref("");
const { push } = useRouter();


const signIn = () => {
  signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
      console.log("Successfully Signed In!");
      push("/timelinePage");
    })
    .catch((error) => {
      console.log(error.code);
      switch (error.code) {
        case 'auth/invalid-email':
          errMsg.value = 'Invalid Email';
          break;
        case 'auth/user-disabled':
          errMsg.value = 'User Disabled';
          break;
        case 'auth/user-not-found':
          errMsg.value = 'User Not Found';
          break;
        case 'auth/wrong-password':
          errMsg.value = 'Wrong Password';
          break;
        default:
          errMsg.value = 'Unknown Error';
      }
    })
};

const signInWithGoogle = () => {

};

</script>
