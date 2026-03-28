// Angular modules
import { Component }        from '@angular/core';
import { OnInit }           from '@angular/core';

// External modules
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject }  from 'rxjs';

@Component({
  selector    : 'app-root',
  templateUrl : './app.component.html',
  styleUrls   : ['./app.component.scss']
})
export class AppComponent implements OnInit
{
  // ───────────────────────────────────────────────────────────────────────
  // NOTE Zera Copilot: User context for role-based access
  // ───────────────────────────────────────────────────────────────────────
  
  public companyId$ = new BehaviorSubject<string | null>(
    localStorage.getItem('companyId')
  );
  
  public userId$ = new BehaviorSubject<string | null>(
    localStorage.getItem('userId')
  );

  constructor
  (
    private translateService : TranslateService,
  )
  {
    // NOTE This language will be used as a fallback when a translation isn't found in the current language
    this.translateService.setDefaultLang('en');
    // NOTE The lang to use, if the lang isn't available, it will use the current loader to get them
    // let userLanguage = StorageHelper.getLanguage();
    // if (!userLanguage)
    let userLanguage = 'en';
    this.translateService.use(userLanguage);
  }

  // -------------------------------------------------------------------------------
  // NOTE Init ---------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public ngOnInit() : void
  {
  }

  // -------------------------------------------------------------------------------
  // NOTE Actions ------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Computed props -----------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Helpers ------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Requests -----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Subscriptions ------------------------------------------------------------
  // -------------------------------------------------------------------------------
}
