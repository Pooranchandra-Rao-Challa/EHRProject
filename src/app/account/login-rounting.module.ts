import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { RubyAuthenticationFailedComponenet } from './ruby.authentication.failed.component';
import { RegistrationComponent } from "../account/registration.component";
import { HomeComponent } from "../account/home.comonent";

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'rubyloginfailed', component: RubyAuthenticationFailedComponenet },
      { path: 'registration', component: RegistrationComponent },
      { path: 'home', component: HomeComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LoginRoutingModule { }
