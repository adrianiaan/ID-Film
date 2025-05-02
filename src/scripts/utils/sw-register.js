// src/scripts/utils/sw-register.js
const swRegister = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('./sw.js');
        console.log('Service worker registered with scope:', registration.scope);
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    } else {
      console.log('Service workers are not supported in this browser');
    }
  };
  
  export default swRegister;