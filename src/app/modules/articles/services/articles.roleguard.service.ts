import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CIUser } from '../../../../../server/models/ci.user.model';
import { ArticlesService } from './articles.service';
import { Article } from '../../../../../server/models/article.model';

@Injectable()
export class ArticlesRoleGuard implements CanActivate {
    constructor(private articleAvc: ArticlesService, private authSvc: AuthService, private router: Router) { }

    /**
     * Method called to check whether the user has permissions to visit the page
     * 
     * @param {ActivatedRouteSnapshot} route 
     * @param {RouterStateSnapshot} state 
     * @returns 
     * @memberof ArticlesRoleGuard
     */
    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //required role to visit the page
        const requiredRole: string = route.data.expectedRole;

        if (requiredRole == 'viewArticles') {
            //get the article id
            let article_id: string = route.paramMap.get("id");
            //get the article from the server
            let article: Article = await this.articleAvc.getArticle(article_id);
            //if article exists, it means that user has permissions to read it
            if (article) {
                //just in case, we check if it's public or if the user is an editor
                if (article.isPublic || this.authSvc.authUser.canEditArticles()) {
                    return true;
                }
            } else {
                this.router.navigate(['/error/404'])
            }
        }
        if (this.authSvc.isLoggedIn) {
            let user: CIUser = this.authSvc.authUser;
            if (requiredRole == 'editArticles') {
                return user.canEditArticles();
            } else if (requiredRole == 'adminArticles') {
                return user.canAdminArticles();
            }
        }
        //if permission are not sufficient, error 403 is returned
        this.router.navigate(['/error/403']);
    }
}