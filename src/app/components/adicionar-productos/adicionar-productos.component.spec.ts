import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarProductosComponent } from './adicionar-productos.component';

describe('AdicionarProductosComponent', () => {
  let component: AdicionarProductosComponent;
  let fixture: ComponentFixture<AdicionarProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdicionarProductosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdicionarProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
