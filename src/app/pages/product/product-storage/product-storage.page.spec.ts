import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductStoragePage } from './product-storage.page';

describe('ProductStoragePage', () => {
  let component: ProductStoragePage;
  let fixture: ComponentFixture<ProductStoragePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductStoragePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductStoragePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
