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
        let reverse: boolean = false;
        let actualRole: string = this.role;
        if (this.role.startsWith("!")) {
          reverse = true;
          actualRole = actualRole.substr(1);
        }
        let check: boolean = this.checkCondition(u, actualRole);
        check = reverse ? !check : check;
        if (check) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });

  }

  ngOnDestroy() {
    this.user$.unsubscribe();
  }

  checkCondition(u: UserModel, role: string): boolean {
    switch (role) {
      case "guest":
        return (u.id === undefined)
      case "user":
        return (u.id !== undefined);
      case "aUsers":
        return (u.id !== undefined) && u.canAdminUsers();
      case "aTeams":
        return (u.id !== undefined) && u.canAdminTeams();
      case "lTeam":
        return (u.id !== undefined) && u.isLeaderOf(this.extraParam);
      case "mTeam":
        return (u.id !== undefined) && u.canManageTeam(this.extraParam);
      case "mTeams":
        return (u.id !== undefined) && u.canManageTeams();
      case "aArticles":
        return (u.id !== undefined) && u.canAdminArticles();
      case "eArticles":
        return (u.id !== undefined) && u.canEditArticles();
      case "aTutorials":
        return (u.id !== undefined) && u.canAdminTutorials();
      case "cTutorials":
        return (u.id !== undefined) && u.canCreateTutorials();
      case "pTutorials":
        return (u.id !== undefined) && u.canPublishTutorials();
      case "ePages":
        return (u.id !== undefined) && u.canEditPages();
      default:
        return false;
    }
  }
}
