import { Component, Input, OnInit } from '@angular/core';
import { StarsComponent } from '../stars/stars.component';

@Component({
  selector: 'comment',
  standalone: true,
  imports: [StarsComponent],
  templateUrl: './comment.component.html',
  styles: ``
})
export class CommentComponent implements OnInit {
  @Input() user_id: number = 0;
  @Input() rating: number = 0;
  @Input() body: string = '';
  user: any = null;

  async ngOnInit() {
    await this.getUser(this.user_id);
  }

  // Simulate an asynchronous function to get a user by ID
  // This method gets the user from the db in the future
  // A promise represents a value that will be available at some point in the future
  async getUser(user_id: number): Promise<void> {
    // Simulating a delay for a backend request using setTimeout
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.user = this.users.find(user => user.id === user_id);
  }

  getUserImage(user: any) {
    if (!user?.image || user?.image === '') {
      return `https://via.placeholder.com/150?text=${user?.name.charAt(0)}${user?.lastname.charAt(0)}`;
    }
    return user?.image;
  }

  // Users example (this will be the response of the db in the future)
  users = [
    {
      "id": 1,
      "name": "John",
      "lastname": "Doe",
      "email": "john.doe@example.com",
      "image": ""
    },
    {
      "id": 2,
      "name": "Jane",
      "lastname": "Smith",
      "email": "jane.smith@example.com",
      "image": "https://via.placeholder.com/150?text=JS"
    },
    {
      "id": 3,
      "name": "Alice",
      "lastname": "Johnson",
      "email": "alice.johnson@example.com",
      "image": "https://via.placeholder.com/150?text=AJ"
    },
    {
      "id": 4,
      "name": "Bob",
      "lastname": "Brown",
      "email": "bob.brown@example.com",
      "image": "https://via.placeholder.com/150?text=BB"
    },
    {
      "id": 5,
      "name": "Charlie",
      "lastname": "Davis",
      "email": "charlie.davis@example.com",
      "image": "https://via.placeholder.com/150?text=CD"
    },
    {
      "id": 6,
      "name": "David",
      "lastname": "Miller",
      "email": "david.miller@example.com",
      "image": "https://via.placeholder.com/150?text=DM"
    },
    {
      "id": 7,
      "name": "Emily",
      "lastname": "Wilson",
      "email": "emily.wilson@example.com",
      "image": "https://via.placeholder.com/150?text=EW"
    },
    {
      "id": 8,
      "name": "Frank",
      "lastname": "Taylor",
      "email": "frank.taylor@example.com",
      "image": "https://via.placeholder.com/150?text=FT"
    },
    {
      "id": 9,
      "name": "Grace",
      "lastname": "Anderson",
      "email": "grace.anderson@example.com",
      "image": "https://via.placeholder.com/150?text=GA"
    },
    {
      "id": 10,
      "name": "Henry",
      "lastname": "Thomas",
      "email": "henry.thomas@example.com",
      "image": "https://via.placeholder.com/150?text=HT"
    },
    {
      "id": 11,
      "name": "Isabella",
      "lastname": "Lee",
      "email": "isabella.lee@example.com",
      "image": "https://via.placeholder.com/150?text=IL"
    },
    {
      "id": 12,
      "name": "Jack",
      "lastname": "Garcia",
      "email": "jack.garcia@example.com",
      "image": "https://via.placeholder.com/150?text=JG"
    },
    {
      "id": 13,
      "name": "Kate",
      "lastname": "Martinez",
      "email": "kate.martinez@example.com",
      "image": "https://via.placeholder.com/150?text=KM"
    },
    {
      "id": 14,
      "name": "Liam",
      "lastname": "Hernandez",
      "email": "liam.hernandez@example.com",
      "image": "https://via.placeholder.com/150?text=LI"
    },
    {
      "id": 15,
      "name": "Mason",
      "lastname": "Moore",
      "email": "mason.moore@example.com",
      "image": "https://via.placeholder.com/150?text=MM"
    },
    {
      "id": 16,
      "name": "Nathan",
      "lastname": "Jackson",
      "email": "nathan.jackson@example.com",
      "image": "https://via.placeholder.com/150?text=NJ"
    },
    {
      "id": 17,
      "name": "Olivia",
      "lastname": "Lee",
      "email": "olivia.lee@example.com",
      "image": "https://via.placeholder.com/150?text=OL"
    },
    {
      "id": 18,
      "name": "Sophia",
      "lastname": "Martin",
      "email": "sophia.martin@example.com",
      "image": "https://via.placeholder.com/150?text=SM"
    },
    {
      "id": 19,
      "name": "Thomas",
      "lastname": "Thompson",
      "email": "thomas.thompson@example.com",
      "image": "https://via.placeholder.com/150?text=TT"
    },
    {
      "id": 20,
      "name": "William",
      "lastname": "White",
      "email": "william.white@example.com",
      "image": "https://via.placeholder.com/150?text=WW"
    }
  ]  
}
