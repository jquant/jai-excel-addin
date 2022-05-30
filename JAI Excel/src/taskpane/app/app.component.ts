import { Component } from "@angular/core";
import { authenticate, getEnvironments, getDatabaseInfo } from "jai-sdk";

/* global console, Excel */

@Component({
  selector: "app-home",
  templateUrl: "./app.component.html",
})
export default class AppComponent {
  apiKey: string = "";

  isAuthenticated: boolean = false;

  enviroments = [];

  async login() {
    try {
      if (!this.apiKey) {
        return;
      }
      authenticate(this.apiKey);

      this.enviroments = await getEnvironments();

      this.isAuthenticated = true;

      console.log(await getDatabaseInfo("complete"));
      console.log(await getDatabaseInfo("names"));
    } catch (error) {
      console.error(error);
    }
  }
}
