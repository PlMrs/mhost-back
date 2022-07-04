import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { UserRole } from "../../users/entities/user.entity";

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {

  constructor(private reflector: Reflector){
    super();
  }
  
  handleRequest(err: any, user: any, info: any, context: any, status?: any) {

    if (!err && user) {
      //Récupération de tout les rôles utilisateurs
      const role = user.role as UserRole;
      //Récupération de la metadata roles dans le contexte contenant les rôles utilisteurs demandés pour continuer la requête
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      //Récupération de la metadata verified spécifiant si oui ou non l'utilisateur doit avoir un statut vérifié
      const verified = this.reflector.get<boolean>('verified', context.getHandler())


      if((verified === true || verified === false) && roles){
        if(user.verified === verified && roles.includes(role)){
          //Ajout de l'utilisateur dans la requête
          return user;
        }
      }
      else{
        if (roles && roles.includes(role)){ 
          return user;
        }
        if ((verified === true || verified === false) && user.verified === verified){
          return user;
        }
      }

    }
    throw err || new UnauthorizedException();
  }
}
