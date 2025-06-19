import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NuevoBonoComponent } from './pages/nuevo-bono/nuevo-bono.component';
import { ListaBonosComponent } from './pages/lista-bonos/lista-bonos.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'nuevo-bono', component: NuevoBonoComponent, canActivate: [AuthGuard] },
  { path: 'lista-bonos', component: ListaBonosComponent, canActivate: [AuthGuard] },
  { path: 'configuracion', component: ConfiguracionComponent, canActivate: [AuthGuard] },
] 