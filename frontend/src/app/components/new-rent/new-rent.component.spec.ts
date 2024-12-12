import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRentComponent } from './new-rent.component';

describe('NewRentComponent', () => {
  let component: NewRentComponent;
  let fixture: ComponentFixture<NewRentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
