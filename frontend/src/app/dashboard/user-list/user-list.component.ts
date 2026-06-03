import { Component, HostListener, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent, SortType } from '@swimlane/ngx-datatable';
import { User } from 'src/app/core/models/user';
import { UserServiceService } from 'src/app/core/service/user-service.service';
import Swal from 'sweetalert2';
import { UserDetailsComponent } from './user-details/user-details.component';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { InternsService } from 'src/app/core/service/interns.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  readonly picsUrl = environment.PICSURL;
  rows: any[] = [];
  temp: any[] = [];
  filteredRows: any[] = [];
  loadingIndicator!: boolean
  reorderable = true;
  SortType = SortType;
  scrollBarHorizontal = window.innerWidth < 1200;
  users!: any[];
  employeesCount!: number
  user!: any;
  userRole: string = ""
  
  // View mode toggle
  viewMode: 'cards' | 'table' = 'cards';
  
  // Filter options
  selectedRole: string = 'all';
  selectedStatus: string = 'all';
  selectedDepartment: string = 'all';
  searchQuery: string = '';
  
  // Chart options for user stats
  userStatsChartOptions: any;
  departmentChartOptions: any;
  
  @ViewChild('table') table!: DatatableComponent;

  constructor(
    private internService: InternsService,
    public userService: UserServiceService,
    private modalService: NgbModal,
    private router: Router) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem("roles")!
    this.loadingIndicator = true
    this.getUsers()
  }

  getUsers() {
    this.userService.getEmployees().subscribe(resultat => {
      console.log("user LIST",resultat)
      this.rows = resultat as any[];
      this.rows = this.rows.filter(row => row._id !== localStorage.getItem('userId') && row.external !== true);
      this.temp = [...this.rows];
      this.filteredRows = [...this.rows];
      this.employeesCount = this.rows.length;
      this.loadingIndicator = false;
      this.createUserStatsChart();
      this.createDepartmentChart();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    if (this.table) {
      this.table.recalculate();
      this.table.recalculateColumns();
    }
  }

  getRowHeight(row: any) {
    return row.height;
  }

  toggleViewMode(mode: 'cards' | 'table') {
    this.viewMode = mode;
  }

  updateFilter(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.applyFilters();
  }

  filterByRole(role: string) {
    this.selectedRole = role;
    this.applyFilters();
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    this.applyFilters();
  }

  filterByDepartment(dept: string) {
    this.selectedDepartment = dept;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.temp];

    // Search filter
    if (this.searchQuery) {
      filtered = filtered.filter((d: any) =>
        d.firstName.toLowerCase().indexOf(this.searchQuery) !== -1 ||
        d.lastName.toLowerCase().indexOf(this.searchQuery) !== -1 ||
        d.email.toLowerCase().indexOf(this.searchQuery) !== -1 ||
        d.departement?.toLowerCase().indexOf(this.searchQuery) !== -1
      );
    }

    // Role filter
    if (this.selectedRole !== 'all') {
      filtered = filtered.filter((d: any) => d.roles && d.roles[0] === this.selectedRole);
    }

    // Status filter
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter((d: any) => d.isEnabled === this.selectedStatus);
    }

    // Department filter
    if (this.selectedDepartment !== 'all') {
      filtered = filtered.filter((d: any) => d.departement === this.selectedDepartment);
    }

    this.rows = filtered;
    this.filteredRows = filtered;
    
    if (this.table) {
      this.table.offset = 0;
    }
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedRole = 'all';
    this.selectedStatus = 'all';
    this.selectedDepartment = 'all';
    this.rows = [...this.temp];
    this.filteredRows = [...this.temp];
    if (this.table) {
      this.table.offset = 0;
    }
  }

  getUniqueRoles(): string[] {
    const roles = this.temp.map(u => u.roles ? u.roles[0] : '').filter(r => r);
    return [...new Set(roles)];
  }

  getUniqueDepartments(): string[] {
    const depts = this.temp.map(u => u.departement).filter(d => d);
    return [...new Set(depts)];
  }

  switchToExternalUser(userID: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Yes, switch it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({ title: 'Switched!', text: 'User has been switched to external.', icon: 'success', confirmButtonColor: '#47A992', });
        this.userService.switchUser(userID).subscribe(resultat => {
          this.loadingIndicator == true
          this.rows = this.rows.filter(row => row._id !== userID);
          this.filteredRows = this.filteredRows.filter(row => row._id !== userID);
        })
        this.loadingIndicator = false
        this.router.navigate(['dashboard/external'])
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          text: 'User is safe :)',
          icon: 'warning',
          confirmButtonColor: '#47A992',
        })
      }
    })
  }

  showUserDetailsModal(user: any) {
    const modalRef: NgbModalRef = this.modalService.open(UserDetailsComponent, {
      size: 'lg',
      keyboard: false,
      backdropClass: 'light-blue-backdrop'
    });
    modalRef.componentInstance.payload = user
    modalRef.componentInstance.title = "User details"
    this.user = user
  }

  changeRole(userId: string) {
    let roles = ["ASSISTANT", "LAB-MANAGER", "ENGINEER"]
    let currentUserRole = ""
    let user
    this.userService.getUserById(userId).subscribe(res => {
      user = res as any
      currentUserRole = user.roles![0]
      if (currentUserRole !== "ENGINEER") {
        let index = roles.indexOf(currentUserRole)
        let newRoles = []
        newRoles.push(roles[index + 1])
        this.userService.updateRoles(userId, { roles: newRoles }).subscribe(res => {
        })
        this.getUsers()
      } else {
        let index = roles.indexOf("ASSISTANT")
        let newRoles = []
        newRoles.push(roles[index])
        this.userService.updateRoles(userId, { roles: newRoles }).subscribe(res => {
        })
        this.getUsers()
      }
    })
  }

  getRoleBadgeClass(role: string): string {
    const roleMap: any = {
      'ADMIN': 'badge-admin',
      'ASSISTANT': 'badge-assistant',
      'LAB-MANAGER': 'badge-lab-manager',
      'ENGINEER': 'badge-engineer'
    };
    return roleMap[role] || 'badge-default';
  }

  createUserStatsChart() {
    const activeCount = this.temp.filter(u => u.isEnabled === 'Active').length;
    const inactiveCount = this.temp.filter(u => u.isEnabled === 'Inactive').length;

    this.userStatsChartOptions = {
      series: [activeCount, inactiveCount],
      chart: {
        type: 'donut',
        height: 250,
        fontFamily: 'inherit'
      },
      labels: ['Active Users', 'Inactive Users'],
      colors: ['#66BB6A', '#EF5350'],
      legend: {
        position: 'bottom',
        fontSize: '13px'
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val.toFixed(0) + '%';
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                fontSize: '16px',
                fontWeight: 600
              }
            }
          }
        }
      }
    };
  }

  createDepartmentChart() {
    const deptCounts: any = {};
    this.temp.forEach(user => {
      const dept = user.departement || 'Unknown';
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });

    const categories = Object.keys(deptCounts);
    const series = Object.values(deptCounts) as number[];

    this.departmentChartOptions = {
      series: [{
        name: 'Users',
        data: series
      }],
      chart: {
        type: 'bar',
        height: 250,
        fontFamily: 'inherit',
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          horizontal: true,
          distributed: true
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '11px',
          colors: ['#fff']
        }
      },
      colors: ['#667eea', '#26A69A', '#FFA726', '#EF5350', '#42A5F5'],
      xaxis: {
        categories: categories,
        labels: {
          formatter: function (val: number) {
            return val.toFixed(0);
          }
        }
      },
      yaxis: {
        labels: {
          style: { fontSize: '11px' }
        }
      },
      grid: { borderColor: '#f1f1f1' }
    };
  }

  get activeUsersCount(): number {
  return this.temp.filter(u => u.isEnabled === 'Active').length;
}

get inactiveUsersCount(): number {
  return this.temp.filter(u => u.isEnabled === 'Inactive').length;
}

}