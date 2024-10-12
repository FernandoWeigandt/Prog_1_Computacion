import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarsComponent } from './stars.component';

describe('StarsComponent', () => {
  let component: StarsComponent;
  let fixture: ComponentFixture<StarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it create a new test
  it('should return correct stars for a given rating', () => {
    const result1 = component.getStars(4.3); // 4 estrellas llenas, 1 media, 0 vacías
    expect(result1.fullStars).toBe(4);
    expect(result1.halfStars).toBe(0);
    expect(result1.emptyStars).toBe(1);

    const result2 = component.getStars(2.5); // 2 estrellas llenas, 1 media, 2 vacías
    expect(result2.fullStars).toBe(2);
    expect(result2.halfStars).toBe(1);
    expect(result2.emptyStars).toBe(2);

    const result3 = component.getStars(3); // 3 estrellas llenas, 0 medias, 2 vacías
    expect(result3.fullStars).toBe(3);
    expect(result3.halfStars).toBe(0);
    expect(result3.emptyStars).toBe(2);
  });
});
