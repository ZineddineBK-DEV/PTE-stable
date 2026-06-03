import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/core/service/auth.service';
import { ThemeService } from 'src/app/core/service/theme.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-new-layout',
  templateUrl: './new-layout.component.html',
  styleUrls: ['./new-layout.component.scss'],
})
export class NewLayoutComponent implements OnInit, OnDestroy {
  readonly picsUrl = environment.PICSURL;
  user!: User;
  sidebarCollapsed = false;
  sidebarMobileOpen = false;
  currentRoute = '';
  isDark = false;
  userRoles: string[] = [];

  private routerSub!: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService
  ) {
    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentRoute = event.urlAfterRedirects;
        this.closeMobileSidebar();
      });

    this.themeService.theme$.subscribe((theme) => {
      this.isDark = theme === 'dark';
    });
  }

  ngOnInit(): void {
    this.authService.getUser().subscribe((user) => {
      this.user = user as User;
      if (this.user?.roles) {
        this.userRoles = Array.isArray(this.user.roles)
          ? this.user.roles
          : [this.user.roles];
      }
    });

    // Read roles from localStorage for initial sidebar rendering
    const storedRoles = localStorage.getItem('roles');
    if (storedRoles) {
      this.userRoles = storedRoles.split(',');
    }

    // Restore sidebar state
    const saved = localStorage.getItem('pte-sidebar-collapsed');
    if (saved === 'true') {
      this.sidebarCollapsed = true;
    }
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

  toggleSidebar(): void {
    if (window.innerWidth < 992) {
      this.sidebarMobileOpen = !this.sidebarMobileOpen;
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      localStorage.setItem('pte-sidebar-collapsed', String(this.sidebarCollapsed));
    }
  }

  closeMobileSidebar(): void {
    this.sidebarMobileOpen = false;
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/authentication/signin']);
  }

  getUserImage(): string {
    if (this.user?.image) {
      return this.picsUrl + this.user.image;
    }
    return 'assets/images/user.png';
  }

  getRoleLabel(): string {
    if (!this.userRoles.length) return '';
    if (this.userRoles.includes('ADMIN')) return 'Administrator';
    if (this.userRoles.includes('LAB-MANAGER')) return 'Lab Manager';
    if (this.userRoles.includes('ASSISTANT')) return 'Assistant';
    if (this.userRoles.includes('ENGINEER')) return 'Engineer';
    return this.userRoles[0];
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth >= 992) {
      this.sidebarMobileOpen = false;
    }
  }
}
