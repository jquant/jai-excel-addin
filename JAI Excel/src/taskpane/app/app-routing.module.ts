import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import EnviromentsComponent from "./enviroments/enviroments.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "app",
    pathMatch: "full",
  },
  {
    path: "enviroments",
    component: EnviromentsComponent,
    data: {
      title: "Page 404",
    },
  },
  { path: "**", redirectTo: "app" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "top",
      anchorScrolling: "enabled",
      initialNavigation: "enabledBlocking",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
