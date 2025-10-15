// Angular modules
import { CommonModule } from '@angular/common';
import { Component, OnInit }    from '@angular/core';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormControl }  from '@angular/forms';
import { Validators }   from '@angular/forms';
import { ActivatedRoute, Router }       from '@angular/router';

// Internal modules
import { environment }  from '@env/environment';
import { CustomValidators, PasswordValidators } from '@helpers/password-validators';

// Services
import { AppService }   from '@services/app.service';
import { AuthService } from '@services/auth.service';
import { NotificationService } from '@services/notification.service';
import { StoreService } from '@services/store.service';
import { take, timer } from 'rxjs';
import { AuthRoutingModule } from '../auth-routing.module';
import { SharedModule } from '@sharedWeb/shared.module';
import { NgOtpInputModule } from 'ng-otp-input';

@Component({
  selector    : 'app-login',
  templateUrl : './login.component.html',
  styleUrls   : ['./login.component.scss'],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    SharedModule
  ],
  standalone: true
})
export class LoginComponent implements OnInit {

  userAction: 'email' | 'login' | 'create' | 'change' | 'reset' | 'verify' = 'verify';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoading:boolean = false;
  userEmail:string = '';

  resendingOtp:boolean = false;
  resetToken:string = '';
  timeLeft: number = 30;
  subscribeTimer:any;
  interval:any

  public authForm !: FormGroup<any>;
  loggedInUser:any;
  keepOrder = () => 0;

  accountTypeOptions = {
    Company: 'Company',
    Employee: 'Employee'
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notifyService: NotificationService,
  ){
    this.initFormGroup();
  }

  ngOnInit(): void {

    this.route.url.subscribe(urlSegments => {
      const path = urlSegments[0]?.path;
      switch (path) {
        case 'login':
          this.userAction = 'login';
          this.checkQueryParams();
          break;
        case 'signup':
          this.userAction = 'create';
          break;
        case 'reset-password':
          this.userAction = 'reset';
          this.setUserEmail();
          break;
        case 'verify':
          this.userAction = 'verify';
          this.getEmailQuery();
          break;
        case 'set-password':
          this.userAction = 'change';
          this.setUserEmail();
          break;
        default:
          this.userAction = 'login';
          break;
      }
    });
  }

  onOtpChange(otp: string) {
    this.authForm.get('otp')?.setValue(otp);
  }

  checkQueryParams() {
    // Only override if query param explicitly provided
    this.route.queryParams.subscribe(params => {
      if (params['action']) {
        this.userAction = params['action'];
      }
      else {
        this.userAction = this.userAction;
      }
    });
  }

  getEmailQuery(): void {
    this.route.queryParamMap.pipe(take(1)).subscribe(params => {
      const emailParam = params.get('email');

      if (emailParam) {
        // Use the email from the URL
        this.userEmail = emailParam;
        console.log('Email from query param:', this.userEmail);
        this.userEmail && this.authForm.controls['email'].setValue(this.userEmail)
        return;
      }

      this.setUserEmail();
    });
  }

  private initFormGroup(): void {
    this.authForm = new FormGroup(
      {
        accountType: new FormControl('', Validators.required),
        companyName: new FormControl('', Validators.required),
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl(
          '', 
          {
            validators: [
              Validators.required, 
              Validators.minLength(8),
              PasswordValidators.patternValidator(new RegExp("(?=.*[0-9])"), {
                requiresDigit: true
              }),
              PasswordValidators.patternValidator(new RegExp("(?=.*[A-Z])"), {
                requiresUppercase: true
              }),
              PasswordValidators.patternValidator(new RegExp("(?=.*[a-z])"), {
                requiresLowercase: true
              }),
              PasswordValidators.patternValidator(new RegExp("(?=.*[$@^!%*?&:])"), {
                requiresSpecialChars: true
              })
            ],
            updateOn: 'change'
          }
        ),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
        otp: new FormControl('', [Validators.minLength(4), Validators.maxLength(4)]),
      },
      {
        validators: CustomValidators.MatchingPasswords
      }
    );
  }

  get formCtrls() {
    return this.authForm.controls;
  }

  setUserEmail() {
    this.userEmail = <string>sessionStorage.getItem('userRegDetails')
    this.userEmail && this.authForm.controls['email'].setValue(JSON.parse(this.userEmail).email)
  }

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;

    // if one of the controls is missing, don't invalidate the form
    if (pass === undefined || confirmPass === undefined) {
      return null;
    }

