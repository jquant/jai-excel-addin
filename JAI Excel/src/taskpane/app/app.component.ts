import { Component } from "@angular/core";
import { authenticate, getEnvironments, getDatabaseInfo, setEnvironment } from "jai-sdk";

@Component({
  selector: "app-home",
  templateUrl: "./app.component.html",
})
export default class AppComponent {
  apiKey: string = "";

  isAuthenticated: boolean = false;

  environments = [];

  async login() {
    try {
      if (!this.apiKey) {
        return;
      }
      authenticate(this.apiKey);

      this.environments = await getEnvironments();
      setEnvironment(null);
      this.isAuthenticated = true;

      console.log(await getDatabaseInfo("complete"));
      console.log(await getDatabaseInfo("names"));
    } catch (error) {
      console.error(error);
    }
  }
}
