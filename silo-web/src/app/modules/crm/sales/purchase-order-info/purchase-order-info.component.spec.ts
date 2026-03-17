import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderInfoComponent } from './purchase-order-info.component';

describe('PurchaseOrderInfoComponent', () => {
  let component: PurchaseOrderInfoComponent;
  let fixture: ComponentFixture<PurchaseOrderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseOrderInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
