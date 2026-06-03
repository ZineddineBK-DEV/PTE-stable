import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { InternsService } from 'src/app/core/service/interns.service';
import { CreateOfferComponent } from './create-offer/create-offer.component';
import { InternshipOffer } from 'src/app/core/models/InternshipOffer';
import { OfferDetailsComponent } from './offer-details/offer-details.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { EditOfferComponent } from './edit-offer/edit-offer.component';
import { AssignQuizToOfferComponent } from './assign-quiz-to-offer/assign-quiz-to-offer.component';
import { FillQuizComponent } from './fill-quiz/fill-quiz.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
  providers: [ToastrService],
})
export class OffersComponent {
  offers: any[] = []
  archivedOffers!: any[]
  userId!: string
  userRole!: string
  temp: any[] = [];
  tempArchive: any[] = [];
  active!: number;
  loading!: boolean

  // Filter options
  searchQuery: string = '';
  searchQueryArchived: string = '';
  selectedDepartment: string = 'all';
  selectedDepartmentArchived: string = 'all';

  // Chart options
  departmentChartOptions: any;
  offerStatusChartOptions: any;

  constructor(
    private offerService: InternsService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('roles')!
    this.userId = localStorage.getItem('userId')!
    this.getAllOffers()
  }

  getAllOffers() {
    this.offerService.getOffers().subscribe(res => {
      this.offers = [...res.data];
      this.archivedOffers = this.offers.filter(o => o.archived === true);
      this.offers = this.offers.filter(o => o.archived === false);
      this.offers.reverse();
      this.archivedOffers.reverse();
      this.tempArchive = [...this.archivedOffers]
      this.temp = [...this.offers];
      this.createCharts();
    });
  }

  redirectDetails(offerId: string) {
    this.router.navigate(['/dashboard/offerDetails/' + offerId])
  }

  updateFilter(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.applyFilters();
  }

  updateFilterArchived(event: any) {
    this.searchQueryArchived = event.target.value.toLowerCase();
    this.applyArchivedFilters();
  }

  applyFilters() {
    let filtered = [...this.temp];

    // Search filter
    if (this.searchQuery) {
      filtered = filtered.filter((d: any) =>
        d.departement.toLowerCase().indexOf(this.searchQuery) !== -1 ||
        d.title.toLowerCase().indexOf(this.searchQuery) !== -1 ||
        d.technologies.toLowerCase().indexOf(this.searchQuery) !== -1
      );
    }

    // Department filter
    if (this.selectedDepartment !== 'all') {
      filtered = filtered.filter((d: any) => d.departement === this.selectedDepartment);
    }

    this.offers = filtered;
  }

  applyArchivedFilters() {
    let filtered = [...this.tempArchive];

    // Search filter
    if (this.searchQueryArchived) {
      filtered = filtered.filter((d: any) =>
        d.departement.toLowerCase().indexOf(this.searchQueryArchived) !== -1 ||
        d.title.toLowerCase().indexOf(this.searchQueryArchived) !== -1 ||
        d.technologies.toLowerCase().indexOf(this.searchQueryArchived) !== -1
      );
    }

    // Department filter
    if (this.selectedDepartmentArchived !== 'all') {
      filtered = filtered.filter((d: any) => d.departement === this.selectedDepartmentArchived);
    }

    this.archivedOffers = filtered;
  }

  filterByDepartment(dept: string) {
    this.selectedDepartment = dept;
    this.applyFilters();
  }

  filterByDepartmentArchived(dept: string) {
    this.selectedDepartmentArchived = dept;
    this.applyArchivedFilters();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedDepartment = 'all';
    this.offers = [...this.temp];
  }

  clearArchivedFilters() {
    this.searchQueryArchived = '';
    this.selectedDepartmentArchived = 'all';
    this.archivedOffers = [...this.tempArchive];
  }

  getUniqueDepartments(): string[] {
    const depts = this.temp.map(o => o.departement).filter(d => d);
    return [...new Set(depts)];
  }

  getUniqueDepartmentsArchived(): string[] {
    const depts = this.tempArchive.map(o => o.departement).filter(d => d);
    return [...new Set(depts)];
  }

