import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CIUser } from '../../../../../server/models/ci.user.model';
import { ArticlesService } from './articles.service';
import { Article } from '../../../../../server/models/article.model';

@Injectable()
export class ArticlesRoleGuard implements CanActivate {
    constructor(private articleAvc: ArticlesService, private authSvc: AuthService, private router: Router) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const requiredRole: string = route.data.expectedRole;
        if (requiredRole == 'viewArticles') {
            let article_id: string = route.paramMap.get("id");
            let article: Article = await this.articleAvc.getArticle(article_id);
            if (article) {
                if (article.isPublic || this.authSvc.authUser.canEditArticles()) {
                    return true;
                }
            }
            return false;
        }
        if (this.authSvc.isLoggedIn) {
            let user: CIUser = this.authSvc.authUser;
            if (requiredRole == 'editArticles') {
                return user.canEditArticles();
            } else if (requiredRole == 'publishArticles') {
                return user.canPublishArticles();
            } else if (requiredRole == 'adminArticles') {
                return user.canAdminArticles();
            }
        }
    }
}