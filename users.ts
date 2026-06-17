export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export const users: User[] = [
  {
    id: '1',
    email: 'vivi@geekstore.com',
    password: 'Test1234!',
    name: 'Vivi'
  },
  {
    id: '2',
    email: 'admin@geekstore.com',
    password: 'Admin1234!',
    name: 'Admin'
  },
  {
    id: '3',
    email: 'test@geekstore.com',
    password: 'Wrong',  // intentionally weak for negative test cases
    name: 'Test User'
  }
];