    return pass === confirmPass ? null : { notSame: true };
  };

  goToLogin() {
    this.changeState('login')
    this.authForm.controls['email'].enable();
  }

  changeState(state:'email' | 'login' | 'create' | 'change' | 'reset' | 'verify') {
    this.userAction = state;

    switch (state) {
      case 'login':
        this.router.navigate(['/login']);
        break;

      case 'create':
        this.router.navigate(['/signup']);
        break;

      case 'reset':
        this.router.navigate(['/reset-password']);
        break;

      case 'verify':
        this.router.navigate(['/verify']);
        break;
      case 'change':
        this.router.navigate(['/set-password']);
        break;

      default:
        break;
    }
  }

  verifyEmail() {
    //this.changeState('verify');
    if(this.authForm.controls['email'].valid) {
      this.isLoading = true;
      let payload = {
        email: this.authForm.value.email,
      }
      sessionStorage.setItem('userRegDetails', JSON.stringify(payload));
      this.authService.verifyEmail(payload).subscribe({
        next: res => {
          //console.log(res);
          if (res.success) {
            this.changeState('verify')
            this.isLoading = false; 
            this.authForm.controls['email'].disable();
            this.notifyService.showSuccess('An OTP code has been successfully sent to your email');
            this.startTimer();
          }
        },
        error: err => {
          this.isLoading = false;  
        }
      })
    }
    else {
      this.notifyService.showError('Please check that the you have filled in your email address')
    }
  }

  verifyOtp() {
    //this.changeState('change');
    if(this.authForm.controls['otp'].valid) {
      this.isLoading = true;
      //console.log(this.userEmail, this.authForm.value.eamil)
      let payload = {
        email: this.authForm.value.email,
        otp: Number(this.authForm.value.otp)
      }
      this.authService.verifyOtp(payload).subscribe({
        next: res => {
          //console.log(res);
          if (res.success) {
            this.changeState('change')
            this.isLoading = false; 
            this.notifyService.showSuccess(res.message)
          }
        },
        error: err => {
          this.notifyService.showSuccess(err.error.message)
          this.isLoading = false;  
        }
      })
    }
    else {
      this.notifyService.showError('Please check that the you have filled in your email address')
    }
  }

  createAccount() {
    //this.changeState('verify');
    if(this.formCtrls['firstName'].valid && this.formCtrls['lastName'].valid && this.formCtrls['email'].valid) {
      this.isLoading = true;
      let payload = {
        firstName: this.authForm.value.firstName,
        lastName: this.authForm.value.lastName,
        email: this.authForm.value.email,
      }
      sessionStorage.setItem('userRegDetails', JSON.stringify(payload));
      this.authService.createAccount(payload).subscribe({
        next: res => {
          if (res.success) {
            this.changeState('verify');
            this.notifyService.showSuccess(res.message);
          }
        },
        error: err => {
          this.notifyService.showError(err.error.message);
          this.isLoading = false;  
        }
      })
    }
    else {
      this.authForm.markAllAsTouched();
      this.notifyService.showError('Please check that the you have filled in all required fields')
    }    
  }

  resendOtp() {
    this.isLoading = true
    this.startTimer();
    this.resendingOtp = true;
    // const userRegDetails = JSON.parse(sessionStorage.getItem('userRegDetails')!)
    // if(userRegDetails) this.authForm.controls['email'].setValue(userRegDetails.email)
    let payload = {
      email: this.authForm.value.email,
    }
    sessionStorage.setItem('userRegDetails', JSON.stringify(payload));
    //console.log('payload', payload)
    this.authService.verifyEmail(payload).subscribe({
      next: (res:any) => {
        //console.log(res);
        if (res.success) {
          this.isLoading = false;
          this.changeState('verify')
          this.notifyService.showSuccess(res.message);
          this.resendingOtp = false; 
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.resendingOtp = false;  
      }
    })
  }

  observableTimer() {
    const source = timer(1000, 2000);
    const abc = source.subscribe(val => {
      //console.log(val, '-');
      this.subscribeTimer = this.timeLeft - val;
    });
  }

  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } 
      else {
        this.timeLeft = 30;
        this.pauseTimer()
      }
    },1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  login(email?:string) {
    //this.router.navigate(['/register']);
    //console.log(this.authForm.value)
    if((this.authForm.controls['email'].valid) && this.authForm.controls['password'].valid) {
      this.isLoading = true;
      let payload = {
        email: email ? email : this.authForm.value.email,
        password: this.authForm.value.password
      }
      this.authService.login(payload).subscribe({
        next: res => {
          console.log(res);
          if(res.status == 200) {
            if(res.data.isSuperAdmin) {
              this.isLoading = false
              if(!res.data.activeStatus) this.router.navigate(['app/settings']);
              else this.router.navigate(['/welcome']);
            }
            else if(res.data.email == 'siloerp@silo-inc.com') {
              this.router.navigate(['app/silo']);
            }
            else {
              this.isLoading = false
              this.router.navigate(['app/human-resources/dashboard']);
            }
          }
        },
        error: err => {
          console.log(err)
          this.isLoading = false;
          this.notifyService.showError(err.error.error);
        } 
      })
    }
    else {
      this.authForm.markAllAsTouched();
      this.notifyService.showError('Please check that the you have filled in all required fields')
    }
   
  }

  setPassword() {
    //this.changeState('verify');
    const userRegDetails = JSON.parse(sessionStorage.getItem('userRegDetails')!)
    if(userRegDetails) this.authForm.controls['email'].setValue(userRegDetails.email)
    if(this.authForm.controls['email'].valid) {
      this.isLoading = true;
      let payload = {
        email: this.authForm.value.email,
        password: this.authForm.value.password,
        confirmPassword: this.authForm.value.confirmPassword
      }
      this.authService.setPassword(payload).subscribe({
        next: res => {
          //console.log('Reset', res);
          if (res.success) {
            this.notifyService.showSuccess(res.message);
            this.login(payload.email)
            this.isLoading = false;   
          }
        },
        error: err => {
          this.notifyService.showError(err.error.message);
          this.isLoading = false;  
        }
      })
    }
    else {
      this.authForm.markAllAsTouched();
      this.notifyService.showError('Please check that the you have filled in your email address')
    }
  }

  get requiredValid() {
    return !this.authForm.controls["password"].hasError("required");
  }

  get minLengthValid() {
    return !this.authForm.controls["password"].hasError("minlength");
  }

  get requiresDigitValid() {
    return !this.authForm.controls["password"].hasError("requiresDigit");
  }

  get requiresUppercaseValid() {
    return !this.authForm.controls["password"].hasError("requiresUppercase");
  }

  get requiresLowercaseValid() {
    return !this.authForm.controls["password"].hasError("requiresLowercase");
  }

  get requiresSpecialCharsValid() {
    return !this.authForm.controls["password"].hasError("requiresSpecialChars");
  }

  get matchValid() {
    return this.authForm.controls["confirmPassword"].touched && !this.authForm.controls["confirmPassword"].hasError("not_matching");
  }

}
