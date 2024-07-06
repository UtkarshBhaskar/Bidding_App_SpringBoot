import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ApiManagerService} from '../../_services/api-manager.service';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {AlertService} from '../../_alert';
import {Router} from '@angular/router';
import {RegistrationRequestBody} from '../../_models/RegistrationRequestBody';
import {TranslateService} from '@ngx-translate/core';
import {LoggerService} from 'src/app/shared/logger.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.html']
})
export class SignupComponent implements OnInit, AfterViewInit {
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  registerForm: FormGroup;
  submitted = false;

  constructor(private apiManagerService: ApiManagerService,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private alertService: AlertService,
              private router: Router,
              private registrationRequestBody: RegistrationRequestBody,
              private translate: TranslateService,
              private loggerService: LoggerService) {
    translate.addLangs(['us', 'fr']);
    translate.setDefaultLang(localStorage.getItem('selected_lang'));
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, this.customEmailValidator.bind(this)]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      hostel: ['', Validators.required],
    });

    this.registerForm.get('email').valueChanges.subscribe((email) => {
      // Update 'username' form control with the first 9 characters of the email
      const usernameControl = this.registerForm.get('username');
      if (usernameControl && email && email.length >= 9) {
        const usernameValue = email.substring(0, 9);
        usernameControl.setValue(usernameValue);
        usernameControl.disable();
      }
    });
  }

  customEmailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    // Use a regular expression to match the specified pattern
    const pattern = /^f20[12][0-3][0-9]{4}@hyderabad\.bits-pilani\.ac\.in$/;

    return pattern.test(value) ? null : {invalidEmail: true};
  }

  customValidator() {
    return (control) => {
      const value = control.value;

      // Use a regular expression to match the specified pattern
      const pattern = /^(201[4-9]|202[0-3])([A-Z][0-9])PS([1-9]\d{0,2}|[1-2]\d{3})H$/;

      return pattern.test(value) ? null : {invalidFormat: true};
    };
  }

  ngAfterViewInit() {
  }

  get fields() {
    return this.registerForm.controls;
  }

  public doRegistration(): void {
    this.spinner.show();
    this.submitted = true;
    if (this.registerForm.invalid) {
      this.spinner.hide();
      this.loggerService.log('registerForm', this.registerForm);
      return;
    }

    this.registrationRequestBody = this.registerForm.getRawValue();
    this.registrationRequestBody.role = ['user'];
    console.log('registrationRequestBody', this.registrationRequestBody);

    this.apiManagerService.registration(this.registrationRequestBody).subscribe((response: any) => {
        this.spinner.hide();
        this.loggerService.log('response', response);
        this.router.navigate(['authentication/login']);
      },
      error => {
        this.spinner.hide();
        this.loggerService.log('error', error);
        this.alertService.error(error.error.message, {autoClose: true});
      });
  }
}
