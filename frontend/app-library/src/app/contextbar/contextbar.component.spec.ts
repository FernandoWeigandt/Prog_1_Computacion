import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextbarComponent } from './contextbar.component';

describe('ContextbarComponent', () => {
  let component: ContextbarComponent;
  let fixture: ComponentFixture<ContextbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContextbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContextbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
