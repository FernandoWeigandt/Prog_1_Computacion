import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { StarsComponent } from '../../components/stars/stars.component';
import { CommentComponent } from '../../components/comment/comment.component';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [NavbarComponent, ContextbarComponent, StarsComponent, CommentComponent],
  templateUrl: './book-details.component.html',
  styles: ``
})
export class BookDetailsComponent implements OnInit {
  bookId: number | null = null; // Number or null
  book: any | null = null;
  
  constructor(private route: ActivatedRoute) {}

  // This method is called when the component is initialized to get the book ID from the route
  // async/await is used to wait for the getBook method to finish (in other tread) while the 
  // component is initialized in the main tread (concurrency problem)
  async ngOnInit() {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    await this.getBook();
  }

  // This method is suposed to get the book based on the book ID making the proper http request to the backend
  getBook() {
    this.book = this.books.find(book => book.id === this.bookId);
    // If the book is found, sanitize data to avoid errors
    if (this.book) {
      this.book = {
        title: this.book.title || 'No title available',
        author: this.book.author || 'Unknown author',
        gender: this.book.gender || 'Unknown gender',
        quantity: this.book.quantity || 0,
        rating: this.book.rating || 0,
        image: this.book.image || 'media/default-book-cover.jpg',
        description: this.book.description || 'No description available',
        error: false
      };
    } else {
      this.book = {
        title: 'Error',
        author: '',
        gender: '',
        quantity: 0,
        rating: 0,
        image: '',
        description: '',
        error: true
      };
    }
  }

  // This books are just an example of the backend response data (similar than home component)
  // However this component woldn't ask for all the books in the backend, just one by ID
  // with complete data. (some parameters like book description and comments are asked here)
  // But this is array is just an example
  books = [
    {
      id: 1,
      title: 'Book 1',
      gender: 'Gender 1',
      author: 'Author 1',
      quantity: 1,
      rating: 4.2,
      image: 'https://picsum.photos/200/300',
      description: 'A thrilling adventure that takes the protagonist across vast landscapes in search of a long-lost artifact. Along the way, unexpected friendships are forged, and dangers abound.',
      comments: [
        { "user-id": 1, "commentary": "Great book, really enjoyed the plot.", "rate": 4.5 },
        { "user-id": 2, "commentary": "Interesting read but the ending was predictable.", "rate": 4.0 },
        { "user-id": 3, "commentary": "Loved the characters, well developed.", "rate": 4.8 },
        { "user-id": 4, "commentary": "Not bad, but could have been shorter.", "rate": 4.0 }
      ]
    },
    {
      id: 2,
      title: 'Book 2',
      gender: 'Gender 2',
      author: 'Author 2',
      quantity: 4,
      rating: 5,
      image: 'https://picsum.photos/200/300',
      description: 'In a world where magic and technology collide, a lone hero must confront their past to save their future. The stakes have never been higher in this epic fantasy adventure.',
      comments: [
        { "user-id": 5, "commentary": "Perfect book, loved every chapter!", "rate": 5.0 },
        { "user-id": 6, "commentary": "Best book I've read this year!", "rate": 5.0 },
        { "user-id": 7, "commentary": "A masterpiece, highly recommend it.", "rate": 5.0 },
        { "user-id": 8, "commentary": "Absolutely flawless writing.", "rate": 5.0 }
      ]
    },
    {
      id: 3,
      title: 'Book 3',
      gender: 'Gender 3',
      author: 'Author 3',
      quantity: 2,
      rating: 3,
      image: '',
      description: 'A small-town detective is faced with an unsolvable mystery that will challenge their beliefs and unravel dark secrets hidden deep within the town’s history.',
      comments: [
        { "user-id": 9, "commentary": "It was okay, nothing special.", "rate": 3.0 },
        { "user-id": 10, "commentary": "Some parts were dull, but others were good.", "rate": 3.2 },
        { "user-id": 11, "commentary": "Couldn’t get into it, too slow for me.", "rate": 2.8 },
        { "user-id": 12, "commentary": "Not the best, but readable.", "rate": 3.0 }
      ]
    },
    {
      id: 4,
      title: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perspiciatis magnam aut voluptatibus eum, mollitia ipsa aliquid, accusantium est natus modi dolor deserunt amet itaque fuga nam, omnis illo iste dolore!',
      gender: 'Gender 4',
      author: 'Author 4',
      quantity: 4,
      rating: 3.6,
      image: 'https://picsum.photos/200/300',
      description: 'A gripping tale of betrayal and redemption where the main character must navigate a web of lies to uncover the truth behind a crime that shakes their world.',
      comments: [
        { "user-id": 13, "commentary": "Some parts were confusing, but overall good.", "rate": 3.7 },
        { "user-id": 14, "commentary": "Interesting concept, but too long.", "rate": 3.5 },
        { "user-id": 15, "commentary": "Good read, but not memorable.", "rate": 3.6 },
        { "user-id": 16, "commentary": "Mixed feelings about this one.", "rate": 3.4 }
      ]
    }
  ]  
}
