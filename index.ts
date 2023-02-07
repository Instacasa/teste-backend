import dotenv from 'dotenv';
dotenv.config();
import Application from '@/app';



(async () => {
  try {
    const app = new Application();
    await app.start();
  } catch(error) {
    console.error(error);
    process.exit();
  }
})();