import { redirect } from 'next/navigation';

/**
 * /register → redirects permanently to /signup
 * Keeps backward compatibility with old links and the README route table.
 */
export default function RegisterPage() {
  redirect('/signup');
}
