import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsInfoComponent } from './contacts-info.component';

describe('ContactsInfoComponent', () => {
  let component: ContactsInfoComponent;
  let fixture: ComponentFixture<ContactsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
