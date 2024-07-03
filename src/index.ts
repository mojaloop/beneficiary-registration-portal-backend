import { ApiService } from "./services/ApiService";

ApiService.start().then(() => {
  console.log("BRP Backend Server Started...");
});
