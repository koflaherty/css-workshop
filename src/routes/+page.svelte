<script lang="ts">
  import { onMount } from 'svelte';
  
  let isActive = false;
  let showMenu = false;

  function handleMouseDown() {
    isActive = true;
  }

  function handleMouseUp() {
    isActive = false;
  }

  onMount(() => {
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Show menu after 5 seconds
    setTimeout(() => {
      showMenu = true;
    }, 1000);
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });
</script>

<style>
  .crystal-ball-wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 360px;
    height: 360px;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .crystal-ball-wrapper.show-menu {
    transform: translate(-50%, calc(-50% - 100px));
  }

  .crystal-ball-rotator {
    width: 100%;
    height: 100%;
    animation: load 8s linear infinite;
  }

  .crystal-ball {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.2);
    box-shadow: 
      inset 0 0 50px #fff,
      inset 20px 0 60px #9A2C82,
      inset -20px 0 60px #42C5D3,
      inset 20px 0 300px #ee82ee,
      inset -20px 0 300px #0ff,
      0 0 5px #fff,
      -10px 0 60px #ee82ee,
      10px 0 60px #0ff;
    transition: box-shadow 0.4s ease-in-out;
  }

  .crystal-ball-wrapper.active  .crystal-ball {
    box-shadow: 
      inset 0 0 50px #fff,
      inset 20px 0 60px #9F7770,
      inset -20px 0 60px #3B9BB2,
      inset 20px 0 300px #D9C78E,
      inset -20px 0 300px #0ff,
      0 0 5px #fff,
      -5px 0 30px #ee82ee,
      5px 0 30px #B0DFE7;
  }

  /* Static reflection overlay */
  .crystal-ball-reflection {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: linear-gradient(
      315deg,
      rgba(255, 255, 255, 0) 0%,
      transparent 50%,
      rgba(255, 255, 255, 0.4) 100%
    );
    pointer-events: none;
    filter: blur(10px);
  }

  .crystal-ball-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.4);
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
    transition: filter 0.3s ease-in-out;
    user-select: none;
  }

  .crystal-ball-wrapper.active .crystal-ball-text {
    filter: blur(36px);
    color: rgba(255, 255, 255, 0.6);
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
  }

  .crystal-ball-menu {
    position: absolute;
    bottom: -80px;
    left: 0;
    right: 0;
    color: #fff;
    text-align: center;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
    user-select: none;
  }

  .crystal-ball-menu.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .menu-button {
   color: #fff;
  }

  @keyframes load {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(120deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>

<div class="crystal-ball-wrapper" class:active={isActive || showMenu} class:show-menu={showMenu}>
  <div class="crystal-ball-rotator">
    <div class="crystal-ball" />
  </div>
  <div class="crystal-ball-text">CSS Workshop</div>
  <div class="crystal-ball-reflection" />
  <div class="crystal-ball-menu" class:visible={showMenu}>
    <div class="menu-button">Begin</div>
  </div>
</div>
