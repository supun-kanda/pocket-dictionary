import { render, screen } from '@testing-library/react';
import Main from '../components/Main';

test('renders learn react link', () => {
  render(<Main />);
  const linkElement = screen.getByText(/Log in with Google/i);
  expect(linkElement).toBeInTheDocument();
});
