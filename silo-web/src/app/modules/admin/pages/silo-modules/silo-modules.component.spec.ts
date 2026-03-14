import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiloModulesComponent } from './silo-modules.component';

describe('SiloModulesComponent', () => {
  let component: SiloModulesComponent;
  let fixture: ComponentFixture<SiloModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiloModulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiloModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
