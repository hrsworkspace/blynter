import { redirect } from 'next/navigation';

const notFound = () => {
  redirect('/');
};

export default notFound;
