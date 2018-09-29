import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { UserModel } from '../../../../../server/models/classes/user.model';
import { tap } from 'rxjs/operators';

@Directive({
  selector: '[ifRole]'
})
export class RoleDirective {

  @Input("ifRole") role: string;
  @Input("ifRoleIfParam") extraParam: any;

  user$: Subscription;

  constructor(private auth: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) {
  }

  ngOnInit() {
    this.user$ = this.auth.user.pipe(
      tap(() => this.viewContainer.clear()))
      .subscribe((u: UserModel) => {
        if (u.id) {
          if (this.checkCondition(u)) {
            this.viewContainer.createEmbeddedView(this.templateRef)
          } else {
            this.viewContainer.clear();
          }
        } else if (this.role === "guest") {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });

  }

  ngOnDestroy() {
    this.user$.unsubscribe();
  }

  checkCondition(u: UserModel): boolean {
    switch (this.role) {
      case "guest":
        return false;
      case "user":
        return true;
      case "aUsers":
        return u.canAdminUsers();
      case "aTeams":
        return u.canAdminTeams();
      case "lTeam":
        return u.isLeaderOf(this.extraParam);
      case "mTeam":
        return u.canManageTeam(this.extraParam);
      case "mTeams":
        return u.canManageTeams();
      case "aArticles":
        return u.canAdminArticles();
      case "eArticles":
        return u.canEditArticles();
      case "aTutorials":
        return u.canAdminTutorials();
      case "cTutorials":
        return u.canCreateTutorials();
      case "pTutorials":
        return u.canPublishTutorials();
      case "ePages":
        return u.canEditPages();
      default:
        return false;
    }
  }
}
