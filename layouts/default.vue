<template>
  <div class="container">
    <header class="header">
      <ul class="header-list">
        <li>
          <NuxtLink to="/">Home</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/about">About</NuxtLink>
        </li>
      </ul>
    </header>
    <main class="main">
      <slot />
    </main>
    <footer class="footer">
      <p>Copyright 2025</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
   
</script>
<style scoped lang="scss">
:global(html, body) {
  margin: 0; /* or whatever you need */
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;
  box-sizing: border-box;
  position: relative;
  .header {
    width: 100%;
    height: 100px;
    background-color: #f0f0f0;
    color: #000;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

    .header-list {
      display: flex;
      align-items: center;
      justify-content: center;
      list-style: none;
      padding: 0;
      margin: 0;
      text-decoration: none !important;
      text-transform: uppercase;
      li {
        margin-right: 20px;
      }
    }
  }
  .main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    background-color: #f0f0f0;
    color: #000;
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100px;
    background-color: #f0f0f0;
    color: #000;
  }

}
</style>