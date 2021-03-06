import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { HomeComponent } from './home/home.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CardComponent } from './shared/card/card.component';
import { LoginComponent } from './users/login/login.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SignUpComponent } from './users/sign-up/sign-up.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutModule } from '@angular/cdk/layout';
import { NotificationComponent } from './shared/notification/notification.component';
import { AppService } from './services/app.service';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { AuthGuard } from './shared/auth-guard/auth.guard';
import { SummaryCardComponent } from './shared/summary-card/summary-card.component';
import { OrdersTableComponent } from './orders/orders-table/orders-table.component';
import { OrderTrackerComponent } from './orders/order-tracker/order-tracker.component';
import { CreateOrderComponent } from './orders/create-order/create-order.component';
import { OrderItemsComponent } from './orders/order-items/order-items.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { DeleteDialogComponent } from './shared/delete-dialog/delete-dialog.component';
import { ViewOrderComponent } from './orders/view-order/view-order.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { ProductsCardComponent } from './products/products-card/products-card.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { LineChartComponent } from './shared/charts/line-chart/line-chart.component';
import { BarChartComponent } from './shared/charts/bar-chart/bar-chart.component';
import { PieChartComponent } from './shared/charts/pie-chart/pie-chart.component';
import { ComparisonChartComponent } from './shared/charts/comparison-chart/comparison-chart.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { CustomerDetailComponent } from './users/customer-detail/customer-detail.component';



@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    CardComponent,
    LoginComponent,
    SignUpComponent,
    DashboardComponent,
    NotificationComponent,
    UserProfileComponent,
    SummaryCardComponent,
    OrdersTableComponent,
    OrderTrackerComponent,
    CreateOrderComponent,
    OrderItemsComponent,
    OrderListComponent,
    DeleteDialogComponent,
    ViewOrderComponent,
    ProductListComponent,
    AddProductComponent,
    ProductsCardComponent,
    ProductDetailsComponent,
    LineChartComponent,
    BarChartComponent,
    PieChartComponent,
    ComparisonChartComponent,
    UsersListComponent,
    CustomerDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    NgxMatFileInputModule,
    ChartsModule,
    Ng2SearchPipeModule,
  ],
  providers: [AppService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
