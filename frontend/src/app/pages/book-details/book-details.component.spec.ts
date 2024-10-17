import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookDetailsComponent } from './book-details.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // Para simular observables

describe('BookDetailsComponent', () => {
  let component: BookDetailsComponent;
  let fixture: ComponentFixture<BookDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            // Simula un parámetro de ruta con id 1
            paramMap: of({
              get: (key: string) => '1'  // Simula el id de la ruta
            })
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});