  // Stats getters
  get totalActiveOffers(): number {
    return this.temp.length;
  }

  get totalArchivedOffers(): number {
    return this.tempArchive.length;
  }

  get cyberSecurityCount(): number {
    return this.temp.filter(o => o.departement === 'Cyber Security').length;
  }

  get developmentCount(): number {
    return this.temp.filter(o => o.departement === 'Development').length;
  }

  get systemCount(): number {
    return this.temp.filter(o => o.departement === 'System').length;
  }

  get networkingCount(): number {
    return this.temp.filter(o => o.departement === 'Networking').length;
  }

  get expiringCount(): number {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return this.temp.filter(o => {
      const expDate = new Date(o.expirationDate);
      return expDate >= today && expDate <= thirtyDaysFromNow;
    }).length;
  }

  createOffer() {
    const modalRef: NgbModalRef = this.modalService.open(CreateOfferComponent, {
      keyboard: false,
      backdropClass: 'light-blue-backdrop',
      size: 'lg'
    });
    modalRef.result.then((res) => {
      this.getAllOffers()
    })
  }

  deleteOffer(id: string) {
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
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({ title: 'Deleted!', text: 'Offer has been deleted.', icon: 'success', confirmButtonColor: '#47A992', });
        this.offerService.deleteOffer(id).subscribe(res => {
          this.offers = this.offers.filter(r => r._id !== id);
          this.toastr.success(res.message, 'Success');
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Offer is safe :)',
          icon: 'warning',
          confirmButtonColor: '#47A992',
        })
      }
    })
  }

  editOfferModal(offer: InternshipOffer) {
    const modalRef: NgbModalRef = this.modalService.open(EditOfferComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      keyboard: false,
      backdropClass: 'light-blue-backdrop'
    });
    modalRef.componentInstance.payload = offer
    modalRef.result.then((res) => {
      this.getAllOffers()
    })
  }

  openOfferDetails(offer: InternshipOffer) {
    this.router.navigate(['/dashboard/offerDetails/' + offer._id])
  }

  FillQuizModal(id: string) {
    const modalRef: NgbModalRef = this.modalService.open(FillQuizComponent, {
      keyboard: false,
      backdropClass: 'light-blue-backdrop',
      size: 'lg'
    });
    modalRef.componentInstance.data = id
    modalRef.result.then((res) => {
      this.getAllOffers()
    })
  }

  createCharts() {
    this.createDepartmentChart();
    this.createOfferStatusChart();
  }

  createDepartmentChart() {
    const deptCounts: any = {};
    this.temp.forEach(offer => {
      const dept = offer.departement || 'Unknown';
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });

    const categories = Object.keys(deptCounts);
    const series = Object.values(deptCounts) as number[];

    this.departmentChartOptions = {
      series: [{
        name: 'Offers',
        data: series
      }],
      chart: {
        type: 'bar',
        height: 280,
        fontFamily: 'inherit',
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          horizontal: false,
          distributed: true,
          columnWidth: '60%'
        }
      },
      dataLabels: {
        enabled: true,
        offsetY: -25,
        style: {
          fontSize: '12px',
          colors: ['#333']
        }
      },
      colors: ['#667eea', '#26A69A', '#FFA726', '#EF5350'],
      xaxis: {
        categories: categories,
        labels: {
          style: { fontSize: '12px' }
        }
      },
      yaxis: {
        labels: {
          formatter: function (val: number) {
            return val.toFixed(0);
          }
        }
      },
      grid: { borderColor: '#f1f1f1' },
      legend: { show: false }
    };
  }

  createOfferStatusChart() {
    this.offerStatusChartOptions = {
      series: [this.totalActiveOffers, this.totalArchivedOffers],
      chart: {
        type: 'donut',
        height: 280,
        fontFamily: 'inherit'
      },
      labels: ['Active Offers', 'Archived Offers'],
      colors: ['#66BB6A', '#95a5a6'],
      legend: {
        position: 'bottom',
        fontSize: '14px'
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
                label: 'Total Offers',
                fontSize: '16px',
                fontWeight: 600
              }
            }
          }
        }
      }
    };
  }
}