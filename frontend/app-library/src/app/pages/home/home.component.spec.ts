import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // Prueba para el método getBook
  it('should return the correct book by ID', () => {
    const book = component.getBook(1);
    expect(book).toEqual({
      id: 1,
      title: 'Book 1',
      gender: 'Gender 1',
      author: 'Author 1',
      quantity: 1,
    });
  });

  it('should return undefined for a non-existent book ID', () => {
    const book = component.getBook(999);
    expect(book).toBeUndefined();
  });
});
