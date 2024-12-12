import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCopiesComponent } from './manage-copies.component';

describe('ManageCopiesComponent', () => {
  let component: ManageCopiesComponent;
  let fixture: ComponentFixture<ManageCopiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCopiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCopiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
