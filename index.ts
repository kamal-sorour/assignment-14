export class User {
  public readonly id: number;
  public name: string;
  public email: string;
  private password: string;
  protected phone: string;
  private _age: number;
  public notebooks: NoteBook[] = [];

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    age: number
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this._age = 18;
    this.setAge(age);
  }

  public get age(): number {
    return this._age;
  }

  public setAge(value: number): void {
    if (value < 18 || value > 60) {
      throw new Error("Age must be between 18 and 60.");
    }
    this._age = value;
  }

  public displayInfo(): void {
    console.log(
      `User #${this.id} | Name: ${this.name} | Email: ${this.email} | Phone: ${this.phone} | Age: ${this._age}`
    );
  }

  public addNoteBook(notebook: NoteBook): void {
    this.notebooks.push(notebook);
  }
}

export class Admin extends User {
  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    age: number
  ) {
    super(id, name, email, password, phone, age);
  }

  public manageNotes(action: string, noteTitle: string): string {
    const msg = `Admin ${this.name} (${this.phone}) performed "${action}" on note "${noteTitle}".`;
    console.log(msg);
    return msg;
  }
}

export class Note {
  public id: number;
  public title: string;
  public content: string;
  public userId: number;
  public author?: User; 

  constructor(
    id: number,
    title: string,
    content: string,
    userId: number,
    author?: User
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.userId = userId;
    this.author = author;
  }

  public preview(maxLength: number = 25): string {
    if (this.content.length <= maxLength) {
      return this.content;
    }
    return `${this.content.slice(0, maxLength).trim()}...`;
  }
}

export class NoteBook {
  public id: number;
  public title: string;
  private notes: Note[] = [];

  constructor(id: number, title: string) {
    this.id = id;
    this.title = title;
  }

  // Composition: NoteBook creates/owns Note instances as part of its lifecycle
  public addNote(id: number, title: string, content: string, author: User): Note {
    const newNote = new Note(id, title, content, author.id, author);
    this.notes.push(newNote);
    return newNote;
  }

  public removeNote(noteId: number): boolean {
    const index = this.notes.findIndex((n) => n.id === noteId);
    if (index === -1) return false;
    this.notes.splice(index, 1);
    return true;
  }

  public getNotes(): Note[] {
    return [...this.notes];
  }
}

export class DataStorage<T> {
  private items: T[] = [];

  public addItem(item: T): void {
    this.items.push(item);
  }

  public removeItem(predicate: (item: T) => boolean): boolean {
    const index = this.items.findIndex(predicate);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  public getAllItems(): T[] {
    return [...this.items];
  }
}

const user1 = new User(1, "Kamal", "kamal@example.com", "Pass@123", "01001234567", 20);
const admin1 = new Admin(2, "Admin Ali", "admin@example.com", "Admin@123", "01098765432", 30);

const workBook = new NoteBook(101, "Work Notes");
user1.addNoteBook(workBook); // Aggregation

const n1 = workBook.addNote(
  1,
  "TypeScript OOP",
  "Practicing inheritance, composition, aggregation, association, and generics.",
  user1
);

user1.displayInfo();
console.log("Preview:", n1.preview(20));
admin1.manageNotes("PINNED", n1.title);

const stringStorage = new DataStorage<string>();
stringStorage.addItem("First Item");
stringStorage.addItem("Second Item");
console.log("Storage items:", stringStorage.getAllItems());